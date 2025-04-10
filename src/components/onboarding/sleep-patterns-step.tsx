import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

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
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">
        {t('sleepPatternsStep.title')}
      </h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">
        {t('sleepPatternsStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
          <RadioGroup value={sleepPattern} onValueChange={setSleepPattern}>
            {sleepPatterns.map((pattern) => (
              <div key={pattern} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={pattern} id={pattern} />
                <Label htmlFor={pattern}>{t(`sleepPatterns.${pattern}`)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition"
        >
          {t('common.continue')}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full mt-3 text-neutral-800 font-medium py-2 px-6 rounded-full hover:bg-neutral-100 transition"
          onClick={onBack}
        >
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
