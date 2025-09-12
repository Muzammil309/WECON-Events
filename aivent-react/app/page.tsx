'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Marquee from '@/components/Marquee'
import WhyAttend from '@/components/WhyAttend'
import Quote from '@/components/Quote'
import Speakers from '@/components/Speakers'
import Schedule from '@/components/Schedule'
import Tickets from '@/components/Tickets'
import Venue from '@/components/Venue'
import FAQ from '@/components/FAQ'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <Hero />
      <About />
      <Marquee />
      <WhyAttend />
      <Quote />
      <Speakers />
      <Schedule />
      <Tickets />
      <Venue />
      <FAQ />
      <Newsletter />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
