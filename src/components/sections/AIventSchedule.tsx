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
    <section id="schedule" className="section bg-surface-primary relative overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-surface-secondary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
            Event Schedule
          </div>
          
          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.015em'
            }}
          >
            5 Days of AI Excellence
          </h2>
        </motion.div>

        {/* Day Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12 overflow-x-auto"
        >
          <div className="flex bg-surface-secondary rounded-xl p-2 border border-border-primary min-w-max">
            {scheduleData.map((day, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  activeDay === index
                    ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
                }`}
              >
                <div className="text-sm font-semibold">{day.day}</div>
                <div className="text-xs opacity-75">{day.date}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Schedule Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {scheduleData[activeDay]?.sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-surface-secondary border border-border-primary rounded-xl p-6 hover:bg-surface-tertiary transition-all duration-300 hover:border-border-secondary"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Time */}
                    <div className="lg:w-48 flex-shrink-0">
                      <div className="flex items-center gap-2 text-accent-blue font-semibold mb-2">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">
                        {session.title}
                      </h3>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{session.speaker}</div>
                          <div className="text-sm text-text-muted">{session.speakerTitle}</div>
                        </div>
                      </div>

                      <p className="text-text-secondary leading-relaxed">
                        {session.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Download Schedule Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
            <Calendar className="w-5 h-5 mr-2" />
            Download Full Schedule
          </button>
        </motion.div>
      </div>
    </section>
  );
}
