import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'

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
      <Header2>{t('nameStep.title')}</Header2>

      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-y-3">
        <Input
          type="text"
          placeholder={t('nameStep.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl"
          required
        />

        <Button type="submit" disabled={!name}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
