'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Sparkles, Palette, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [company, setCompany] = useState<{ name: string; slug: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompany() {
      if (!isLoaded) return;

      try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error('Failed to fetch companies');

        const companies = await response.json();
        const current = companies.find((c: { slug: string }) => c.slug === companySlug);

        if (!current) {
          // Company not found or user not a member
          router.push('/onboarding/company');
          return;
        }

        setCompany(current);
      } catch (error) {
        console.error('Error loading company:', error);
        router.push('/onboarding/company');
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [isLoaded, companySlug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-persimmon-coral text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <nav className="glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-persimmon-coral" />
                <span className="font-display font-bold text-xl gradient-text">
                  Persimmon Labs
                </span>
              </Link>

              {company && (
                <div className="text-gray-400">
                  <span className="text-gray-500">/</span>
                  <span className="ml-2 text-white font-medium">{company.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 glass-dark border-r border-white/5 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            <Link
              href={`/dashboard/${companySlug}`}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tools
              </p>
            </div>

            <Link
              href={`/dashboard/${companySlug}/tools/brand-kit`}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Palette className="w-5 h-5" />
              <span>Brand Kit Generator</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
