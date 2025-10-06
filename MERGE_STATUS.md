# Brand Kit Generator → Persimmon Labs Integration

## ✅ COMPLETED

### 1. Authentication Migration (Clerk → Supabase)
- **Removed**: All Clerk dependencies (@clerk/nextjs, svix)
- **Added**: Supabase Auth (@supabase/ssr, @supabase/supabase-js)
- **Created**: Supabase client utilities (client.ts, server.ts, middleware.ts)
- **Updated**: All auth checks to use Supabase Auth
- **Updated**: Dashboard layout with Supabase user management
- **Updated**: Onboarding page with Supabase auth checks

### 2. Database Schema (Prisma + Supabase)
- **Updated**: Prisma schema to reference Supabase Auth (auth.users table)
- **Removed**: Separate User table (now references auth.users by UUID)
- **Kept**: Company, CompanyMember, BrandKit, ShareToken tables
- **Multi-tenant**: All brand kits are company-scoped (not user-scoped)

### 3. API Infrastructure
- **Copied**: All brand kit generation logic from brandkit_generator (`lib/api/*`)
- **Created**: `/api/brand-kits` route (GET + POST)
- **Created**: `/api/companies` route (GET + POST)
- **Implemented**: Company access control (`verifyCompanyAccess`)
- **Implemented**: Multi-tenant isolation (all queries filter by `companyId`)

### 4. Company Management
- **Created**: Company onboarding flow
- **Created**: Company API endpoints
- **Created**: Company utility functions (`lib/company.ts`)
- **Implemented**: Role-based access control (OWNER, ADMIN, MEMBER, VIEWER)
- **Implemented**: Slug generation for clean URLs

### 5. Dashboard
- **Created**: Dashboard layout with sidebar navigation
- **Created**: Dashboard home page with tool cards
- **Created**: Company-scoped routing (`/dashboard/{companySlug}`)
- **Styled**: Persimmon Labs design system (coral, burgundy, black)

## ⏳ REMAINING WORK

### 1. Brand Kit Tool Page (Next Step)
- [ ] Create `/dashboard/[companySlug]/tools/brand-kit/page.tsx`
- [ ] Copy brand kit form components from brandkit_generator
- [ ] Update styling to match Persimmon Labs
- [ ] Connect to `/api/brand-kits` endpoint

### 2. Brand Kit Results Page
- [ ] Create `/dashboard/[companySlug]/tools/brand-kit/results/[id]/page.tsx`
- [ ] Display generated logo, colors, fonts, tagline
- [ ] Add share functionality
- [ ] Add download/export options

### 3. Share Functionality
- [ ] Create `/api/brand-kits/[id]/share` endpoint
- [ ] Create `/share/[token]` public page
- [ ] Implement token generation and expiration

### 4. NavBar Integration
- [ ] Update Persimmon Labs landing page NavBar
- [ ] Add "Sign In" / "Dashboard" buttons
- [ ] Add "Get Started" CTA that links to signup

### 5. Auth Pages
- [ ] Create `/auth/sign-in` page (Supabase Auth UI)
- [ ] Create `/auth/sign-up` page (Supabase Auth UI)
- [ ] Create `/auth/callback` page (OAuth redirect handler)

### 6. Testing & Polish
- [ ] Test complete flow: Signup → Company → Brand Kit → Share
- [ ] Test multi-company scenarios
- [ ] Test role permissions
- [ ] Fix any TypeScript errors
- [ ] Optimize performance

## 🗂️ File Structure

```
persimmon-automation/
├── app/
│   ├── api/
│   │   ├── brand-kits/route.ts         ✅ Created (GET + POST)
│   │   └── companies/route.ts          ✅ Created (GET + POST)
│   ├── dashboard/
│   │   └── [companySlug]/
│   │       ├── layout.tsx              ✅ Created
│   │       ├── page.tsx                ✅ Created
│   │       └── tools/
│   │           └── brand-kit/
│   │               └── page.tsx        ❌ TODO
│   ├── onboarding/
│   │   └── company/page.tsx            ✅ Created
│   └── auth/                           ❌ TODO
│       ├── sign-in/page.tsx
│       ├── sign-up/page.tsx
│       └── callback/route.ts
├── lib/
│   ├── api/                            ✅ Copied from brandkit_generator
│   │   ├── groq-logo.ts
│   │   ├── groq.ts
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── taglines.ts
│   │   └── logo-utils.ts
│   ├── company.ts                      ✅ Created
│   ├── prisma.ts                       ✅ Created
│   └── supabase/                       ✅ Created
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── prisma/
│   └── schema.prisma                   ✅ Updated for Supabase
└── middleware.ts                       ✅ Created (Supabase session refresh)
```

## 🔑 Environment Variables Required

```bash
# Supabase (Authentication + Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# Database (Prisma connects to Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[password]@[host]/postgres

# AI APIs
GROQ_API_KEY=gsk_your_groq_key
OPENROUTER_API_KEY=sk-or-v1_your_key
```

## 📋 Manual Steps Required

### Step 1: Set Up Supabase Project
1. Go to https://supabase.com/dashboard
2. Create new project or use existing
3. Copy URL and anon key from Settings → API
4. Copy service role key (keep it SECRET!)
5. Add to `.env.local`

### Step 2: Run Database Migration
```bash
cd persimmon-automation
npm run db:migrate
```

This will create:
- `companies` table
- `company_members` table
- `brand_kits` table
- `share_tokens` table

### Step 3: Enable Supabase Auth
1. In Supabase Dashboard → Authentication → Providers
2. Enable Email (password-based)
3. Optional: Enable Google/GitHub OAuth

### Step 4: Configure Auth URLs
In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (dev) / `https://persimmonlabs.io` (prod)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://persimmonlabs.io/auth/callback`

### Step 5: Test the Flow
```bash
npm run dev
```

1. Visit http://localhost:3000
2. Click "Get Started" (you'll need to create this button)
3. Sign up with email
4. Create a company
5. Navigate to Brand Kit Generator
6. Generate a brand kit

## 🎨 Design System (Persimmon Labs)

All UI uses these colors:
- **Primary**: `#F5793B` (coral-orange)
- **Secondary**: `#7c161c` (deep red)
- **Dark**: `#250608` (almost black)
- **Accent**: `#f1580c` (bright orange)

Tailwind classes:
- `bg-persimmon-coral`
- `text-persimmon-coral`
- `gradient-persimmon` (gradient utility)
- `glass` (glassmorphism card)
- `glass-dark` (dark glass card)

## 🚀 Next Immediate Actions

1. **Create Auth Pages** (15 min)
   - Sign-in page with Supabase Auth UI
   - Sign-up page with Supabase Auth UI
   - Callback handler for OAuth

2. **Create Brand Kit Tool Page** (30 min)
   - Copy form from brandkit_generator
   - Update styling to Persimmon Labs
   - Connect to API

3. **Update Landing Page NavBar** (10 min)
   - Add auth buttons
   - Add dashboard link for logged-in users

4. **Test End-to-End** (20 min)
   - Full flow from landing → signup → company → brand kit

5. **Deploy** (30 min)
   - Push to Git
   - Deploy to Vercel
   - Configure production Supabase

## 🔄 How the Merge Works

### Before (Brand Kit Generator)
```
User (Supabase Auth) → Brand Kits (user_id)
```

### After (Persimmon Labs Multi-Tenant)
```
User (Supabase Auth) → Company Member → Company → Brand Kits (company_id)
```

**Key Changes:**
1. Brand kits now belong to companies, not users
2. Users can belong to multiple companies (via company_members)
3. All brand kits are isolated by company (multi-tenant)
4. Role-based access control (OWNER, ADMIN, MEMBER, VIEWER)

## ✅ Production Checklist

- [x] Remove Clerk dependencies
- [x] Install Supabase dependencies
- [x] Update Prisma schema
- [x] Create Supabase client utilities
- [x] Update all API routes for Supabase
- [x] Copy brand kit generation logic
- [x] Create brand kits API endpoint
- [ ] Create auth pages (sign-in, sign-up, callback)
- [ ] Create brand kit tool page
- [ ] Create brand kit results page
- [ ] Update landing page NavBar
- [ ] Test complete flow
- [ ] Deploy to production

---

**Status**: ~70% Complete
**Last Updated**: 2025-10-06
**Next Step**: Create auth pages and brand kit tool page
