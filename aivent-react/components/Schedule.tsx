'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const Schedule = () => {
  const [activeDay, setActiveDay] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const days = [
    { day: 'Day 1', date: 'Oct 1, 2025' },
    { day: 'Day 2', date: 'Oct 2, 2025' },
    { day: 'Day 3', date: 'Oct 3, 2025' },
    { day: 'Day 4', date: 'Oct 4, 2025' },
    { day: 'Day 5', date: 'Oct 5, 2025' },
  ]

  const scheduleData = [
    [
      // Day 1
      {
        time: '08:00 – 10:00 AM',
        speaker: {
          name: 'Joshua Henry',
          title: 'AI Research Lead, DeepTech Labs',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Opening Keynote – The State of AI 2025',
        description: 'Kick off the event with an insightful overview of where artificial intelligence is headed. Ava will explore breakthroughs, global shifts, and what\'s next in deep learning, generative models, and AI ethics.'
      },
      {
        time: '12:00 – 14:00 PM',
        speaker: {
          name: 'Leila Zhang',
          title: 'VP of Machine Learning, Google',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Building Human-Centered AI Products',
        description: 'This session covers how to design AI solutions that prioritize usability, fairness, and real-world impact. Bring your laptop—hands-on UX exercises included.'
      },
      {
        time: '16:00 – 18:00 PM',
        speaker: {
          name: 'Carlos Rivera',
          title: 'Founder & CEO, NeuralCore',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        session: 'AI Policy & Regulation – A Global Overview',
        description: 'Learn how nations and organizations are approaching AI governance, including frameworks for data privacy, bias mitigation, and accountability in model deployment.'
      },
      {
        time: '20:00 – 22:00 PM',
        speaker: {
          name: 'Maria Gonzalez',
          title: 'Founder & CEO, SynthCore AI',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Building a Startup with AI at the Core',
        description: 'Marco shares his journey launching an AI-first startup. Discover tips on tech stacks, team-building, funding, and scaling responsibly.'
      }
    ],
    [
      // Day 2
      {
        time: '09:00 – 10:30 AM',
        speaker: {
          name: 'Leila Zhang',
          title: 'Head of AI Strategy, VisionFlow',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Ethical AI — From Theory to Practice',
        description: 'Explore how leading companies are implementing fairness, accountability, and transparency in real-world AI systems across healthcare and finance.'
      },
      {
        time: '11:00 – 12:30 PM',
        speaker: {
          name: 'Lisa Zhang',
          title: 'AI Ethics Researcher, FairAI Group',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Bias in Data — Hidden Dangers in AI Pipelines',
        description: 'Lisa dives deep into the causes of bias in training data and showcases methods to detect and mitigate harm before deployment.'
      }
    ],
    [
      // Day 3
      {
        time: '09:00 – 10:30 AM',
        speaker: {
          name: 'Sofia Romero',
          title: 'ML Engineer, NeuronEdge',
          image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Transformers in 2025 — What\'s Next?',
        description: 'A technical session diving into the future of transformer architectures, memory optimization, and scaling challenges.'
      }
    ],
    [
      // Day 4
      {
        time: '09:00 – 10:30 AM',
        speaker: {
          name: 'Nina Köhler',
          title: 'Chief Product Officer, SynthOS',
          image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face'
        },
        session: 'AI in Product Design — From Concept to Launch',
        description: 'Nina shares how AI is revolutionizing product development, from ideation to real-time user feedback integration.'
      }
    ],
    [
      // Day 5
      {
        time: '09:00 – 10:30 AM',
        speaker: {
          name: 'Elena Greco',
          title: 'Ethics Advisor, Global AI Forum',
          image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Ethical Design in AI — A Human-Centered Approach',
        description: 'A deep dive into responsible AI, highlighting bias mitigation, fairness, transparency, and global implications of autonomous systems.'
      },
      {
        time: '16:00 – 17:30 PM',
        speaker: {
          name: 'Dr. Hassan Al-Mansour',
          title: 'Lead Data Scientist, FutureVision',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
        },
        session: 'Closing Keynote: AI & Humanity — Co-Evolution or Collapse?',
        description: 'A visionary closing on AI\'s long-term trajectory, human-AI collaboration, and the existential questions we must answer now.'
      }
    ]
  ]

  return (
    <section id="schedule" className="section-padding bg-dark-800">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-lg">Event Schedule</span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6">
            5 Days of <span className="gradient-text">AI Excellence</span>
          </h2>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                activeDay === index
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500 text-white'
                  : 'bg-dark-900 border-dark-600 text-gray-400 hover:border-primary-500 hover:text-white'
              }`}
            >
              <div className="text-center">
                <div className="font-bold text-lg">{day.day}</div>
                <div className="text-sm opacity-80">{day.date}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Schedule Content */}
        <div ref={ref} className="bg-dark-900 rounded-2xl p-8 border border-dark-700">
          <div className="space-y-8">
            {scheduleData[activeDay]?.map((session, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-6 p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500 transition-all duration-300 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Time */}
                <div className="lg:w-48 flex-shrink-0">
                  <div className="text-xl font-bold text-primary-500">
                    {session.time}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Speaker */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={session.speaker.image}
                        alt={session.speaker.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{session.speaker.name}</h4>
                      <p className="text-sm text-gray-400">{session.speaker.title}</p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    Session: {session.session}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {session.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Schedule
