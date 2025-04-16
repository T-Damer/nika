import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '@/components/Text'
import SelectorCard from '@/components/SelectorCard'

interface MedicalConditionsStepProps {
  initialValues: string[]
  onNext: (conditions: string[]) => void
  onBack: () => void
}

const commonConditions = [
  'none',
  'pcos',
  'endometriosis',
  'fibroids',
  'thyroidDisorders',
  'diabetes',
  'hypertension',
  'depression',
  'anxiety',
]

export function MedicalConditionsStep({
  initialValues,
  onNext,
  onBack,
}: MedicalConditionsStepProps) {
  const { t } = useTranslation()
  const [selectedConditions, setSelectedConditions] =
    useState<string[]>(initialValues)
  const [customCondition, setCustomCondition] = useState('')

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition))
    } else {
      setSelectedConditions([...selectedConditions, condition])
    }
  }

  const addCustomCondition = () => {
    if (
      customCondition.trim() &&
      !selectedConditions.includes(customCondition.trim())
    ) {
      setSelectedConditions([...selectedConditions, customCondition.trim()])
      setCustomCondition('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(selectedConditions)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Header2>{t('medicalConditionsStep.title')}</Header2>
      <p className="mb-6">{t('medicalConditionsStep.subtitle')}</p>

      <form onSubmit={handleSubmit} className="w-full">
        <SelectorCard>
          <div className="grid grid-cols-1 gap-3">
            {commonConditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                />
                <label
                  htmlFor={condition}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`medicalConditions.${condition}`)}
                </label>
              </div>
            ))}

            {/* Custom conditions that were added */}
            {selectedConditions
              .filter((condition) => !commonConditions.includes(condition))
              .map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={true}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <label
                    htmlFor={condition}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {condition}
                  </label>
                </div>
              ))}

            {/* Add custom condition */}
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="text"
                placeholder={t('medicalConditionsStep.customPlaceholder')}
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                className="text-sm"
              />
              <Button type="button" size="sm" onClick={addCustomCondition}>
                {t('common.add')}
              </Button>
            </div>
          </div>
        </SelectorCard>

        <div className="flex flex-col gap-y-2 mt-4">
          <Button
            type="submit"
            size="full"
            disabled={!selectedConditions.length && !customCondition}
          >
            {t('common.continue')}
          </Button>

          <Button type="button" variant="ghost" size="full" onClick={onBack}>
            {t('common.back')}
          </Button>
        </div>
      </form>
    </div>
  )
}
