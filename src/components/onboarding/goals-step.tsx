import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '@/components/Text'
import SelectorCard from '@/components/SelectorCard'

interface GoalsStepProps {
  initialValues: string[]
  onNext: (goals: string[]) => void
  onBack: () => void
}

const commonGoals = [
  'trackPeriod',
  'predictFertility',
  'becomePregnant',
  'monitorHealth',
  'trackSymptoms',
  'managePMS',
  'improveWellbeing',
]

export function GoalsStep({ initialValues, onNext, onBack }: GoalsStepProps) {
  const { t } = useTranslation()
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialValues)

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal))
    } else {
      setSelectedGoals([...selectedGoals, goal])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(selectedGoals)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Header2>{t('goalsStep.title')}</Header2>
      <p className="mb-6 text-center">{t('goalsStep.subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <SelectorCard>
          <div className="grid grid-cols-1 gap-3">
            {commonGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={() => toggleGoal(goal)}
                />
                <label
                  htmlFor={goal}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`goals.${goal}`)}
                </label>
              </div>
            ))}
          </div>
        </SelectorCard>

        <Button type="submit" size="full" disabled={!selectedGoals.length}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
