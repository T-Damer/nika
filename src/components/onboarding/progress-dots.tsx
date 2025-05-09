import { useTranslation } from 'react-i18next'

interface ProgressDotsProps {
  currentStep: number
  totalSteps: number
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  const { t } = useTranslation()

  return (
    <div
      className="flex justify-center my-6"
      aria-label={t('onboarding.progressIndicator')}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full mx-1 ${
            i === currentStep ? 'bg-primary' : 'bg-neutral-200'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
