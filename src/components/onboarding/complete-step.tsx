import { Button } from '@/components/ui/ffs'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'

interface CompleteStepProps {
  onComplete: () => void
}

export function CompleteStep({ onComplete }: CompleteStepProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-8 bg-primary-light p-4 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <Header2>{t('completeStep.title')}</Header2>
      <p className="text-neutral-800 mb-8">{t('completeStep.subtitle')}</p>

      <Button size="full" onClick={onComplete}>
        {t('completeStep.goToDashboard')}
      </Button>
    </div>
  )
}
