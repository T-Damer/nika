import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'

interface ContraceptionStepProps {
  initialValue: string
  onNext: (contraception: string) => void
  onBack: () => void
}

export function ContraceptionStep({
  initialValue,
  onNext,
  onBack,
}: ContraceptionStepProps) {
  const { t } = useTranslation()
  const [contraception, setContraception] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(contraception)
  }

  const contraceptionMethods = [
    'none',
    'pill',
    'iud',
    'condom',
    'implant',
    'injection',
    'patch',
    'ring',
    'withdrawal',
    'rhythm',
  ]

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Header2>{t('contraceptionStep.title')}</Header2>
      <p className="text-neutral-800 mb-6">{t('contraceptionStep.subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 max-h-60 overflow-y-auto">
          <RadioGroup value={contraception} onValueChange={setContraception}>
            {contraceptionMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={method} id={method} />
                <Label htmlFor={method}>{t(`contraception.${method}`)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button type="submit" size="full" disabled={!contraception}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
