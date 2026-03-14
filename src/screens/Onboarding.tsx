import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../animations/variants';

const SLIDES = [
  {
    title: "Your mind deserves a place to land.",
    sub: "A private daily journal built for students. No streaks, no pressure — just you.",
    icon: "🧘"
  },
  {
    title: "Three numbers. One moment. Every day.",
    sub: "Log your mood, energy, and stress in seconds to see patterns over time.",
    icon: "📊"
  },
  {
    title: "Only you can read this.",
    sub: "Your entries live on this device. Enable cloud backup anytime, optional.",
    icon: "🔒"
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      localStorage.setItem('lumis_onboarded', 'true');
      if (name) localStorage.setItem('lumis_name', name);
      navigate('/checkin');
    }
  };

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}
    >
      <div className="ambient-bg" />

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          style={{ textAlign: 'left' }}
        >
          <div style={{ fontSize: '80px', marginBottom: '40px' }}>{SLIDES[currentSlide].icon}</div>
          <h1 className="t-display" style={{ marginBottom: '16px' }}>{SLIDES[currentSlide].title}</h1>
          <p className="t-body" style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>{SLIDES[currentSlide].sub}</p>
          
          {currentSlide === 2 && (
            <div style={{ marginBottom: '40px' }}>
              <input 
                type="text" className="glass-input" placeholder="What should we call you?"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
        {SLIDES.map((_, i) => (
          <motion.div 
            key={i}
            animate={{ width: currentSlide === i ? '24px' : '8px' }}
            style={{ height: '8px', borderRadius: '4px', background: currentSlide === i ? 'var(--accent-violet)' : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>

      <button className="btn-primary" onClick={handleNext}>
        {currentSlide === 2 ? 'Begin journaling →' : 'Continue'}
      </button>
    </motion.div>
  );
}
