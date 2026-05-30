import { motion, useReducedMotion } from "framer-motion";

// Shared easing curve — smooth deceleration
const EASE = [0.22, 1, 0.36, 1];

/**
 * Reveal — fades a single element in when it enters the viewport.
 * Skips animation entirely when prefers-reduced-motion is active.
 */
export function Reveal({ children, className, delay = 0, y = 20 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.52, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer — wraps a list and staggers children on scroll entry.
 */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function StaggerContainer({ children, className, stagger = 0.08 }) {
  const reduce = useReducedMotion();
  const variants = reduce
    ? {}
    : { ...containerVariants, show: { transition: { staggerChildren: stagger } } };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-72px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — child of StaggerContainer, inherits stagger timing.
 */
export const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerItem({ children, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? {} : itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
