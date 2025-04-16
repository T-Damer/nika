import { ChildrenProp } from '@/types/Props'
import { motion } from 'framer-motion'

export default function AnimatedEntryHeader({ children }: ChildrenProp) {
  return (
    <motion.h1
      className="font-heading font-bold text-2xl mb-4 mt-4 dark:text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.h1>
  )
}
