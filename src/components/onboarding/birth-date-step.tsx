import { Button } from '@/components/ui/ffs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BirthDateStepProps {
  initialDay: string
  initialMonth: string
  initialYear: string
  onNext: (day: string, month: string, year: string) => void
  onBack: () => void
}

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) =>
  (currentYear - 10 - i).toString()
)
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString())

export function BirthDateStep({
  initialDay,
  initialMonth,
  initialYear,
  onNext,
  onBack,
}: BirthDateStepProps) {
  const { t } = useTranslation()
  const [day, setDay] = useState(initialDay)
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(day, month, year)
  }

  const isFormValid = day && month && year

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="font-heading font-bold text-2xl mb-6">
        {t('birthDateStep.title')}
      </h2>
      <p className="text-neutral-800 mb-6 max-w-xs">
        {t('birthDateStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-3">
        <div className="flex gap-2 mb-6">
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl">
              <SelectValue placeholder={t('birthDateStep.day')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {days.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl">
              <SelectValue placeholder={t('birthDateStep.month')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {t(`months.${parseInt(m) - 1}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl">
              <SelectValue placeholder={t('birthDateStep.year')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="full" disabled={!isFormValid}>
          {t('common.continue')}
        </Button>

        <Button type="button" variant="ghost" size="full" onClick={onBack}>
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
