import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createCompany, getUserCompanies } from '@/lib/company';
import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(1).max(255),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

// GET /api/companies - Get user's companies
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companies = await getUserCompanies(userId);

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/companies - Create a new company
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validation = createCompanySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, industry, website } = validation.data;

    // Create company with user as owner
    const company = await createCompany(userId, {
      name,
      industry,
      website: website || undefined,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Failed to create company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
