import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '@/components/Text'
import SelectorCard from '@/components/SelectorCard'

interface MedicationsStepProps {
  initialValues: string[]
  onNext: (medications: string[]) => void
  onBack: () => void
}

const commonMedications = [
  'none',
  'birthControlPill',
  'antidepressants',
  'painMedication',
  'antiAnxiety',
  'thyroidMedication',
  'antiInflammatory',
  'hormoneReplacement',
]

export function MedicationsStep({
  initialValues,
  onNext,
  onBack,
}: MedicationsStepProps) {
  const { t } = useTranslation()
  const [selectedMedications, setSelectedMedications] =
    useState<string[]>(initialValues)
  const [customMedication, setCustomMedication] = useState('')

  const toggleMedication = (medication: string) => {
    if (selectedMedications.includes(medication)) {
      setSelectedMedications(
        selectedMedications.filter((m) => m !== medication)
      )
    } else {
      setSelectedMedications([...selectedMedications, medication])
    }
  }

  const addCustomMedication = () => {
    if (
      customMedication.trim() &&
      !selectedMedications.includes(customMedication.trim())
    ) {
      setSelectedMedications([...selectedMedications, customMedication.trim()])
      setCustomMedication('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(selectedMedications)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <Header2>{t('medicationsStep.title')}</Header2>
      <p className="mb-6">{t('medicationsStep.subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <SelectorCard>
          <div className="grid grid-cols-1 gap-3">
            {commonMedications.map((medication) => (
              <div key={medication} className="flex items-center space-x-2">
                <Checkbox
                  id={medication}
                  checked={selectedMedications.includes(medication)}
                  onCheckedChange={() => toggleMedication(medication)}
                />
                <label
                  htmlFor={medication}
                  className="text-sm font-medium text-left leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`medications.${medication}`)}
                </label>
              </div>
            ))}

            {/* Custom medications that were added */}
            {selectedMedications
              .filter((medication) => !commonMedications.includes(medication))
              .map((medication) => (
                <div key={medication} className="flex items-center space-x-2">
                  <Checkbox
                    id={medication}
                    checked={true}
                    onCheckedChange={() => toggleMedication(medication)}
                  />
                  <label
                    htmlFor={medication}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {medication}
                  </label>
                </div>
              ))}

            {/* Add custom medication */}
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="text"
                placeholder={t('medicationsStep.customPlaceholder')}
                value={customMedication}
                onChange={(e) => setCustomMedication(e.target.value)}
                className="text-sm"
              />
              <Button type="button" size="sm" onClick={addCustomMedication}>
                {t('common.add')}
              </Button>
            </div>
          </div>
        </SelectorCard>

        <Button
          type="submit"
          size="full"
          disabled={!selectedMedications.length && !customMedication}
        >
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
