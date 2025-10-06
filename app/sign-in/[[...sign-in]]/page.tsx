import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-persimmon-brown via-black to-persimmon-burgundy">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="relative z-10">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-gradient-to-r from-persimmon-orange via-persimmon-coral to-persimmon-red hover:opacity-90 transition-opacity',
              card: 'glass shadow-2xl',
              headerTitle: 'text-2xl font-display font-bold',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton:
                'border-white/10 hover:border-persimmon-coral/50 transition-colors',
              formFieldInput:
                'bg-white/5 border-white/10 focus:border-persimmon-coral text-white placeholder:text-gray-500',
              footerActionLink: 'text-persimmon-coral hover:text-persimmon-peach',
            },
          }}
        />
      </div>
    </div>
  );
}
