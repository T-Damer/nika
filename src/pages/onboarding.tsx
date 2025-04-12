import { ActivityLevelStep } from '@/components/onboarding/activity-level-step'
import { BirthDateStep } from '@/components/onboarding/birth-date-step'
import { CompleteStep } from '@/components/onboarding/complete-step'
import { ContraceptionStep } from '@/components/onboarding/contraception-step'
import { CycleLengthStep } from '@/components/onboarding/cycle-length-step'
import { DietStep } from '@/components/onboarding/diet-step'
import { GoalsStep } from '@/components/onboarding/goals-step'
import { LastPeriodStep } from '@/components/onboarding/last-period-step'
import { MedicalConditionsStep } from '@/components/onboarding/medical-conditions-step'
import { MedicationsStep } from '@/components/onboarding/medications-step'
import { MoodStep } from '@/components/onboarding/mood-step'
import { NameStep } from '@/components/onboarding/NameStep'
import { PeriodLengthStep } from '@/components/onboarding/period-length-step'
import { ProgressDots } from '@/components/onboarding/progress-dots'
import { SleepPatternsStep } from '@/components/onboarding/sleep-patterns-step'
import { StressLevelStep } from '@/components/onboarding/stress-level-step'
import { SymptomsStep } from '@/components/onboarding/symptoms-step'
import { WelcomeStep } from '@/components/onboarding/welcome-step'
import { Button } from '@/components/ui/ffs'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useUser } from '@/contexts/user-context'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const { user, updateUser } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const totalSteps = 17

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleComplete = () => {
    // Apply transition animation
    updateUser({ onboardingCompleted: true })

    // Navigate to home immediately
    navigate('/', { replace: true })
  }

  // Define step handlers to update user data
  const updateName = (name: string) => {
    updateUser({ name })
    handleNext()
  }

  const updateBirthDate = (day: string, month: string, year: string) => {
    updateUser({ birthDay: day, birthMonth: month, birthYear: year })
    handleNext()
  }

  const updateLastPeriod = (date: string) => {
    updateUser({ lastPeriodStart: date })
    handleNext()
  }

  const updateCycleLength = (length: number) => {
    updateUser({ cycleLength: length })
    handleNext()
  }

  const updatePeriodLength = (length: number) => {
    updateUser({ periodLength: length })
    handleNext()
  }

  const updateSymptoms = (symptoms: string[]) => {
    updateUser({ symptoms })
    handleNext()
  }

  const updateMood = (mood: string[]) => {
    updateUser({ mood })
    handleNext()
  }

  const updateContraception = (contraception: string) => {
    updateUser({ contraception })
    handleNext()
  }

  const updateGoals = (goals: string[]) => {
    updateUser({ goals })
    handleNext()
  }

  const updateActivityLevel = (activityLevel: string) => {
    updateUser({ activityLevel })
    handleNext()
  }

  const updateSleepPatterns = (sleepPatterns: string) => {
    updateUser({ sleepPatterns })
    handleNext()
  }

  const updateDiet = (diet: string[]) => {
    updateUser({ diet })
    handleNext()
  }

  const updateStressLevel = (stressLevel: number) => {
    updateUser({ stressLevel })
    handleNext()
  }

  const updateMedicalConditions = (medicalConditions: string[]) => {
    updateUser({ medicalConditions })
    handleNext()
  }

  const updateMedications = (medications: string[]) => {
    updateUser({ medications })
    handleNext()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />
      case 1:
        return (
          <NameStep
            initialValue={user.name}
            onNext={updateName}
            onBack={handleBack}
          />
        )
      case 2:
        return (
          <BirthDateStep
            initialDay={user.birthDay}
            initialMonth={user.birthMonth}
            initialYear={user.birthYear}
            onNext={updateBirthDate}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <LastPeriodStep
            initialValue={user.lastPeriodStart}
            onNext={updateLastPeriod}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <CycleLengthStep
            initialValue={user.cycleLength}
            onNext={updateCycleLength}
            onBack={handleBack}
          />
        )
      case 5:
        return (
          <PeriodLengthStep
            initialValue={user.periodLength}
            onNext={updatePeriodLength}
            onBack={handleBack}
          />
        )
      case 6:
        return (
          <SymptomsStep
            initialValues={user.symptoms}
            onNext={updateSymptoms}
            onBack={handleBack}
          />
        )
      case 7:
        return (
          <MoodStep
            initialValues={user.mood}
            onNext={updateMood}
            onBack={handleBack}
          />
        )
      case 8:
        return (
          <ContraceptionStep
            initialValue={user.contraception}
            onNext={updateContraception}
            onBack={handleBack}
          />
        )
      case 9:
        return (
          <GoalsStep
            initialValues={user.goals}
            onNext={updateGoals}
            onBack={handleBack}
          />
        )
      case 10:
        return (
          <ActivityLevelStep
            initialValue={user.activityLevel}
            onNext={updateActivityLevel}
            onBack={handleBack}
          />
        )
      case 11:
        return (
          <SleepPatternsStep
            initialValue={user.sleepPatterns}
            onNext={updateSleepPatterns}
            onBack={handleBack}
          />
        )
      case 12:
        return (
          <DietStep
            initialValues={user.diet}
            onNext={updateDiet}
            onBack={handleBack}
          />
        )
      case 13:
        return (
          <StressLevelStep
            initialValue={user.stressLevel}
            onNext={updateStressLevel}
            onBack={handleBack}
          />
        )
      case 14:
        return (
          <MedicalConditionsStep
            initialValues={user.medicalConditions}
            onNext={updateMedicalConditions}
            onBack={handleBack}
          />
        )
      case 15:
        return (
          <MedicationsStep
            initialValues={user.medications}
            onNext={updateMedications}
            onBack={handleBack}
          />
        )
      case 16:
        return <CompleteStep onComplete={handleComplete} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Top navigation dots */}
      <div className="p-5 pt-6">
        <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Main content area with overflow control */}
      <div className="flex-1 flex flex-col px-5 overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 py-3 px-5 bg-white dark:bg-gray-900 border-t border-neutral-200 dark:border-gray-800 flex justify-between items-center">
        <LanguageToggle />
      </div>
    </div>
  )
}
