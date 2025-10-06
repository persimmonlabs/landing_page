import { NextResponse } from 'next/server';
import { createCompany, getUserCompanies } from '@/lib/company';
import { requireUser } from '@/lib/supabase/server';
import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(1).max(255),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

// GET /api/companies - Get user's companies
export async function GET() {
  try {
    const user = await requireUser();
    const companies = await getUserCompanies(user.id);

    return NextResponse.json(companies);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Failed to fetch companies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/companies - Create a new company
export async function POST(req: Request) {
  try {
    const user = await requireUser();
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
    const company = await createCompany(user.id, {
      name,
      industry,
      website: website || undefined,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Failed to create company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
