import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Persimmon Labs | AI Content Automation - Running 24/7 While You Sleep',
  description: 'Done-for-you n8n automation that handles your entire content workflow. Upload once, publish everywhere. Save 20+ hours/week. Setup in 5 days. From $497/month.',
  keywords: 'content automation, n8n workflows, AI content generation, social media automation, marketing automation, automated posting, content management system, Instagram automation, LinkedIn automation, Facebook automation, Twitter automation',
  authors: [{ name: 'Persimmon Labs' }],
  creator: 'Persimmon Labs',
  publisher: 'Persimmon Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://persimmonlabs.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Persimmon Labs - Your AI Content Team Running 24/7',
    description: 'Stop spending 20+ hours/week on content. Our custom n8n automations handle everything. Upload once, publish everywhere, forever.',
    url: 'https://persimmonlabs.io',
    siteName: 'Persimmon Labs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Persimmon Labs - AI Content Automation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Persimmon Labs - AI Content Automation',
    description: 'Done-for-you automation that runs 24/7. Save 20+ hours/week on content.',
    images: ['/twitter-image.png'],
    creator: '@persimmonlabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
        <head>
          {/* Google Analytics 4 */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `}
          </Script>

          {/* Facebook Pixel */}
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `}
          </Script>

          {/* Schema Markup for Local Business */}
          <Script
            id="schema-markup"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Persimmon Labs',
                description: 'AI-powered content automation agency specializing in n8n workflows',
                url: 'https://persimmonlabs.io',
                logo: 'https://persimmonlabs.io/logo.png',
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+1-234-567-890',
                  contactType: 'sales',
                  email: 'hello@persimmonlabs.io',
                  areaServed: 'Worldwide',
                  availableLanguage: ['English'],
                },
                sameAs: [
                  'https://www.linkedin.com/company/persimmon-labs',
                  'https://twitter.com/persimmonlabs',
                  'https://www.facebook.com/persimmonlabs',
                ],
                offers: {
                  '@type': 'Offer',
                  description: 'Content automation services',
                  priceCurrency: 'USD',
                  price: '497.00',
                  priceValidUntil: '2025-12-31',
                  availability: 'https://schema.org/InStock',
                },
              }),
            }}
          />
        </head>
        <body className="font-sans antialiased bg-white text-gray-900">
          {children}
        </body>
      </html>
  )
}