'use client';

import { use } from 'react';
import Link from 'next/link';
import { Palette, ArrowRight } from 'lucide-react';

export default function DashboardHome({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = use(params);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your Persimmon Labs workspace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Brand Kit Generator Tool Card */}
        <Link
          href={`/dashboard/${companySlug}/tools/brand-kit`}
          className="group glass-dark rounded-xl p-6 hover:bg-white/10 transition-all hover-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-persimmon-orange to-persimmon-coral flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-persimmon-coral group-hover:translate-x-1 transition-all" />
          </div>

          <h3 className="text-xl font-display font-bold text-white mb-2">
            Brand Kit Generator
          </h3>
          <p className="text-gray-400 text-sm">
            Generate professional brand kits with AI - logos, colors, fonts, and taglines in
            seconds
          </p>

          <div className="mt-4 inline-flex items-center text-sm text-persimmon-coral group-hover:text-persimmon-peach transition-colors">
            Get started
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Placeholder for future tools */}
        <div className="glass-dark rounded-xl p-6 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-600 rounded" />
            </div>
          </div>

          <h3 className="text-xl font-display font-bold text-white mb-2">More Tools Coming</h3>
          <p className="text-gray-400 text-sm">We're building more AI-powered tools for you</p>

          <div className="mt-4 inline-flex items-center text-sm text-gray-500">
            Coming soon
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-dark rounded-xl p-6">
          <div className="text-3xl font-bold text-white mb-1">0</div>
          <div className="text-gray-400 text-sm">Brand Kits Created</div>
        </div>

        <div className="glass-dark rounded-xl p-6">
          <div className="text-3xl font-bold text-white mb-1">FREE</div>
          <div className="text-gray-400 text-sm">Current Plan</div>
        </div>

        <div className="glass-dark rounded-xl p-6">
          <div className="text-3xl font-bold text-white mb-1">1</div>
          <div className="text-gray-400 text-sm">Team Members</div>
        </div>
      </div>
    </div>
  );
}
