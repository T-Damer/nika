import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'

interface SleepPatternsStepProps {
  initialValue: string
  onNext: (sleepPattern: string) => void
  onBack: () => void
}

export function SleepPatternsStep({
  initialValue,
  onNext,
  onBack,
}: SleepPatternsStepProps) {
  const { t } = useTranslation()
  const [sleepPattern, setSleepPattern] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(sleepPattern)
  }

  const sleepPatterns = [
    'lessThan6',
    'between6And7',
    'between7And8',
    'between8And9',
    'moreThan9',
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Header2>{t('sleepPatternsStep.title')}</Header2>
      <p className="text-neutral-800 mb-6 text-center">
        {t('sleepPatternsStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
          <RadioGroup value={sleepPattern} onValueChange={setSleepPattern}>
            {sleepPatterns.map((pattern) => (
              <div key={pattern} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={pattern} id={pattern} />
                <Label htmlFor={pattern}>{t(`sleepPatterns.${pattern}`)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button type="submit" size="full" disabled={!sleepPattern}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
