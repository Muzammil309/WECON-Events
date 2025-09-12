import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Check, 
  ArrowRight, 
  Menu, 
  X,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Calendar,
  Users,
  Star
} from 'lucide-react';

const AIventClone = () => {
  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-10-27T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sample data
  const speakers = [
    {
      name: "Dr. Sarah Chen",
      title: "AI Research Director",
      image: "https://placehold.co/200x200/8A2BE2/ffffff?text=SC"
    },
    {
      name: "Marcus Johnson",
      title: "Machine Learning Engineer",
      image: "https://placehold.co/200x200/8A2BE2/ffffff?text=MJ"
    },
    {
      name: "Elena Rodriguez",
      title: "Data Science Lead",
      image: "https://placehold.co/200x200/8A2BE2/ffffff?text=ER"
    }
  ];

  const scheduleItems = [
    {
      time: "09:00 AM",
      title: "Opening Keynote: The Future of AI",
      speaker: "Dr. Sarah Chen",
      image: "https://placehold.co/60x60/8A2BE2/ffffff?text=SC"
    },
    {
      time: "10:30 AM",
      title: "Machine Learning in Production",
      speaker: "Marcus Johnson",
      image: "https://placehold.co/60x60/8A2BE2/ffffff?text=MJ"
    },
    {
      time: "02:00 PM",
      title: "Data Science Best Practices",
      speaker: "Elena Rodriguez",
      image: "https://placehold.co/60x60/8A2BE2/ffffff?text=ER"
    },
    {
      time: "03:30 PM",
      title: "AI Ethics and Responsibility",
      speaker: "Dr. Sarah Chen",
      image: "https://placehold.co/60x60/8A2BE2/ffffff?text=SC"
    }
  ];

  const pricingPlans = [
    {
      name: "Early Bird",
      price: "$299",
      features: ["Access to all sessions", "Networking events", "Conference materials", "Lunch included"],
      isPopular: false
    },
    {
      name: "Standard",
      price: "$399",
      features: ["Access to all sessions", "Networking events", "Conference materials", "Lunch included", "Workshop access"],
      isPopular: true
    },
    {
      name: "VIP",
      price: "$599",
      features: ["Access to all sessions", "Networking events", "Conference materials", "Lunch included", "Workshop access", "Meet & greet with speakers"],
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-purple-900 text-gray-300">
      {/* --- Header & Navigation --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="text-2xl font-bold text-white">
              ai<span className="text-purple-400">vent</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Home', 'Schedule', 'Speakers', 'Pricing', 'Venue'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Buy Ticket Button */}
            <button className="hidden md:block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300">
              Buy Ticket
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-md rounded-lg mt-2 p-4">
              <nav className="flex flex-col space-y-4">
                {['Home', 'Schedule', 'Speakers', 'Pricing', 'Venue'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full mt-4">
                  Buy Ticket
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-purple-800/80">
          <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/0c001f/8A2BE2?text=AI+SUMMIT+BACKGROUND')] bg-cover bg-center opacity-30"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wider">
            AI SUMMIT <span className="text-purple-400">2025</span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl md:text-4xl font-light mb-8 tracking-widest text-gray-200">
            UNVEILING THE FUTURE
          </h2>

          {/* Info Bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 text-lg">
            <div className="flex items-center gap-2">
              <Clock className="text-purple-400" size={20} />
              <span>October 27-29, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-purple-400" size={20} />
              <span>San Francisco, CA</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12 max-w-2xl mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
                <div className="text-3xl md:text-5xl font-bold text-purple-400">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">
                  {unit}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            Register Now
          </button>
        </div>
      </section>

      {/* --- About Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Where The Future of AI{' '}
                <span className="text-purple-400">Unfolds</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join the world's leading AI researchers, engineers, and visionaries as we explore
                the cutting-edge developments that will shape tomorrow. Experience groundbreaking
                presentations, hands-on workshops, and networking opportunities that will accelerate
                your AI journey.
              </p>
            </div>

            {/* Right Column - Animated Orb */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80">
                {/* Animated wireframe orb */}
                <div className="absolute inset-0 animate-spin-slow">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Outer ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                    {/* Middle ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="url(#gradient2)"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      className="animate-pulse delay-500"
                    />
                    {/* Inner ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="30"
                      fill="none"
                      stroke="url(#gradient3)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      className="animate-pulse delay-1000"
                    />

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4B0082" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333EA" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Glowing core */}
                <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-400 rounded-full animate-pulse shadow-2xl shadow-purple-400/50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Image Gallery Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Neural+Networks',
              'Robotics',
              'Data+Viz',
              'Machine+Learning',
              'AI+Ethics',
              'Future+Tech'
            ].map((topic, index) => (
              <div
                key={index}
                className="aspect-square bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-lg overflow-hidden border border-purple-500/30 hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={`https://placehold.co/300x300/8A2BE2/ffffff?text=${topic}`}
                  alt={topic.replace('+', ' ')}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why You Can't Miss This Event Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why You Can't Miss This <span className="text-purple-400">Event</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                This isn't just another conference. It's where the future of artificial intelligence
                is being written. Connect with industry pioneers, discover breakthrough technologies,
                and be part of the conversation that will define the next decade.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Learn from world-renowned AI experts and researchers',
                  'Network with industry leaders and innovative startups',
                  'Hands-on workshops with cutting-edge AI tools',
                  'Exclusive access to unreleased AI technologies'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
              >
                Learn More
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </a>
            </div>

            {/* Right Column - Image */}
            <div>
              <img
                src="https://placehold.co/600x400/8A2BE2/ffffff?text=AI+Innovation"
                alt="AI Innovation"
                className="w-full rounded-2xl shadow-2xl border border-purple-500/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- Featured Speakers Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-purple-400">Speakers</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn from the brightest minds in artificial intelligence, machine learning,
              and data science who are shaping the future of technology.
            </p>
          </div>

          {/* Speakers Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <div
                key={index}
                className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:-translate-y-2 transition-all duration-300 text-center group"
              >
                <div className="relative mb-6">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-purple-400 group-hover:border-purple-300 transition-colors duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{speaker.name}</h3>
                <p className="text-purple-400 font-medium">{speaker.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Sponsors Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-400">Our Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {['TechCorp', 'AI Labs', 'DataFlow', 'NeuralNet', 'FutureAI', 'DeepMind'].map((sponsor, index) => (
                <div
                  key={index}
                  className="text-2xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  {sponsor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Schedule & Agenda Section --- */}
      <section id="schedule" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Schedule & <span className="text-purple-400">Agenda</span>
            </h2>
            <p className="text-xl text-gray-300">
              Three days packed with insights, workshops, and networking opportunities.
            </p>
          </div>

          {/* Schedule Items */}
          <div className="space-y-6">
            {scheduleItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-6 p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all duration-300"
              >
                {/* Time */}
                <div className="w-24 flex-shrink-0">
                  <span className="text-lg font-bold text-purple-400">{item.time}</span>
                </div>

                {/* Session Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.speaker}</p>
                </div>

                {/* Speaker Image */}
                <div className="w-12 h-12 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.speaker}
                    className="w-full h-full rounded-full border-2 border-purple-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-purple-400">Plan</span>
            </h2>
            <p className="text-xl text-gray-300">
              Select the perfect ticket for your AI Summit experience.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-black/20 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-purple-400 scale-105 bg-purple-500/10'
                    : 'border-purple-500/30 hover:border-purple-400'
                }`}
              >
                {/* Most Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="text-5xl font-bold text-purple-400 mb-2">{plan.price}</div>
                  <p className="text-gray-400">per person</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="text-green-400 mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      : 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
                  }`}
                >
                  Buy Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Venue Section --- */}
      <section id="venue" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Event <span className="text-purple-400">Venue</span>
            </h2>
            <p className="text-xl text-gray-300">
              Join us at the heart of innovation in San Francisco.
            </p>
          </div>

          {/* Venue Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl overflow-hidden border border-purple-500/30">
              <img
                src="https://placehold.co/600x400/8A2BE2/ffffff?text=Conference+Center"
                alt="Conference Center"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl overflow-hidden border border-purple-500/30">
              <img
                src="https://placehold.co/600x400/8A2BE2/ffffff?text=Networking+Area"
                alt="Networking Area"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Venue Info */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">San Francisco Convention Center</h3>
            <p className="text-xl text-gray-300 mb-6">747 Howard Street, San Francisco, CA 94103</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
            >
              <MapPin size={20} />
              View on Map
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>
          </div>
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-purple-500/30 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Logo */}
            <div className="text-4xl font-bold text-white mb-4">
              ai<span className="text-purple-400">vent</span>
            </div>

            {/* Tagline */}
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Where artificial intelligence meets human innovation. Join us in shaping the future.
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-8">
              {[
                { Icon: Twitter, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Linkedin, href: '#' }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-400 hover:text-white hover:bg-purple-600 transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © 2025 AI Summit. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIventClone;
