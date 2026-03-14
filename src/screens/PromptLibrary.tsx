import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, staggerContainer, cardEntrance } from '../animations/variants';
import { ChevronLeft, Search } from 'lucide-react';

const CATEGORIES = [
  { name: 'Self-Reflection', prompts: ["What's one thing I learned about myself today?", "How did I handle a challenge recently?", "What am I avoiding right now?"] },
  { name: 'Gratitude', prompts: ["Who made my day better today?", "What is a small luxury I am grateful for?", "What made me smile today?"] },
  { name: 'Anxiety & Stress', prompts: ["What is within my control right now?", "If this feeling was a weather pattern, what would it be?", "What is the smallest thing I can do to feel better?"] }
];

export default function PromptLibraryScreen() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      style={{ padding: '24px' }}
    >
      <div className="ambient-bg" />
      
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><ChevronLeft /></button>
        <h1 className="t-title">Prompt Library</h1>
      </header>

      <div className="glass-card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Search size={18} color="var(--text-tertiary)" />
        <input type="text" placeholder="Search prompts..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="initial" animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '100px' }}
      >
        {CATEGORIES.map(cat => (
          <div key={cat.name}>
            <p className="t-caption" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '16px' }}>{cat.name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cat.prompts.map(p => (
                <motion.div 
                  key={p} 
                  variants={cardEntrance}
                  onClick={() => { localStorage.setItem('lumis_selected_prompt', p); navigate('/checkin'); }}
                  className="glass-card" 
                  style={{ padding: '16px', cursor: 'pointer' }}
                >
                  <p className="t-body" style={{ fontSize: '14px' }}>{p}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
