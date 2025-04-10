import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

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
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">
        {t('contraceptionStep.title')}
      </h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">
        {t('contraceptionStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
          <RadioGroup value={contraception} onValueChange={setContraception}>
            {contraceptionMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={method} id={method} />
                <Label htmlFor={method}>{t(`contraception.${method}`)}</Label>
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
