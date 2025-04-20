import { User } from '../types'

const userDataKey = 'user-data'
const CYCLE_DATA_KEY = 'cycle-data'

export const defaultUser: User = {
  name: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  age: 0,
  lastPeriodStart: '',
  cycleLength: 28,
  periodLength: 5,
  symptoms: [],
  mood: [],
  contraception: '',
  goals: [],
  activityLevel: '',
  sleepPatterns: '',
  diet: [],
  stressLevel: 3,
  medicalConditions: [],
  medications: [],
  preferences: {
    language: 'en',
    notifications: true,
    theme: 'system',
  },
  onboardingCompleted: false,
}

export const saveUserData = (userData: User): void => {
  try {
    localStorage.setItem(userDataKey, JSON.stringify(userData))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

export const loadUserData = (): User => {
  try {
    const savedData = localStorage.getItem(userDataKey)
    if (savedData) {
      return { ...defaultUser, ...JSON.parse(savedData) }
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
  return defaultUser
}

export const saveCycleData = (cycleData: any): void => {
  try {
    localStorage.setItem(CYCLE_DATA_KEY, JSON.stringify(cycleData))
  } catch (error) {
    console.error('Error saving cycle data:', error)
  }
}

export const loadCycleData = (): any => {
  try {
    const savedData = localStorage.getItem(CYCLE_DATA_KEY)
    if (savedData) {
      return JSON.parse(savedData)
    }
  } catch (error) {
    console.error('Error loading cycle data:', error)
  }
  return null
}

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(userDataKey)
    localStorage.removeItem(CYCLE_DATA_KEY)
  } catch (error) {
    console.error('Error clearing data:', error)
  }
}

export const updateUserLanguage = (language: 'en' | 'ru'): void => {
  try {
    const userData = loadUserData()
    userData.preferences.language = language
    saveUserData(userData)
  } catch (error) {
    console.error('Error updating user language:', error)
  }
}
