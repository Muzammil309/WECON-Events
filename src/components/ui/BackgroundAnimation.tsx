'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface BackgroundAnimationProps {
  variant?: 'default' | 'minimal' | 'particles';
  intensity?: 'low' | 'medium' | 'high';
  respectMotionPreference?: boolean;
}

export function BackgroundAnimation({ 
  variant = 'default', 
  intensity = 'medium',
  respectMotionPreference = true 
}: BackgroundAnimationProps) {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (respectMotionPreference) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [respectMotionPreference]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const shapeCount = intensity === 'low' ? 3 : intensity === 'medium' ? 6 : 12;
    const colors = [
      'from-indigo-500/20 to-purple-500/20',
      'from-fuchsia-500/20 to-pink-500/20',
      'from-cyan-500/20 to-blue-500/20',
      'from-emerald-500/20 to-green-500/20',
      'from-orange-500/20 to-red-500/20',
      'from-violet-500/20 to-indigo-500/20',
    ];

    const newShapes: FloatingShape[] = Array.from({ length: shapeCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));

    setShapes(newShapes);
  }, [intensity, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-fuchsia-50/30 dark:from-indigo-950/30 dark:via-gray-900 dark:to-fuchsia-950/30" />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-fuchsia-50/50 dark:from-indigo-950/50 dark:via-gray-900 dark:to-fuchsia-950/50"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
              'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(6, 182, 212, 0.1))',
              'linear-gradient(225deg, rgba(6, 182, 212, 0.1), rgba(99, 102, 241, 0.1))',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (variant === 'particles') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-full opacity-60"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size / 4}px`,
              height: `${shape.size / 4}px`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.8, 0.4, 0.3],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: shape.delay,
            }}
          >
            <div className={`w-full h-full bg-gradient-to-r ${shape.color} rounded-full blur-sm`} />
          </motion.div>
        ))}
      </div>
    );
  }

  // Default variant with floating shapes
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-fuchsia-50/30 dark:from-indigo-950/30 dark:via-gray-900 dark:to-fuchsia-950/30"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(99, 102, 241, 0.05), rgba(236, 72, 153, 0.05))',
            'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(6, 182, 212, 0.05))',
            'linear-gradient(225deg, rgba(6, 182, 212, 0.05), rgba(99, 102, 241, 0.05))',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.3, 0.7, 1],
            opacity: [0.2, 0.6, 0.3, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        >
          <div className={`w-full h-full bg-gradient-to-r ${shape.color} rounded-full`} />
        </motion.div>
      ))}

      {/* Additional overlay effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-fuchsia-400/10 to-cyan-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />
    </div>
  );
}

// Utility component for page-specific backgrounds
export function PageBackground({ children, variant = 'default', intensity = 'medium' }: {
  children: React.ReactNode;
  variant?: 'default' | 'minimal' | 'particles';
  intensity?: 'low' | 'medium' | 'high';
}) {
  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation variant={variant} intensity={intensity} />
      {children}
    </div>
  );
}
