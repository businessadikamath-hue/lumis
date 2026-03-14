import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import { ChevronLeft, Sparkles, Download, Share2 } from 'lucide-react';

export default function ReflectionScreen() {
  const navigate = useNavigate();

  // This would normally be fetched from the DB
  const reflection = {
    title: "Monthly Reflection",
    subtitle: "January 2026",
    content: "This month, your mood has been remarkably stable. You noted 'focused' and 'productive' on most days. However, your stress levels spiked during exam week. It's clear that while you handle regular workload well, the pressure of evaluation is a significant trigger for you. Consider practicing the breathing techniques we discussed more frequently during these periods.",
    advice: "Try to carve out 10 minutes of 'non-productive' time even on your busiest days next month."
  };

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      style={{ padding: '24px' }}
    >
      <div className="ambient-bg" />
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><ChevronLeft /></button>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><Share2 size={20} /></button>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><Download size={20} /></button>
        </div>
      </header>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c6bff, #ff8c69)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Sparkles size={32} />
        </div>
        <h1 className="t-title" style={{ fontSize: '28px' }}>{reflection.title}</h1>
        <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>{reflection.subtitle}</p>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <p className="t-body" style={{ lineHeight: '1.8', color: 'white' }}>
          {reflection.content}
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-violet)', background: 'var(--accent-violet-20)' }}>
        <p className="t-heading" style={{ color: 'var(--accent-violet)', marginBottom: '8px', fontSize: '14px' }}>AI ADVICE</p>
        <p className="t-body" style={{ fontStyle: 'italic' }}>
          "{reflection.advice}"
        </p>
      </div>

      <button className="btn-primary" style={{ marginTop: '40px' }} onClick={() => navigate('/home')}>
        I've read it
      </button>
    </motion.div>
  );
}
