import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Summit 2025 - The Future of Artificial Intelligence',
  description: 'Join the world\'s leading AI researchers, engineers, and visionaries at AI Summit 2025. Experience groundbreaking presentations, hands-on workshops, and networking opportunities.',
  keywords: 'AI Summit, Artificial Intelligence, Machine Learning, Technology Conference, AI Research, Innovation',
  authors: [{ name: 'AI Summit Team' }],
  creator: 'AI Summit',
  publisher: 'AI Summit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aisummit2025.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Summit 2025 - The Future of Artificial Intelligence',
    description: 'Join the world\'s leading AI researchers, engineers, and visionaries at AI Summit 2025.',
    url: 'https://aisummit2025.com',
    siteName: 'AI Summit 2025',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Summit 2025',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Summit 2025 - The Future of Artificial Intelligence',
    description: 'Join the world\'s leading AI researchers, engineers, and visionaries at AI Summit 2025.',
    images: ['/assets/images/twitter-image.jpg'],
    creator: '@aisummit2025',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased bg-slate-950 text-white overflow-x-hidden`}>
        <div className="relative min-h-screen">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-50" />
          
          {/* Floating orbs */}
          <div className="fixed inset-0 -z-40 overflow-hidden">
            <div className="floating-orb-1" />
            <div className="floating-orb-2" />
            <div className="floating-orb-3" />
          </div>
          
          {children}
        </div>
      </body>
    </html>
  )
}
