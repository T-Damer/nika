import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "./contexts/user-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Onboarding from "@/pages/onboarding";
import Calendar from "@/pages/calendar";
import Log from "@/pages/log";
import Insights from "@/pages/insights";
import Profile from "@/pages/profile";
import { useEffect, useState } from "react";
import { loadUserData } from "./lib/storage";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "./contexts/user-context";

// Welcome Animation Component
function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show animation for 3 seconds
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
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
        <motion.p
          className="text-gray-500 dark:text-gray-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Track your cycle. Understand your body.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const { user } = useUser();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Check if first time and show welcome animation
  useEffect(() => {
    const savedUser = loadUserData();
    // Only show welcome if this is the first visit
    const isFirstVisit = !localStorage.getItem('notFirstVisit');
    
    if (isFirstVisit) {
      setShowWelcome(true);
      localStorage.setItem('notFirstVisit', 'true');
    }
  }, []);
  
  // Function to check if system prefers dark mode
  const systemPrefersDarkMode = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Apply theme effect
  useEffect(() => {
    const applyTheme = () => {
      if (user.preferences.theme === 'dark' || 
          (user.preferences.theme === 'system' && systemPrefersDarkMode())) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes if using system theme
    if (user.preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [user.preferences.theme]);

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
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
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
