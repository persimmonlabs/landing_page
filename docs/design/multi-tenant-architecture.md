# Multi-Tenant SaaS Architecture Design

## Overview
Transform Persimmon Labs into a multi-tenant SaaS platform where clients can:
1. Sign up and create an account
2. Create/join companies (organizations)
3. Access AI tools (Brand Kit Generator, future tools)
4. Collaborate with team members

## Database Schema Design

### Entity Relationship

```
User (1) ←→ (M) CompanyMember (M) ←→ (1) Company
                                              ↓
                                         BrandKit (M)
                                              ↓
                                        ShareToken (M)
```

### Tables

#### 1. User
- Managed by Clerk authentication
- `id`: String (Clerk user ID)
- `email`: String (unique)
- `firstName`: String?
- `lastName`: String?
- `imageUrl`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### 2. Company
Multi-tenant organization entity. Each company has its own isolated workspace.

- `id`: UUID
- `name`: String (company name)
- `slug`: String (unique URL slug, e.g., "acme-corp")
- `industry`: String?
- `website`: String?
- `logoUrl`: String?
- `settings`: JSON (company-specific settings)
- `plan`: Enum (FREE, STARTER, GROWTH, ENTERPRISE)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### 3. CompanyMember
Junction table for user-company relationship with roles.

- `id`: UUID
- `userId`: String (FK → User.id)
- `companyId`: UUID (FK → Company.id)
- `role`: Enum (OWNER, ADMIN, MEMBER, VIEWER)
- `invitedBy`: String? (FK → User.id)
- `joinedAt`: DateTime
- `createdAt`: DateTime

Unique constraint: (userId, companyId)

#### 4. BrandKit
Migrated from Brand Kit Generator, now tied to Company instead of User.

- `id`: UUID
- `companyId`: UUID (FK → Company.id) ⚠️ Changed from user_id
- `createdBy`: String (FK → User.id) - who created it
- `businessName`: String
- `businessDescription`: String?
- `industry`: String?
- `logoUrl`: String (not null)
- `logoSvg`: String?
- `colors`: JSON (array of color objects)
- `fonts`: JSON (primary, secondary fonts)
- `tagline`: String?
- `isFavorite`: Boolean
- `viewCount`: Int
- `lastViewedAt`: DateTime?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### 5. ShareToken
Public sharing for brand kits (unchanged structure).

- `id`: UUID
- `brandKitId`: UUID (FK → BrandKit.id)
- `token`: String (unique, 64 chars)
- `expiresAt`: DateTime?
- `viewCount`: Int
- `createdAt`: DateTime

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **OWNER** | Full control: manage company, members, billing, delete company |
| **ADMIN** | Manage tools, create/edit brand kits, invite members |
| **MEMBER** | Create/edit brand kits, use tools |
| **VIEWER** | View-only access to brand kits |

### Data Isolation Strategy

**Row-Level Security Pattern:**
- All queries MUST filter by `companyId`
- Users can only access data from companies they belong to
- Enforced at service layer (not database RLS, since we're using Prisma)

**Service Layer Pattern:**
```typescript
// ✅ CORRECT
async getBrandKits(userId: string, companyId: string) {
  // 1. Verify user is member of company
  await verifyCompanyMembership(userId, companyId);

  // 2. Return only company's data
  return prisma.brandKit.findMany({
    where: { companyId }
  });
}

// ❌ WRONG - No company isolation
async getBrandKits(userId: string) {
  return prisma.brandKit.findMany(); // Exposes all companies!
}
```

## User Flows

### 1. New User Signup Flow
```
1. User signs up via Clerk
   ↓
2. Redirect to /onboarding/company
   ↓
3. User creates first company
   ↓
4. CompanyMember record created (role: OWNER)
   ↓
5. Redirect to /dashboard/{companySlug}
```

### 2. Existing User Flow
```
1. User logs in via Clerk
   ↓
2. Check if user has companies
   ↓
3a. Has companies → Redirect to /dashboard/{lastCompanySlug}
3b. No companies → Redirect to /onboarding/company
```

### 3. Brand Kit Generation Flow
```
1. User in /dashboard/{companySlug}/tools/brand-kit
   ↓
2. Fill out form (business name, industry, etc.)
   ↓
3. Submit → API validates user is member of company
   ↓
4. Generate brand kit (logo, colors, fonts, tagline)
   ↓
5. Save to database with companyId + createdBy
   ↓
6. Display results
   ↓
7. User can share (create ShareToken)
```

### 4. Company Switching Flow
```
User in /dashboard/company-a
   ↓
Click company switcher
   ↓
Select company-b
   ↓
Redirect to /dashboard/company-b
   ↓
All data now filtered by company-b's companyId
```

## URL Structure

```
/ - Public landing page
/sign-in - Clerk sign in
/sign-up - Clerk sign up
/onboarding/company - Create first company
/dashboard/{companySlug} - Company dashboard
/dashboard/{companySlug}/tools - Tools overview
/dashboard/{companySlug}/tools/brand-kit - Brand Kit Generator
/dashboard/{companySlug}/tools/brand-kit/results/{id} - View result
/dashboard/{companySlug}/settings - Company settings
/dashboard/{companySlug}/team - Team management
/share/{token} - Public brand kit view (no auth required)
```

## API Routes

```
POST   /api/companies                      - Create company
GET    /api/companies                      - List user's companies
GET    /api/companies/{id}                 - Get company details
PATCH  /api/companies/{id}                 - Update company
DELETE /api/companies/{id}                 - Delete company (owner only)

POST   /api/companies/{id}/members         - Invite member
GET    /api/companies/{id}/members         - List members
PATCH  /api/companies/{id}/members/{userId} - Update member role
DELETE /api/companies/{id}/members/{userId} - Remove member

POST   /api/brand-kits                     - Create brand kit (requires companyId)
GET    /api/brand-kits                     - List company's brand kits (filtered by companyId)
GET    /api/brand-kits/{id}                - Get brand kit (verify company access)
DELETE /api/brand-kits/{id}                - Delete brand kit

POST   /api/brand-kits/{id}/share          - Create share token
GET    /api/share/{token}                  - Get shared brand kit (public)
```

## Migration Strategy

### Phase 1: Database Schema
1. ✅ Add User, Company, CompanyMember tables to Prisma schema
2. ✅ Add BrandKit, ShareToken tables (migrated from Supabase)
3. ✅ Run Prisma migration

### Phase 2: Authentication
1. ✅ Install and configure Clerk
2. ✅ Add Clerk middleware to protect routes
3. ✅ Create sign-in/sign-up pages

### Phase 3: Onboarding
1. ✅ Create company creation form
2. ✅ Handle first-time user flow
3. ✅ Create company switcher component

### Phase 4: Dashboard
1. ✅ Create dashboard layout (sidebar, header)
2. ✅ Add tools navigation
3. ✅ Integrate Brand Kit Generator

### Phase 5: Brand Kit Integration
1. ✅ Copy brand kit components from brandkit_generator
2. ✅ Update to use companyId instead of userId
3. ✅ Update API routes to enforce company isolation
4. ✅ Update UI to match Persimmon Labs design system

### Phase 6: Testing & Deployment
1. ✅ Test complete user flow
2. ✅ Test multi-company scenarios
3. ✅ Test team member permissions
4. ✅ Deploy to production

## Security Considerations

### Authentication
- ✅ Use Clerk for user authentication
- ✅ Protect all dashboard routes with middleware
- ✅ Verify user session on every API call

### Authorization
- ✅ Verify company membership on every request
- ✅ Check role permissions for sensitive operations
- ✅ Never trust client-provided companyId - always verify from user's memberships

### Data Isolation
- ✅ All queries must filter by companyId
- ✅ No direct user_id queries (users can belong to multiple companies)
- ✅ Share tokens are public but read-only

### API Security
- ✅ Rate limiting on all endpoints
- ✅ Input validation with Zod
- ✅ Sanitize user inputs
- ✅ CORS configuration

## Design System Integration

### Colors
Use Persimmon Labs brand colors:
- Primary: #F5793B (coral-orange)
- Secondary: #7c161c (deep red)
- Dark: #250608 (almost black)
- Backgrounds: Black with gradient overlays

### Components
Reuse existing Persimmon Labs components:
- Button (primary, secondary, ghost variants)
- Card (with hover effects)
- NavBar (with company switcher)
- SectionContainer

### Animations
- Glass morphism effects
- Gradient animations
- Hover lift/glow effects
- Framer Motion for page transitions

## Success Metrics

### Onboarding
- Time to first company creation: <2 minutes
- Time to first brand kit generation: <5 minutes

### Performance
- Dashboard load time: <1 second
- Brand kit generation: <30 seconds
- Page transitions: <300ms

### Quality
- Type safety: 100% TypeScript coverage
- Test coverage: ≥80%
- Accessibility: WCAG AA compliance
- Lighthouse score: ≥90

## Next Steps

1. ✅ Create Prisma schema
2. ✅ Run database migration
3. ✅ Set up Clerk authentication
4. ✅ Build onboarding flow
5. ✅ Build dashboard layout
6. ✅ Integrate Brand Kit Generator
7. ✅ Test end-to-end flow
8. ✅ Deploy to production

---

**Remember: Production-level means real users can use it without shame. Every aspect must be polished, secure, and performant.**
