import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'

interface DietStepProps {
  initialValues: string[]
  onNext: (diet: string[]) => void
  onBack: () => void
}

const dietTypes = [
  'omnivore',
  'vegetarian',
  'vegan',
  'pescatarian',
  'paleo',
  'keto',
  'lowCarb',
  'glutenFree',
  'dairyFree',
  'intermittentFasting',
]

export function DietStep({ initialValues, onNext, onBack }: DietStepProps) {
  const { t } = useTranslation()
  const [selectedDiets, setSelectedDiets] = useState<string[]>(initialValues)

  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter((d) => d !== diet))
    } else {
      setSelectedDiets([...selectedDiets, diet])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(selectedDiets)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Header2>{t('dietStep.title')}</Header2>
      <p className="text-neutral-800 mb-6 text-center">
        {t('dietStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {dietTypes.map((diet) => (
              <div key={diet} className="flex items-center space-x-2">
                <Checkbox
                  id={diet}
                  checked={selectedDiets.includes(diet)}
                  onCheckedChange={() => toggleDiet(diet)}
                />
                <label
                  htmlFor={diet}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`dietTypes.${diet}`)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" size="full" disabled={!selectedDiets.length}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
