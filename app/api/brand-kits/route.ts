import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { verifyCompanyAccess } from '@/lib/company';
import { generateColorPalette, getFontPairing, generateTagline } from '@/lib/api';
import {
  generateLogoWithGroq,
  isGroqConfigured,
  GroqLogoError,
} from '@/lib/api/groq-logo';
import {
  extractLogoSymbols,
  extractColorPreferences,
  extractBrandPersonality,
} from '@/lib/api/groq';
import { svgToDataURL, normalizeSVG, optimizeSVG } from '@/lib/api/logo-utils';
import { z } from 'zod';

const createBrandKitSchema = z.object({
  companyId: z.string().uuid(),
  businessName: z.string().min(1).max(255),
  businessDescription: z.string().optional(),
  industry: z.string().optional(),
  logoOption: z.enum(['generate', 'upload', 'skip']).default('generate'),
  logoBase64: z.string().optional(),
  colorOption: z.enum(['generate', 'existing']).default('generate'),
  existingColors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    neutral: z.string(),
    background: z.string(),
  }).optional(),
});

/**
 * GET /api/brand-kits
 * Get brand kits for a company
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    // Verify user has access to this company
    await verifyCompanyAccess(user.id, companyId);

    const brandKits = await prisma.brandKit.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(brandKits);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Failed to fetch brand kits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/brand-kits
 * Generate and create a new brand kit
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();

    // Validate input
    const validation = createBrandKitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      companyId,
      businessName,
      businessDescription,
      industry,
      logoOption,
      logoBase64,
      colorOption,
      existingColors,
    } = validation.data;

    // Verify user has access to this company
    await verifyCompanyAccess(user.id, companyId);

    console.log('🎨 Starting brand kit generation for:', businessName);

    // Step 1: Extract brand insights in parallel
    const [symbolsResult, colorPrefsResult, personalityResult] = await Promise.allSettled([
      extractLogoSymbols({
        businessName,
        description: businessDescription || '',
        industry: industry || '',
      }),
      extractColorPreferences({
        businessName,
        description: businessDescription || '',
        industry: industry || '',
      }),
      extractBrandPersonality({
        businessName,
        description: businessDescription || '',
        industry: industry || '',
      }),
    ]);

    const symbols =
      symbolsResult.status === 'fulfilled'
        ? symbolsResult.value
        : { primary: 'abstract symbol', secondary: 'geometric pattern', mood: 'professional' };

    const colorPrefs =
      colorPrefsResult.status === 'fulfilled'
        ? colorPrefsResult.value
        : { mood: 'professional' as const, trend: 'classic' as const, keywords: [] };

    // Step 2: Generate/use color palette
    const colorPalette =
      colorOption === 'existing' && existingColors
        ? existingColors
        : await generateColorPalette({
            businessName,
            description: businessDescription || '',
            industry: industry || '',
          });

    // Step 3: Generate logo, fonts, and tagline in parallel
    const [logoResult, fontPairingResult, taglineResult] = await Promise.allSettled([
      // Logo
      (async () => {
        if (logoOption === 'skip') return null;
        if (logoOption === 'upload' && logoBase64) {
          return { url: logoBase64, svgCode: undefined };
        }

        if (!isGroqConfigured()) {
          throw new GroqLogoError('GROQ_API_KEY not configured', 500, 'MISSING_API_KEY');
        }

        const result = await generateLogoWithGroq({
          businessName,
          description: businessDescription || '',
          industry: industry || '',
          symbols,
          colorPalette: {
            primary: colorPalette.primary,
            secondary: colorPalette.secondary,
            accent: colorPalette.accent,
          },
        });

        const normalizedSvg = normalizeSVG(result.svgCode);
        const optimizedSvg = optimizeSVG(normalizedSvg);
        const dataUrl = svgToDataURL(optimizedSvg);

        return { url: dataUrl, svgCode: optimizedSvg };
      })(),

      // Fonts
      getFontPairing({
        businessName,
        description: businessDescription || '',
        industry: industry || '',
      }),

      // Tagline
      generateTagline({
        businessName,
        description: businessDescription || '',
        industry: industry || '',
      }),
    ]);

    const logo = logoResult.status === 'fulfilled' ? logoResult.value : null;
    const fonts =
      fontPairingResult.status === 'fulfilled'
        ? fontPairingResult.value
        : { primary: 'Inter', secondary: 'Lora' };
    const tagline = taglineResult.status === 'fulfilled' ? taglineResult.value : '';

    // Save to database
    const brandKit = await prisma.brandKit.create({
      data: {
        companyId,
        createdBy: user.id,
        businessName,
        businessDescription: businessDescription || null,
        industry: industry || null,
        logoUrl: logo?.url || '',
        logoSvg: logo?.svgCode || null,
        colors: {
          primary: { name: 'Primary', hex: colorPalette.primary, usage: 'Main brand color' },
          secondary: { name: 'Secondary', hex: colorPalette.secondary, usage: 'Supporting color' },
          accent: { name: 'Accent', hex: colorPalette.accent, usage: 'Call-to-action' },
          neutral: { name: 'Neutral', hex: colorPalette.neutral, usage: 'Text and backgrounds' },
          background: { name: 'Background', hex: colorPalette.background, usage: 'Page background' },
        },
        fonts: {
          primary: fonts.primary,
          secondary: fonts.secondary,
        },
        tagline: tagline || null,
      },
    });

    console.log('✅ Brand kit created:', brandKit.id);

    return NextResponse.json(brandKit, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Failed to create brand kit:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
