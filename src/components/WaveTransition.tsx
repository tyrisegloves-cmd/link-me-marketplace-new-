import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaveTransitionProps {
  active: boolean;
  originX: number;
  originY: number;
  onComplete: () => void;
}

export function WaveTransition({ active, originX, originY, onComplete }: WaveTransitionProps) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (!active) {
      calledRef.current = false;
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="wave-overlay"
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ background: 'transparent' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Ripple circle that expands from click origin to fill screen */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: originX,
              top: originY,
              background:
                'radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(59,130,246,0.18) 40%, rgba(139,92,246,0.12) 70%, transparent 100%)',
              x: '-50%',
              y: '-50%',
            }}
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: '300vmax', height: '300vmax', opacity: 0 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {
              if (!calledRef.current) {
                calledRef.current = true;
                onComplete();
              }
            }}
          />

          {/* Secondary trailing wave for depth */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: originX,
              top: originY,
              background:
                'radial-gradient(circle, rgba(129,140,248,0.35) 0%, rgba(99,102,241,0.20) 35%, transparent 70%)',
              x: '-50%',
              y: '-50%',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: '200vmax', height: '200vmax', opacity: 0 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          />

          {/* Inner bright flash at click point */}
          <motion.div
            className="absolute rounded-full bg-white"
            style={{
              left: originX,
              top: originY,
              x: '-50%',
              y: '-50%',
            }}
            initial={{ width: 8, height: 8, opacity: 0.9 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
