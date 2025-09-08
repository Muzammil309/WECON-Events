'use client';

import React from 'react';

// Simple test page to verify modern design components work
export default function TestModernPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary-bg border-b border-border-primary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-text-primary">WECON</span>
            </div>
            <button className="btn btn-primary">
              Test Button
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '800px', paddingTop: '80px' }}>
        {/* Background */}
        <div className="absolute inset-0 bg-primary-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-primary-bg to-surface-primary" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
                [ The Future of Intelligence ]
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
                AI Summit 2025
              </h1>
              
              <p className="text-xl text-text-secondary mb-8 leading-relaxed max-w-2xl">
                Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.
              </p>

              <div className="flex items-center gap-2 text-text-secondary mb-8">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>October 1–5, 2025</span>
                </div>
                <span className="mx-4">•</span>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>San Francisco, CA</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn btn-primary text-lg px-8 py-4">
                  Register Now
                </button>
                <button className="btn btn-secondary text-lg px-8 py-4">
                  Watch Trailer
                </button>
              </div>
            </div>

            {/* Right Column - Countdown */}
            <div className="text-center">
              <div className="bg-surface-primary border border-border-primary rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Hurry Up!</h3>
                <h4 className="text-lg text-text-secondary mb-8">Book Your Seat Now</h4>
                
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { value: '92', label: 'Days' },
                    { value: '17', label: 'Hours' },
                    { value: '21', label: 'Minutes' },
                    { value: '45', label: 'Seconds' }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                        {item.value}
                      </div>
                      <div className="text-sm text-text-muted">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-text-secondary">
                  <span>📍</span>
                  <span>121 AI Blvd, San Francisco BCA 94107</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-primary-bg">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-surface-primary border border-border-primary rounded-full text-sm font-medium text-text-secondary mb-6">
              [ About the Event ]
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              A Global Gathering of AI Innovators
            </h2>
            
            <p className="text-xl text-text-secondary mb-12 leading-relaxed">
              Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                "5 days of keynotes, workshops, and networking",
                "50+ world-class speakers",
                "Startup showcase and live demos"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-6 bg-surface-primary border border-border-primary rounded-xl">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-text-secondary font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Banner */}
      <section className="py-8 bg-surface-primary border-y border-border-primary overflow-hidden">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-primary to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-primary to-transparent z-10" />
          
          <div className="flex whitespace-nowrap animate-scroll">
            <div className="flex items-center gap-8 text-2xl md:text-3xl font-bold text-text-primary">
              Next Intelligence / Future Now / Empowering Innovation / Smarter Tomorrow / Think Forward / Cognitive Shift /
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-surface-primary border-t border-border-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">WECON</span>
          </div>
          <p className="text-text-muted">
            © 2024 WECON. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
