import { Button } from '@/components/ui/ffs'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'

interface ActivityLevelStepProps {
  initialValue: string
  onNext: (activityLevel: string) => void
  onBack: () => void
}

export function ActivityLevelStep({
  initialValue,
  onNext,
  onBack,
}: ActivityLevelStepProps) {
  const { t } = useTranslation()
  const [activityLevel, setActivityLevel] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(activityLevel)
  }

  const activityLevels = [
    'sedentary',
    'lightlyActive',
    'moderatelyActive',
    'veryActive',
    'extremelyActive',
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Header2>{t('activityLevelStep.title')}</Header2>
      <p className="text-neutral-800 mb-6 text-center">
        {t('activityLevelStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
          <RadioGroup value={activityLevel} onValueChange={setActivityLevel}>
            {activityLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={level} id={level} />
                <Label htmlFor={level}>
                  <div>
                    <div className="font-medium">
                      {t(`activityLevels.${level}.title`)}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {t(`activityLevels.${level}.description`)}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button type="submit" size="full" disabled={!activityLevel}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
