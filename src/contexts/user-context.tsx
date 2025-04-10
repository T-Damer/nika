import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../types'
import { loadUserData, saveUserData, defaultUser } from '../lib/storage'
import { useTranslation } from 'react-i18next'

interface UserContextType {
  user: User
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)
  const [isLoading, setIsLoading] = useState(true)
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  // Load user data from localStorage on mount
  useEffect(() => {
    const userData = loadUserData()
    setUser(userData)

    // Set language from user preferences
    if (userData.preferences.language) {
      i18n.changeLanguage(userData.preferences.language)
    }

    // Redirect to onboarding if not completed
    if (
      !userData.onboardingCompleted &&
      window.location.pathname !== '/onboarding'
    ) {
      navigate('/onboarding')
    }

    setIsLoading(false)
  }, [navigate, i18n])

  const updateUser = (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    saveUserData(updatedUser)
  }

  return (
    <UserContext.Provider value={{ user, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
