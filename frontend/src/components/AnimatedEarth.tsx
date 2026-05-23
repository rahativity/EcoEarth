'use client';

import { motion } from 'framer-motion';

export default function AnimatedEarth({ className = "w-64 h-64" }: { className?: string }) {
  // Generate random atmospheric particles
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    orbitRadius: 55 + Math.random() * 40,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 10,
    angle: Math.random() * 360,
  }));

  return (
    <div className={`relative flex items-center justify-center group ${className}`}>
      
      {/* Immersive Background Glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[60px] scale-150 animate-pulse group-hover:bg-emerald-400/30 transition-colors duration-700"></div>

      <motion.svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <defs>
          <radialGradient id="oceanGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.9" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#021c17" stopOpacity="1" />
          </radialGradient>
          
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
          </radialGradient>

          <filter id="softBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          
          <filter id="heavyBlur">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Ambient Orbit Rings */}
        <motion.circle
          cx="100" cy="100" r="90"
          fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="2 10"
          animate={{ rotate: 360 }}
          style={{ originX: "100px", originY: "100px" }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        />
        
        <motion.circle
          cx="100" cy="100" r="75"
          fill="none" stroke="hsl(var(--accent))" strokeWidth="0.5" strokeOpacity="0.3"
          animate={{ rotate: -360 }}
          style={{ originX: "100px", originY: "100px" }}
          transition={{ duration: 35, ease: "linear", repeat: Infinity }}
        />

        {/* Ocean Base */}
        <circle cx="100" cy="100" r="50" fill="url(#oceanGrad)" className="drop-shadow-2xl" />

        {/* Detailed Rotating Continents Group */}
        <motion.g
          animate={{ rotate: 360 }}
          style={{ originX: "100px", originY: "100px" }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {/* Continent 1 */}
          <path d="M 60 70 Q 75 55 95 65 T 120 60 Q 135 80 120 95 T 130 120 Q 100 135 80 115 T 55 75 Z" fill="#10b981" opacity="0.75" />
          {/* Sub-landmass */}
          <path d="M 115 50 Q 130 55 140 45 T 145 60 Q 125 75 115 50 Z" fill="#059669" opacity="0.65" />
          {/* Continent 2 */}
          <path d="M 45 105 Q 65 125 45 140 T 55 110 Z" fill="#34d399" opacity="0.8" />
          {/* Continent 3 */}
          <path d="M 130 110 Q 145 130 125 145 T 115 125 Z" fill="#047857" opacity="0.7" />
        </motion.g>

        {/* Cloud Layer (Rotates slightly faster) */}
        <motion.g
          animate={{ rotate: 360 }}
          style={{ originX: "100px", originY: "100px" }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          filter="url(#softBlur)"
        >
          <path d="M 55 60 Q 70 50 85 65" stroke="url(#cloudGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 110 75 Q 130 85 140 70" stroke="url(#cloudGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 65 120 Q 80 135 100 115" stroke="url(#cloudGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 120 130 Q 135 145 145 125" stroke="url(#cloudGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Atmosphere Edge Glow */}
        <circle cx="100" cy="100" r="50" fill="url(#atmosphereGlow)" />
        <circle cx="100" cy="100" r="51" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeOpacity="0.6" filter="url(#softBlur)" />

        {/* Floating Particles */}
        {particles.map(p => (
          <motion.circle
            key={p.id}
            cx="100"
            cy={100 - p.orbitRadius}
            r={p.size}
            fill="hsl(var(--primary))"
            opacity="0.8"
            initial={{ rotate: p.angle }}
            animate={{ rotate: p.angle + 360 }}
            style={{ originX: "100px", originY: "100px" }}
            transition={{ duration: p.duration, delay: p.delay, ease: "linear", repeat: Infinity }}
          />
        ))}

        {/* Pulsing Energy Ring */}
        <motion.circle
          cx="100" cy="100" r="50"
          fill="none" stroke="hsl(var(--primary))" strokeWidth="1"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.6, opacity: 0 }}
          style={{ originX: "100px", originY: "100px" }}
          transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
        />
      </motion.svg>
    </div>
  );
}
