import { Button } from '@/components/ui/ffs'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'

interface SymptomsStepProps {
  initialValues: string[]
  onNext: (symptoms: string[]) => void
  onBack: () => void
}

export function SymptomsStep({
  initialValues,
  onNext,
  onBack,
}: SymptomsStepProps) {
  const { t } = useTranslation()
  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>(initialValues)

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(selectedSymptoms)
  }

  const commonSymptoms = [
    'cramps',
    'headache',
    'bloating',
    'backPain',
    'breastTenderness',
    'acne',
    'fatigue',
    'cravings',
    'nausea',
    'spotting',
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Header2>{t('symptomsStep.title')}</Header2>
      <p className="text-neutral-800 mb-6 text-center">
        {t('symptomsStep.subtitle')}
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full items-center flex flex-col gap-y-4"
      >
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 max-h-60 overflow-y-auto w-80">
          <div className="grid grid-cols-1 gap-3">
            {commonSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom}
                  checked={selectedSymptoms.includes(symptom)}
                  onCheckedChange={() => toggleSymptom(symptom)}
                />
                <label
                  htmlFor={symptom}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`symptoms.${symptom}`)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" size="full">
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
