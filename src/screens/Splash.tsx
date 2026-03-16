import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { checkDeviceAndAuth } from '../utils/deviceCheck';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Self-heal: Ensure old verification flags don't get stuck
    if (localStorage.getItem('lumis_verify_reason') === 'none') {
      localStorage.removeItem('lumis_verify_reason');
    }

    const run = async () => {
      try {
        const route = await checkDeviceAndAuth();
        console.log("SplashScreen routing to:", route);
        
        // Safety: If for some reason we land here and checkDeviceAndAuth is confused,
        // default to home if we have atrusted device flag
        const isTrusted = localStorage.getItem('lumis_device_trusted') === 'true';
        const finalRoute = (route === '/welcome' && isTrusted) ? '/home' : route;

        setTimeout(() => {
          navigate(finalRoute, { replace: true });
        }, 1200);
      } catch (err) {
        console.error("Critical boot error:", err);
        navigate('/welcome', { replace: true });
      }
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >
        <h1 className="t-display" style={{ fontStyle: 'italic', marginBottom: '8px', fontSize: '48px', color: 'white' }}>Lumis</h1>
        <p className="t-caption" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>your mind, understood.</p>
      </motion.div>
    </div>
  );
}
