import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '@/components/Text'
import SelectorCard from '@/components/SelectorCard'

interface MoodStepProps {
  initialValues: string[]
  onNext: (moods: string[]) => void
  onBack: () => void
}

export function MoodStep({ initialValues, onNext, onBack }: MoodStepProps) {
  const { t } = useTranslation()
  const [selectedMoods, setSelectedMoods] = useState<string[]>(initialValues)

  const toggleMood = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood))
    } else {
      setSelectedMoods([...selectedMoods, mood])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(selectedMoods)
  }

  const commonMoods = [
    'happy',
    'calm',
    'anxious',
    'irritable',
    'sad',
    'emotional',
    'energetic',
    'tired',
    'motivated',
    'unmotivated',
  ]

  return (
    <div className="flex flex-col items-center justify-center">
      <Header2>{t('moodStep.title')}</Header2>
      <p className="mb-6 text-center">{t('moodStep.subtitle')}</p>

      <form onSubmit={handleSubmit} className="w-full">
        <SelectorCard>
          {commonMoods.map((mood) => (
            <div key={mood} className="flex items-center space-x-2">
              <Checkbox
                id={mood}
                checked={selectedMoods.includes(mood)}
                onCheckedChange={() => toggleMood(mood)}
              />
              <label
                htmlFor={mood}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t(`moods.${mood}`)}
              </label>
            </div>
          ))}
        </SelectorCard>

        <Button
          type="submit"
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition mt-4"
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
