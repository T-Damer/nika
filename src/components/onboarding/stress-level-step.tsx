import { Button } from '@/components/ui/ffs'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface StressLevelStepProps {
  initialValue: number
  onNext: (stressLevel: number) => void
  onBack: () => void
}

export function StressLevelStep({
  initialValue,
  onNext,
  onBack,
}: StressLevelStepProps) {
  const { t } = useTranslation()
  const [stressLevel, setStressLevel] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(stressLevel)
  }

  const getStressLevelText = (level: number) => {
    if (level <= 1) return t('stressLevels.veryLow')
    if (level <= 2) return t('stressLevels.low')
    if (level <= 3) return t('stressLevels.moderate')
    if (level <= 4) return t('stressLevels.high')
    return t('stressLevels.veryHigh')
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">
        {t('stressLevelStep.title')}
      </h2>
      <p className="text-neutral-800 mb-6 text-center">
        {t('stressLevelStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
          <div className="text-center mb-4">
            <span className="text-2xl font-bold text-primary">
              {getStressLevelText(stressLevel)}
            </span>
          </div>

          <Slider
            min={1}
            max={5}
            step={1}
            value={[stressLevel]}
            onValueChange={(values) => setStressLevel(values[0])}
            className="w-full"
          />

          <div className="flex justify-between text-xs mt-2 text-neutral-600">
            <span>{t('stressLevels.veryLow')}</span>
            <span>{t('stressLevels.moderate')}</span>
            <span>{t('stressLevels.veryHigh')}</span>
          </div>
        </div>

        <Button type="submit" size="full" disabled={!stressLevel}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
