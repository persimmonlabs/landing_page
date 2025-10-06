'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function CompanyOnboarding() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create company');
      }

      const company = await response.json();

      // Redirect to dashboard
      router.push(`/dashboard/${company.slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-persimmon-brown via-black to-persimmon-burgundy flex items-center justify-center p-4">
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Welcome to Persimmon Labs
            </h1>
            <p className="text-gray-400">
              {user?.firstName ? `Hi ${user.firstName}! ` : ''}
              Let's set up your company
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-persimmon-coral focus:border-transparent transition-all"
                placeholder="Acme Inc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                Industry
              </label>
              <select
                id="industry"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-persimmon-coral focus:border-transparent transition-all"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="">Select an industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-persimmon-coral focus:border-transparent transition-all"
                placeholder="https://acme.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-persimmon-orange via-persimmon-coral to-persimmon-red text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Company'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            You'll be able to invite team members later
          </p>
        </div>
      </div>
    </div>
  );
}
