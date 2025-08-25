'use client';
import Link from 'next/link';
import { PageSection } from '@/components/ui/PageSection';
import { mockSessions } from '@/data/agenda';
import { Calendar, Ticket, BarChart3, Monitor, Cloud, Users, Sparkles, Quote, CreditCard, ClipboardList, TrendingUp, Tv, FileText, UserCheck } from 'lucide-react';
import { LottieRemote } from '@/components/ui/LottieRemote';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Countdown } from '@/components/ui/Countdown';

export default function Home() {
  const features = [
    {
      title: 'Registration & Tickets',
      desc: 'Sell tiered tickets with QR check-in and smooth purchase flow.',
      href: '/tickets',
      Icon: Ticket,
      AnimIcon: CreditCard,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Agenda & Sessions',
      desc: 'Interactive multi-track schedule with filters by day, track, and room.',
      href: '/agenda',
      Icon: Calendar,
      AnimIcon: ClipboardList,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Analytics',
      desc: 'Charts for registrations, popularity, and feedback insights.',
      href: '/analytics',
      Icon: BarChart3,
      AnimIcon: TrendingUp,
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Digital Signage',
      desc: 'Elegant Now/Next screens for venue displays.',
      href: '/signage',
      Icon: Monitor,
      AnimIcon: Tv,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Resources',
      desc: 'Attach slides and materials to sessions for easy access.',
      href: '/resources',
      Icon: Cloud,
      AnimIcon: FileText,
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Community & Team',
      desc: 'Volunteers, speakers, and attendees organized and engaged.',
      href: '/community',
      Icon: Users,
      AnimIcon: UserCheck,
      gradient: 'from-pink-500 to-rose-500'
    },
  ];
  const stats = [
    { label: 'Attendees', value: '1,200+' },
    { label: 'Sessions', value: '60+' },
    { label: 'Tracks', value: '6' },
    { label: 'Speakers', value: '45+' },
  ];
  const schedulePreview = mockSessions.slice(0, 3);
  const testimonials = [
    { quote: 'A beautifully designed platform that made our conference effortless.', author: 'Event Ops Lead' },
    { quote: 'Attendees loved the clear agenda and fast QR check-ins.', author: 'Registration Manager' },
  ];

  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 400], ['blur(0px)', 'blur(6px)']);
  const y = useTransform(scrollY, [0, 400], [0, -40]);

  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10 min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <motion.div
          style={{ filter: blur }}
          className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          style={{ y }}
          className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Cards */}
        <motion.div
          className="absolute top-20 right-20 hidden lg:block"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              1,247+ Attendees
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-16 hidden lg:block"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-indigo-500" />
              60+ Sessions
            </div>
          </div>
        </motion.div>

        {/* Two-column layout container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">

            {/* Left Column - Content */}
            <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto lg:mx-0"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 px-4 py-2 text-sm backdrop-blur-md shadow-lg">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                  </motion.div>
                  <span className="font-medium bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Futuristic Event Experience
                  </span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600">
                    WECON
                  </span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-indigo-600 mt-2">
                    Masawat
                  </span>
                </h1>
              </motion.div>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Countdown target={new Date(Date.now() + 1000*60*60*24*10).toISOString()} />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-2xl mx-auto lg:mx-0"
              >
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  A modern, elegant, and responsive platform for conferences: tickets, agenda, analytics, signage, and more—
                  <span className="font-semibold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                    crafted for seamless attendee journeys
                  </span>
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/tickets"
                    className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-8 py-4 text-white font-semibold shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
                  >
                    <span className="relative z-10">Get Tickets</span>
                    <motion.div
                      className="relative z-10"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Ticket className="h-5 w-5" />
                    </motion.div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-700 to-fuchsia-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/agenda"
                    className="group inline-flex items-center gap-2 rounded-2xl border-2 border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-8 py-4 font-semibold backdrop-blur-md hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300"
                  >
                    <span>View Agenda</span>
                    <Calendar className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Animation */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="w-full max-w-lg lg:max-w-none"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LottieRemote
                    url="https://assets1.lottiefiles.com/packages/lf20_puciaact.json"
                    className="w-full h-auto max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] mx-auto"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <motion.div key={s.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold">{s.value}</div>
                <div className="text-xs sm:text-sm opacity-70 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need for a world-class event</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">From ticket sales to real-time signage—unified in a sleek interface.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ title, desc, href, Icon, AnimIcon, gradient }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={href} className="group block rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="grid grid-cols-[96px_1fr] gap-6 items-center">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className={`rounded-xl bg-gradient-to-br ${gradient}/20 p-3 relative overflow-hidden`}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 rounded-xl`}
                      />
                      <motion.div
                        animate={{
                          y: [0, -2, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                        className="relative z-10"
                      >
                        <AnimIcon className={`w-20 h-20 text-gray-700 dark:text-gray-300`} />
                      </motion.div>
                    </motion.div>
                    <div>
                      <div className="inline-flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 opacity-60" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                      </div>
                      <p className="opacity-70 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Preview Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Schedule Preview</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">A glimpse of what's coming up.</p>
            </div>
            <Link href="/agenda" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
              See full agenda
              <Calendar className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6">
            {schedulePreview.map((s, index) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">{s.day}</div>
                    <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {`${new Date(s.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${s.track ? ` · ${s.track}` : ''}${s.room ? ` · ${s.room}` : ''}`}
                    </p>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">{s.speakers.map((p) => p.name).join(', ')}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by organizers and attendees</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Feedback that keeps us motivated.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 hover:shadow-lg transition-all"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20">
                  <Quote className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-lg leading-relaxed mb-4">{t.quote}</p>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to experience WECON Masawat?</h2>
              <p className="text-xl opacity-90">Get your pass and join us—seats are limited.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/tickets" className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-600 px-8 py-4 font-semibold hover:bg-gray-100 transition-colors">
                Get Tickets
                <Ticket className="h-5 w-5" />
              </Link>
              <Link href="/agenda" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-4 font-semibold hover:bg-white/10 transition-colors">
                Explore Agenda
                <Calendar className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
