import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { checkDeviceAndAuth } from '../utils/deviceCheck';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const [route] = await Promise.all([
        checkDeviceAndAuth(),
        new Promise(res => setTimeout(res, 1200)) // minimum display time
      ]);
      navigate(route, { replace: true });
    };
    run();
  }, [navigate]);

  return (
    <div className="screen" style={{ 
      background: 'var(--bg-base)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="ambient-bg" />
      
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >
        <h1 className="t-display" style={{ fontStyle: 'italic', marginBottom: '8px' }}>Lumis</h1>
        <motion.p 
          className="t-caption"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: 'var(--text-secondary)' }}
        >
          your mind, understood.
        </motion.p>
      </motion.div>
    </div>
  );
}
