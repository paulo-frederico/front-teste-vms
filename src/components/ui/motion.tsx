import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import * as React from 'react'

import { cn } from '@/lib/utils'

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

export const slideInFromBottom: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

// Motion components
interface MotionDivProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
}

export const MotionDiv = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ className, ...props }, ref) => (
    <motion.div ref={ref} className={className} {...props} />
  ),
)
MotionDiv.displayName = 'MotionDiv'

// Fade In component
interface FadeInProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
}

export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, className, direction = 'up', delay = 0, duration = 0.3, ...props }, ref) => {
    const variants = {
      up: fadeInUp,
      down: fadeInDown,
      left: fadeInLeft,
      right: fadeInRight,
      none: fadeIn,
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants[direction]}
        transition={{ delay, duration }}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
FadeIn.displayName = 'FadeIn'

// Scale In component
interface ScaleInProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  delay?: number
}

export const ScaleIn = React.forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, className, delay = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  ),
)
ScaleIn.displayName = 'ScaleIn'

// Stagger List for animating lists
interface StaggerListProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
}

export const StaggerList = React.forwardRef<HTMLDivElement, StaggerListProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  ),
)
StaggerList.displayName = 'StaggerList'

// Stagger Item for use inside StaggerList
interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
}

export const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div ref={ref} className={className} variants={staggerItem} {...props}>
      {children}
    </motion.div>
  ),
)
StaggerItem.displayName = 'StaggerItem'

// Animated presence wrapper
export const AnimatedPresence = motion.div

// Hover scale effect
interface HoverScaleProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  scale?: number
}

export const HoverScale = React.forwardRef<HTMLDivElement, HoverScaleProps>(
  ({ children, className, scale = 1.02, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer', className)}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  ),
)
HoverScale.displayName = 'HoverScale'

// Tap bounce effect
interface TapBounceProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
}

export const TapBounce = React.forwardRef<HTMLDivElement, TapBounceProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  ),
)
TapBounce.displayName = 'TapBounce'

// Page transition wrapper
interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
}

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      {...props}
    >
      {children}
    </motion.div>
  ),
)
PageTransition.displayName = 'PageTransition'

// Counter animation
interface AnimatedCounterProps {
  value: number
  className?: string
  duration?: number
}

export function AnimatedCounter({ value, className, duration = 1 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const startTime = Date.now()
    const startValue = displayValue
    const endValue = value

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart)

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return <span className={className}>{displayValue.toLocaleString()}</span>
}

// Pulse animation for notifications/badges
interface PulseProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  isActive?: boolean
}

export const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ children, className, isActive = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      animate={isActive ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
      {...props}
    >
      {children}
    </motion.div>
  ),
)
Pulse.displayName = 'Pulse'

// Skeleton pulse animation
interface SkeletonPulseProps {
  className?: string
}

export const SkeletonPulse = React.forwardRef<HTMLDivElement, SkeletonPulseProps>(
  ({ className }, ref) => (
    <motion.div
      ref={ref}
      className={cn('rounded-md bg-muted', className)}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
    />
  ),
)
SkeletonPulse.displayName = 'SkeletonPulse'

// Floating animation for icons/decorative elements
interface FloatingProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  amplitude?: number
  duration?: number
}

export const Floating = React.forwardRef<HTMLDivElement, FloatingProps>(
  ({ children, className, amplitude = 5, duration = 3, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
      {...props}
    >
      {children}
    </motion.div>
  ),
)
Floating.displayName = 'Floating'
