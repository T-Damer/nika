import { Header1 } from '@/components/Text'
import { Button } from '@/components/ui/Button'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center text-center gap-y-4">
      <CalendarIcon size={64} />
      <div className="flex flex-col items-center gap-y-1">
        <Header1>{t('welcome.title')}</Header1>
        <p>{t('welcome.subtitle')}</p>
      </div>

      <Button size="full" onClick={onNext}>
        {t('welcome.getStarted')}
      </Button>
    </div>
  )
}
