'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowRight, Play } from 'lucide-react';

interface CountdownProps {
  targetDate: Date;
}

interface ModernHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  eventDate: Date;
  location: string;
  attendeeCount?: number;
  primaryCTA: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  backgroundImage?: string;
  showCountdown?: boolean;
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
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-surface-primary border border-border-primary rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold text-text-primary">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm text-text-muted font-medium mt-1">
              {unit.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ModernHero({
  title,
  subtitle,
  description,
  eventDate,
  location,
  attendeeCount,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  showCountdown = true
}: ModernHeroProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-primary-bg-light to-primary-bg-dark" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-primary-bg/60 backdrop-blur-sm" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent-blue/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {subtitle && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6"
              >
                [ {subtitle} ]
              </motion.div>
            )}

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight"
            >
              {title}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 text-text-secondary">
                <Calendar className="w-5 h-5 text-accent-blue" />
                <span className="font-medium">
                  {eventDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 text-text-secondary">
                <MapPin className="w-5 h-5 text-accent-blue" />
                <span className="font-medium">{location}</span>
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={primaryCTA.onClick}
                className="btn btn-primary text-lg px-8 py-4 group"
              >
                {primaryCTA.label}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {secondaryCTA && (
                <button
                  onClick={secondaryCTA.onClick}
                  className="btn btn-secondary text-lg px-8 py-4 group"
                >
                  <Play className="w-5 h-5" />
                  {secondaryCTA.label}
                </button>
              )}
            </motion.div>

            {attendeeCount && (
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start gap-2 mt-8 text-text-muted"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">
                  {attendeeCount.toLocaleString()} attendees registered
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Countdown & Quick Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {showCountdown && (
              <motion.div variants={itemVariants}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Hurry Up!
                  </h2>
                  <p className="text-text-secondary">Book Your Seat Now</p>
                </div>
                <CountdownTimer targetDate={eventDate} />
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className="bg-surface-primary border border-border-primary rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-accent-blue" />
                <h3 className="text-lg font-semibold text-text-primary">Event Location</h3>
              </div>
              <p className="text-text-secondary">{location}</p>
              
              <div className="flex items-center gap-3 mt-6 mb-4">
                <Clock className="w-6 h-6 text-accent-blue" />
                <h3 className="text-lg font-semibold text-text-primary">Event Time</h3>
              </div>
              <p className="text-text-secondary">
                {eventDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-text-muted text-sm mt-1">
                {eventDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-text-primary">50+</div>
                <div className="text-sm text-text-muted">Speakers</div>
              </div>
              <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-text-primary">5</div>
                <div className="text-sm text-text-muted">Days</div>
              </div>
              <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-text-primary">100+</div>
                <div className="text-sm text-text-muted">Sessions</div>
              </div>
              <div className="bg-surface-primary border border-border-primary rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-text-primary">1K+</div>
                <div className="text-sm text-text-muted">Attendees</div>
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
