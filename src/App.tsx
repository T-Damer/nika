import { Toaster } from '@/components/ui/toaster'
import useScrollTop from '@/hooks/useScrollTopOnNavigate'
import Calendar from '@/pages/calendar'
import Home from '@/pages/home'
import Insights from '@/pages/insights'
import Log from '@/pages/log'
import NotFound from '@/pages/not-found'
import Onboarding from '@/pages/onboarding'
import Profile from '@/pages/profile'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserProvider } from './contexts/user-context'
import Modals from './components/Modals'

function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-white dark:bg-gray-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <motion.h1
          className="font-heading text-5xl font-bold gradient-text mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          mene
        </motion.h1>
      </motion.div>
    </motion.div>
  )
}

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(false)

  useScrollTop()

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('notFirstVisit')

    if (isFirstVisit) {
      setShowWelcome(true)
      localStorage.setItem('notFirstVisit', 'true')
    }
  }, [])

  return (
    <div className="container prose mx-auto max-w-prose flex flex-col min-h-[100dvh] px-5 dark:text-white">
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/log" element={<Log />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
      <Modals />
    </div>
  )
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}
