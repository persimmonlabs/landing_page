import { prisma } from './prisma';
import { CompanyMemberRole } from '@prisma/client';

/**
 * Get all companies a user is a member of
 */
export async function getUserCompanies(userId: string) {
  const memberships = await prisma.companyMember.findMany({
    where: { userId },
    include: {
      company: true,
    },
    orderBy: {
      joinedAt: 'desc',
    },
  });

  return memberships.map((m) => ({
    ...m.company,
    role: m.role,
    joinedAt: m.joinedAt,
  }));
}

/**
 * Check if user is a member of a company
 */
export async function isCompanyMember(userId: string, companyId: string): Promise<boolean> {
  const membership = await prisma.companyMember.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  return !!membership;
}

/**
 * Get user's role in a company
 */
export async function getUserRole(
  userId: string,
  companyId: string
): Promise<CompanyMemberRole | null> {
  const membership = await prisma.companyMember.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  return membership?.role || null;
}

/**
 * Check if user has required role
 */
export async function hasRole(
  userId: string,
  companyId: string,
  requiredRole: CompanyMemberRole
): Promise<boolean> {
  const role = await getUserRole(userId, companyId);
  if (!role) return false;

  const roleHierarchy = {
    VIEWER: 1,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  return roleHierarchy[role] >= roleHierarchy[requiredRole];
}

/**
 * Create a company and add user as owner
 */
export async function createCompany(
  userId: string,
  data: {
    name: string;
    industry?: string;
    website?: string;
  }
) {
  // Generate slug from company name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50);

  // Check if slug is taken
  let finalSlug = slug;
  let counter = 1;
  while (await prisma.company.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  // Create company and membership in a transaction
  const company = await prisma.$transaction(async (tx) => {
    const newCompany = await tx.company.create({
      data: {
        name: data.name,
        slug: finalSlug,
        industry: data.industry,
        website: data.website,
      },
    });

    await tx.companyMember.create({
      data: {
        userId,
        companyId: newCompany.id,
        role: CompanyMemberRole.OWNER,
      },
    });

    return newCompany;
  });

  return company;
}

/**
 * Get company by slug
 */
export async function getCompanyBySlug(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

/**
 * Verify user has access to company
 * Throws error if no access
 */
export async function verifyCompanyAccess(userId: string, companyId: string) {
  const isMember = await isCompanyMember(userId, companyId);

  if (!isMember) {
    throw new Error('Unauthorized: You do not have access to this company');
  }

  return true;
}
