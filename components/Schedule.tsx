'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Clock, Calendar } from 'lucide-react'

// Official AIvent Demo 1 schedule data
const scheduleData = [
  {
    day: 1,
    date: "Oct 1, 2025",
    sessions: [
      {
        time: "08:00 – 10:00 AM",
        speaker: {
          name: "Joshua Henry",
          title: "AI Research Lead, DeepTech Labs",
          image: "/aivent-original/images/team/1.webp"
        },
        session: "Opening Keynote – The State of AI 2025",
        description: "Kick off the event with an insightful overview of where artificial intelligence is headed. Ava will explore breakthroughs, global shifts, and what's next in deep learning, generative models, and AI ethics."
      },
      {
        time: "12:00 – 14:00 PM",
        speaker: {
          name: "Leila Zhang",
          title: "VP of Machine Learning, Google",
          image: "/aivent-original/images/team/2.webp"
        },
        session: "Building Human-Centered AI Products",
        description: "This session covers how to design AI solutions that prioritize usability, fairness, and real-world impact. Bring your laptop—hands-on UX exercises included."
      },
      {
        time: "16:00 – 18:00 PM",
        speaker: {
          name: "Carlos Rivera",
          title: "Founder & CEO, NeuralCore",
          image: "/aivent-original/images/team/3.webp"
        },
        session: "AI Policy & Regulation – A Global Overview",
        description: "Learn how nations and organizations are approaching AI governance, including frameworks for data privacy, bias mitigation, and accountability in model deployment."
      },
      {
        time: "20:00 – 22:00 PM",
        speaker: {
          name: "Maria Gonzalez",
          title: "Founder & CEO, SynthCore AI",
          image: "/aivent-original/images/team/4.webp"
        },
        session: "Building a Startup with AI at the Core",
        description: "Marco shares his journey launching an AI-first startup. Discover tips on tech stacks, team-building, funding, and scaling responsibly."
      }
    ]
  },
  {
    day: 2,
    date: "Oct 2, 2025",
    sessions: [
      {
        time: "09:00 – 10:30 AM",
        speaker: {
          name: "Leila Zhang",
          title: "Head of AI Strategy, VisionFlow",
          image: "/aivent-original/images/team/5.webp"
        },
        session: "Ethical AI — From Theory to Practice",
        description: "Explore how leading companies are implementing fairness, accountability, and transparency in real-world AI systems across healthcare and finance."
      },
      {
        time: "11:00 – 12:30 PM",
        speaker: {
          name: "Lisa Zhang",
          title: "AI Ethics Researcher, FairAI Group",
          image: "/aivent-original/images/team/6.webp"
        },
        session: "Bias in Data — Hidden Dangers in AI Pipelines",
        description: "Lisa dives deep into the causes of bias in training data and showcases methods to detect and mitigate harm before deployment."
      },
      {
        time: "14:00 – 15:30 PM",
        speaker: {
          name: "Markus Blom",
          title: "CTO, SynthMind AI",
          image: "/aivent-original/images/team/7.webp"
        },
        session: "Generative Models Beyond Text",
        description: "A practical tour of the next generation of multimodal models generating images, video, and even 3D environments with AI."
      },
      {
        time: "16:00 – 17:30 PM",
        speaker: {
          name: "Priya Natarajan",
          title: "Senior AI Researcher, Meta",
          image: "/aivent-original/images/team/8.webp"
        },
        session: "The Future of AI in Social Media",
        description: "Discover how AI is transforming social platforms and what's next for content creation, moderation, and user experience."
      }
    ]
  }
]

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(1)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const currentDayData = scheduleData.find(day => day.day === activeDay)

  return (
    <section id="section-schedule" className="section-padding text-white" style={{ backgroundColor: '#101435' }}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full max-w-none px-4 md:px-8"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="subtitle mb-4">
            Event Schedule
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            5 Days of <span className="aivent-text-gradient">Innovation</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Comprehensive agenda featuring keynotes, workshops, panels, and networking sessions.
          </motion.p>
        </div>

        {/* Day Tabs */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {scheduleData.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`px-6 py-4 rounded-lg transition-all duration-300 ${
                  activeDay === day.day
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-dark-2 text-gray-400 hover:bg-dark-3 hover:text-white'
                }`}
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold">Day {day.day}</h3>
                  <p className="text-sm opacity-80">{day.date}</p>
                </div>
              </button>
            ))}
            {/* Additional days placeholder */}
            {[3, 4, 5].map((day) => (
              <button
                key={day}
                className="px-6 py-4 rounded-lg bg-dark-2 text-gray-500 cursor-not-allowed"
                disabled
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold">Day {day}</h3>
                  <p className="text-sm opacity-60">Oct {day + 2}, 2025</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Schedule Content */}
        {currentDayData && (
          <motion.div variants={itemVariants} className="space-y-6">
            {currentDayData.sessions.map((session, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card-aivent p-8 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  {/* Time */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{session.time}</span>
                    </div>
                  </div>

                  {/* Speaker */}
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={session.speaker.image}
                          alt={session.speaker.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-white mb-1">{session.speaker.name}</h5>
                        <p className="text-sm text-gray-400">{session.speaker.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="md:col-span-6">
                    <h3 className="text-xl font-bold text-white mb-3">{session.session}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{session.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
