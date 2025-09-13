'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Calendar } from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  speaker: string;
  speakerTitle: string;
  description: string;
}

interface ScheduleDay {
  date: string;
  day: string;
  sessions: ScheduleItem[];
}

const scheduleData: ScheduleDay[] = [
  {
    date: "Oct 1, 2025",
    day: "Day 1",
    sessions: [
      {
        id: '1',
        time: '08:00 – 10:00 AM',
        title: 'Opening Keynote – The State of AI 2025',
        speaker: 'Joshua Henry',
        speakerTitle: 'AI Research Lead, DeepTech Labs',
        description: 'Kick off the event with an insightful overview of where artificial intelligence is headed. Ava will explore breakthroughs, global shifts, and what\'s next in deep learning, generative models, and AI ethics.'
      },
      {
        id: '2',
        time: '12:00 – 14:00 PM',
        title: 'Building Human-Centered AI Products',
        speaker: 'Leila Zhang',
        speakerTitle: 'VP of Machine Learning, Google',
        description: 'This session covers how to design AI solutions that prioritize usability, fairness, and real-world impact. Bring your laptop—hands-on UX exercises included.'
      },
      {
        id: '3',
        time: '16:00 – 18:00 PM',
        title: 'AI Policy & Regulation – A Global Overview',
        speaker: 'Carlos Rivera',
        speakerTitle: 'Founder & CEO, NeuralCore',
        description: 'Learn how nations and organizations are approaching AI governance, including frameworks for data privacy, bias mitigation, and accountability in model deployment.'
      },
      {
        id: '4',
        time: '20:00 – 22:00 PM',
        title: 'Building a Startup with AI at the Core',
        speaker: 'Maria Gonzalez',
        speakerTitle: 'Founder & CEO, SynthCore AI',
        description: 'Marco shares his journey launching an AI-first startup. Discover tips on tech stacks, team-building, funding, and scaling responsibly.'
      }
    ]
  },
  {
    date: "Oct 2, 2025",
    day: "Day 2",
    sessions: [
      {
        id: '5',
        time: '09:00 – 10:30 AM',
        title: 'Ethical AI — From Theory to Practice',
        speaker: 'Leila Zhang',
        speakerTitle: 'Head of AI Strategy, VisionFlow',
        description: 'Explore how leading companies are implementing fairness, accountability, and transparency in real-world AI systems across healthcare and finance.'
      },
      {
        id: '6',
        time: '11:00 – 12:30 PM',
        title: 'Bias in Data — Hidden Dangers in AI Pipelines',
        speaker: 'Lisa Zhang',
        speakerTitle: 'AI Ethics Researcher, FairAI Group',
        description: 'Lisa dives deep into the causes of bias in training data and showcases methods to detect and mitigate harm before deployment.'
      },
      {
        id: '7',
        time: '14:00 – 15:30 PM',
        title: 'Generative Models Beyond Text',
        speaker: 'Markus Blom',
        speakerTitle: 'CTO, SynthMind AI',
        description: 'A practical tour of the next generation of multimodal models generating images, video, and even 3D environments with AI.'
      },
      {
        id: '8',
        time: '16:00 – 17:30 PM',
        title: 'Building AI-Powered Interfaces',
        speaker: 'Priya Natarajan',
        speakerTitle: 'Lead Engineer, CogniWare',
        description: 'Learn how to embed conversational AI into web and mobile apps using modern open-source frameworks and API-first design.'
      }
    ]
  },
  {
    date: "Oct 3, 2025",
    day: "Day 3",
    sessions: [
      {
        id: '9',
        time: '09:00 – 10:30 AM',
        title: 'Transformers in 2025 — What\'s Next?',
        speaker: 'Sofia Romero',
        speakerTitle: 'ML Engineer, NeuronEdge',
        description: 'A technical session diving into the future of transformer architectures, memory optimization, and scaling challenges.'
      },
      {
        id: '10',
        time: '11:00 – 12:30 PM',
        title: 'Synthetic Data Generation for Training',
        speaker: 'Tomás Eriksson',
        speakerTitle: 'Founder, RealSim AI',
        description: 'Tomás shares tools and techniques for creating high-quality synthetic datasets that speed up training and reduce risk.'
      },
      {
        id: '11',
        time: '14:00 – 15:30 PM',
        title: 'AI Regulation & Global Policy Outlook',
        speaker: 'Aisha Mensah',
        speakerTitle: 'Senior AI Strategist, Datavine',
        description: 'Top voices discuss the global AI policy landscape, upcoming legislation, and how it will shape the future of AI deployment.'
      },
      {
        id: '12',
        time: '16:00 – 17:30 PM',
        title: 'Embodied AI in Robotics',
        speaker: 'Leo Tanaka',
        speakerTitle: 'Robotics Engineer, MetaForm',
        description: 'Discover how AI is powering next-gen robotics for manufacturing, logistics, and autonomous mobility through real-time interaction models.'
      }
    ]
  },
  {
    date: "Oct 4, 2025",
    day: "Day 4",
    sessions: [
      {
        id: '13',
        time: '09:00 – 10:30 AM',
        title: 'AI in Product Design — From Concept to Launch',
        speaker: 'Nina Köhler',
        speakerTitle: 'Chief Product Officer, SynthOS',
        description: 'Nina shares how AI is revolutionizing product development, from ideation to real-time user feedback integration.'
      },
      {
        id: '14',
        time: '11:00 – 12:30 PM',
        title: 'Scaling AI Infrastructure for Enterprise',
        speaker: 'Emmanuel Ruiz',
        speakerTitle: 'CEO, NextCore Analytics',
        description: 'Explore key considerations when deploying and managing scalable, secure, and cost-effective AI systems in the enterprise space.'
      },
      {
        id: '15',
        time: '14:00 – 15:30 PM',
        title: 'Multilingual AI — Global Challenges & Innovations',
        speaker: 'Isabelle Chen',
        speakerTitle: 'Head of Language Models, LumoAI',
        description: 'How modern LLMs are overcoming linguistic bias, translation errors, and dialect diversity in global applications.'
      },
      {
        id: '16',
        time: '16:00 – 17:30 PM',
        title: 'Building AI Pipelines in the Cloud',
        speaker: 'Connor Walsh',
        speakerTitle: 'Cloud AI Architect, SkyStack',
        description: 'Hands-on session building a full AI workflow using serverless tech, vector databases, and model deployment strategies.'
      }
    ]
  },
  {
    date: "Oct 5, 2025",
    day: "Day 5",
    sessions: [
      {
        id: '17',
        time: '09:00 – 10:30 AM',
        title: 'Ethical Design in AI — A Human-Centered Approach',
        speaker: 'Elena Greco',
        speakerTitle: 'Ethics Advisor, Global AI Forum',
        description: 'A deep dive into responsible AI, highlighting bias mitigation, fairness, transparency, and global implications of autonomous systems.'
      },
      {
        id: '18',
        time: '11:00 – 12:30 PM',
        title: 'Personalized Learning with AI',
        speaker: 'Marcus Dlamini',
        speakerTitle: 'Founder, EduAI Labs',
        description: 'Explore how AI-driven platforms are transforming education with adaptive learning paths and dynamic content delivery.'
      },
      {
        id: '19',
        time: '14:00 – 15:30 PM',
        title: 'Creative AI — From Text to Video',
        speaker: 'Lara Nguyen',
        speakerTitle: 'GenAI Director, NovaSynth',
        description: 'Lara demonstrates how generative AI is transforming content creation, with real-time demos in video, audio, and image generation.'
      },
      {
        id: '20',
        time: '16:00 – 17:30 PM',
        title: 'Closing Keynote: AI & Humanity — Co-Evolution or Collapse?',
        speaker: 'Dr. Hassan Al-Mansour',
        speakerTitle: 'Lead Data Scientist, FutureVision',
        description: 'A visionary closing on AI\'s long-term trajectory, human-AI collaboration, and the existential questions we must answer now.'
      }
    ]
  }
];

export default function AIventSchedule() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section
      id="schedule"
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1A1B3A 0%, #0F0B1F 50%, #1A1B3A 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Complex Background Pattern - Exact AIvent Style */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
              linear-gradient(180deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px'
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-16 h-16 border border-white/10 rotate-45"
          animate={{
            rotate: [45, 135, 45],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            backdropFilter: 'blur(10px)'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div
            className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#A5B4FC'
            }}
          >
            Event Schedule
          </div>

          <h2
            className="text-white font-black mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            5 Days of{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Excellence
            </span>
          </h2>
        </motion.div>

        {/* Day Tabs - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-16 overflow-x-auto"
        >
          <div
            className="flex p-2 rounded-2xl min-w-max"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {scheduleData.map((day, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
                  activeDay === index ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
                style={{
                  background: activeDay === index
                    ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                    : 'transparent',
                  boxShadow: activeDay === index
                    ? '0 8px 24px rgba(99, 102, 241, 0.3)'
                    : 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-bold">{day.day}</div>
                <div className="text-xs opacity-80 mt-1">{day.date}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Schedule Content - Exact AIvent Style */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="space-y-6">
              {scheduleData[activeDay]?.sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group p-8 rounded-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                  whileHover={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Time - Exact AIvent Style */}
                    <div className="lg:w-52 flex-shrink-0">
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                          color: 'white',
                          fontSize: '14px',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </div>
                    </div>

                    {/* Session Details - Exact AIvent Style */}
                    <div className="flex-1">
                      <h3
                        className="text-white font-bold mb-4 group-hover:text-blue-300 transition-colors duration-300"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 700,
                          fontSize: '22px',
                          lineHeight: 1.3
                        }}
                      >
                        {session.title}
                      </h3>

                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                          }}
                        >
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div
                            className="font-bold text-white"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '16px'
                            }}
                          >
                            {session.speaker}
                          </div>
                          <div
                            className="text-white/70"
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px'
                            }}
                          >
                            {session.speakerTitle}
                          </div>
                        </div>
                      </div>

                      <p
                        className="text-white/80 leading-relaxed"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '15px',
                          lineHeight: 1.6
                        }}
                      >
                        {session.description}
                      </p>

                      {/* Hover effect line */}
                      <div
                        className="w-0 h-0.5 mt-6 group-hover:w-full transition-all duration-500"
                        style={{
                          background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                        }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Download Schedule Button - Exact AIvent Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            className="inline-flex items-center px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 group"
            style={{
              fontSize: '14px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            Download Full Schedule
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
