'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

// Official AIvent Demo 1 sponsor logos
const sponsors = [
  { id: 1, name: "Sponsor 1", logo: "/aivent-original/images/logo-light/1.webp" },
  { id: 2, name: "Sponsor 2", logo: "/aivent-original/images/logo-light/2.webp" },
  { id: 3, name: "Sponsor 3", logo: "/aivent-original/images/logo-light/3.webp" },
  { id: 4, name: "Sponsor 4", logo: "/aivent-original/images/logo-light/4.webp" },
  { id: 5, name: "Sponsor 5", logo: "/aivent-original/images/logo-light/5.webp" },
  { id: 6, name: "Sponsor 6", logo: "/aivent-original/images/logo-light/6.webp" },
  { id: 7, name: "Sponsor 7", logo: "/aivent-original/images/logo-light/7.webp" },
  { id: 8, name: "Sponsor 8", logo: "/aivent-original/images/logo-light/8.webp" },
  { id: 9, name: "Sponsor 9", logo: "/aivent-original/images/logo-light/9.webp" },
  { id: 10, name: "Sponsor 10", logo: "/aivent-original/images/logo-light/10.webp" }
]

export default function Sponsors() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="section-padding bg-dark text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/aivent-original/images/background/1.webp"
          alt="Background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark" />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="container-custom relative z-10"
      >
        {/* Sponsors Marquee */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative overflow-hidden"
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-dark to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-dark to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="flex animate-marquee">
            {/* First Set */}
            {sponsors.map((sponsor) => (
              <div
                key={`first-${sponsor.id}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={150}
                  height={80}
                  className="h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert"
                  sizes="150px"
                />
              </div>
            ))}

            {/* Duplicate Set for Seamless Loop */}
            {sponsors.map((sponsor) => (
              <div
                key={`second-${sponsor.id}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={150}
                  height={80}
                  className="h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert"
                  sizes="150px"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
