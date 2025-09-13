import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'AIvent - AI Event, Conference and Meetup Website Template',
  description: 'Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.',
  keywords: 'AI, artificial intelligence, conference, summit, technology, machine learning, innovation',
  authors: [{ name: 'AIvent Team' }],
  creator: 'AIvent',
  publisher: 'AIvent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aivent-summit.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AIvent - AI Summit 2025',
    description: 'The premier artificial intelligence summit bringing together the brightest minds to shape the future of technology and innovation.',
    url: 'https://aivent-summit.com',
    siteName: 'AIvent',
    images: [
      {
        url: '/assets/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'AIvent - AI Summit 2025',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIvent - AI Summit 2025',
    description: 'The premier artificial intelligence summit bringing together the brightest minds to shape the future of technology and innovation.',
    images: ['/assets/images/og-image.webp'],
    creator: '@aivent_summit',
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
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
  classification: 'Conference',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/assets/images/logo/logo.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/assets/images/logo/logo.webp', sizes: '16x16', type: 'image/webp' },
    ],
    apple: [
      { url: '/assets/images/logo/logo.webp', sizes: '180x180', type: 'image/webp' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/assets/images/logo/logo.webp',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/assets/videos/hero-background.mp4"
          as="video"
          type="video/mp4"
        />
        <link
          rel="preload"
          href="/assets/images/logo/logo.webp"
          as="image"
          type="image/webp"
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AIvent" />
        <meta name="application-name" content="AIvent" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "AI Summit 2025",
              "description": "The premier artificial intelligence summit bringing together the brightest minds to shape the future of technology and innovation.",
              "startDate": "2025-10-01T09:00:00-07:00",
              "endDate": "2025-10-05T18:00:00-07:00",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": "Moscone Center",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "747 Howard St",
                  "addressLocality": "San Francisco",
                  "addressRegion": "CA",
                  "postalCode": "94103",
                  "addressCountry": "US"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": "AIvent",
                "url": "https://aivent-summit.com"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://aivent-summit.com#tickets",
                "price": "299",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "validFrom": "2024-09-01T00:00:00-07:00"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-aivent-secondary text-aivent-text-primary overflow-x-hidden`}>
        <div className="relative min-h-screen">
          {children}
        </div>
        
        {/* Performance monitoring and analytics scripts would go here */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable right-click context menu in production
              if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                });
              }
              
              // Add loading performance marks
              if (typeof window !== 'undefined' && window.performance) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = window.performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log('Page load time:', loadTime + 'ms');
                  }, 0);
                });
              }
            `
          }}
        />
      </body>
    </html>
  )
}
