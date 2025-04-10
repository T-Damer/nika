import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NameStepProps {
  initialValue: string
  onNext: (name: string) => void
  onBack: () => void
}

export function NameStep({ initialValue, onNext, onBack }: NameStepProps) {
  const { t } = useTranslation()
  const [name, setName] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(name)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h2 className="font-heading font-bold text-2xl mb-6">
        {t('nameStep.title')}
      </h2>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <Input
          type="text"
          placeholder={t('nameStep.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />

        <Button type="submit">{t('common.continue')}</Button>

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
