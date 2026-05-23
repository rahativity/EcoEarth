'use client';

import { motion } from 'framer-motion';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
        initial="hidden"
        animate="visible"
      >
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Orbit Ring 1 */}
        <motion.ellipse
          cx="50" cy="50" rx="42" ry="30"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeOpacity="0.3"
          transform="rotate(-20 50 50)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Orbit Ring 2 */}
        <motion.ellipse
          cx="50" cy="50" rx="42" ry="30"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          strokeOpacity="0.3"
          transform="rotate(40 50 50)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />
        
        {/* Earth Base */}
        <motion.circle
          cx="50"
          cy="50"
          r="24"
          fill="url(#earthGrad)"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        />

        {/* Flowing Leaf Shape */}
        <motion.path
          d="M 50 15 C 75 15 85 35 85 50 C 85 70 65 85 50 85 C 30 85 15 70 15 50 C 15 40 30 15 50 15 Z"
          fill="url(#leafGrad)"
          opacity="0.9"
          filter="url(#glow)"
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 0.9, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.2 }}
        />

        {/* Inner Leaf Vein / Tech Line */}
        <motion.path
          d="M 50 80 Q 40 50 55 20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
        
        {/* Animated Particles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="50"
            cy="10"
            r="3"
            fill="hsl(var(--primary))"
            animate={{ rotate: 360 }}
            style={{ originX: "50px", originY: "50px" }}
            transition={{ duration: 3 + i, ease: "linear", repeat: Infinity, delay: i }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
