'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Play } from 'lucide-react';

interface CountdownProps {
  targetDate: Date;
}

function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-surface-primary/80 border border-border-primary rounded-lg p-3 backdrop-blur-sm">
            <div className="text-xl md:text-2xl font-bold text-text-primary">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-text-muted font-medium mt-1">
              {unit.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function AIventHero() {
  const eventDate = new Date('2025-10-01T09:00:00');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.03, 0.28, 0.98]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with geometric patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-primary-bg-light to-primary-bg-dark" />
        
        {/* Geometric background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
          
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent-blue/20 rounded-full"
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 bg-surface-primary/80 border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6 backdrop-blur-sm"
            >
              The Future of Intelligence
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-8 leading-tight"
            >
              AI Summit 2025
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 mb-8 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-10 h-10 bg-surface-primary/80 border border-border-primary rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Calendar className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Date</div>
                  <div className="font-medium">October 1–5, 2025</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-10 h-10 bg-surface-primary/80 border border-border-primary rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <MapPin className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Location</div>
                  <div className="font-medium">San Francisco, CA</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 group">
                Get Tickets
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button className="inline-flex items-center px-8 py-4 bg-surface-primary/80 border border-border-primary text-text-primary font-medium rounded-lg hover:bg-surface-secondary transition-all duration-200 backdrop-blur-sm group">
                <Play className="w-5 h-5 mr-2" />
                View Schedule
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Countdown & Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Countdown Section */}
            <motion.div variants={itemVariants}>
              <div className="bg-surface-primary/80 border border-border-primary rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-text-primary mb-2">
                    Hurry Up!
                  </h2>
                  <p className="text-text-secondary">Book Your Seat Now</p>
                </div>
                <CountdownTimer targetDate={eventDate} />
              </div>
            </motion.div>

            {/* Event Info Card */}
            <motion.div
              variants={itemVariants}
              className="bg-surface-primary/80 border border-border-primary rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Event Location</h3>
                  <p className="text-sm text-text-muted">121 AI Blvd, San Francisco BCA 94107</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-border-primary rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-accent-blue rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
