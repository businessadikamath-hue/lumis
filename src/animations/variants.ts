// src/animations/variants.ts
import { Variants } from 'framer-motion'

/* Page slide-up entrance (every screen uses this) */
export const pageVariants: Variants = {
  initial:  { opacity: 0, y: 24, scale: 0.98 },
  animate:  { opacity: 1, y: 0,  scale: 1,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:     { opacity: 0, y: -12, scale: 0.98,
              transition: { duration: 0.25 } }
}

/* Staggered card entrance (for lists of cards) */
export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

export const cardEntrance: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0,  scale: 1,
             transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

/* Check-in slider haptic-like pulse */
export const hapticPulse = {
  scale: [1, 1.04, 1],
  transition: { duration: 0.15, ease: 'easeInOut' }
}

/* Bottom sheet slide-up */
export const bottomSheet: Variants = {
  closed: { y: '100%', opacity: 0 },
  open:   { y: '0%',   opacity: 1,
            transition: { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } }
}