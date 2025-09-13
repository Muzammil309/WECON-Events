import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AIvent - AI Event, Conference and Meetup Website Template',
  description: 'Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.',
  keywords: [
    'AI',
    'artificial intelligence',
    'conference',
    'event',
    'meetup',
    'technology',
    'innovation',
    'machine learning',
    'deep learning',
    'neural networks',
    'data science',
    'tech conference',
    'AI summit',
    'future technology'
  ],
  authors: [{ name: 'AIvent Team' }],
  creator: 'AIvent',
  publisher: 'AIvent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aivent-official.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aivent-official.vercel.app',
    title: 'AIvent - AI Event, Conference and Meetup Website Template',
    description: 'Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.',
    siteName: 'AIvent',
    images: [
      {
        url: '/assets/images/misc/sd1.webp',
        width: 1200,
        height: 630,
        alt: 'AIvent - AI Conference',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIvent - AI Event, Conference and Meetup Website Template',
    description: 'Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.',
    images: ['/assets/images/misc/sd1.webp'],
    creator: '@aivent',
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
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/assets/images/icon.webp" type="image/webp" sizes="16x16" />
        <link rel="apple-touch-icon" href="/assets/images/icon.webp" />
        <meta name="theme-color" content="#764DF0" />
        <meta name="msapplication-TileColor" content="#764DF0" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className={`${manrope.variable} font-sans dark-scheme antialiased`}>
        <div id="wrapper">
          {children}
        </div>
      </body>
    </html>
  )
}
