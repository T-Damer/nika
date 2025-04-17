import { Button } from '@/components/ui/Button'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'
import RoundButton from '../RoundButton'
import { useAtomValue } from 'jotai'
import userAtom from '@/lib/atoms/userAtom'
import { cycleConstants } from '@/lib/cycleCalculations'

interface PeriodLengthStepProps {
  initialValue: number
  onNext: (length: number) => void
  onBack: () => void
}

export function PeriodLengthStep({
  initialValue,
  onNext,
  onBack,
}: PeriodLengthStepProps) {
  const { t } = useTranslation()
  const [periodLength, setPeriodLength] = useState(initialValue)
  const user = useAtomValue(userAtom)
  const isTeen = user.age <= cycleConstants.teen.age
  const cycle = isTeen ? cycleConstants.teen : cycleConstants

  const incrementPeriodLength = () => {
    if (periodLength < cycle.durationMax) {
      setPeriodLength(periodLength + 1)
    }
  }

  const decrementPeriodLength = () => {
    if (periodLength > cycle.durationMin) {
      setPeriodLength(periodLength - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(periodLength)
  }

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center text-center">
      <Header2>{t('periodLengthStep.title')}</Header2>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <RoundButton onClick={decrementPeriodLength}>
            <Minus className="w-4 h-4" />
          </RoundButton>

          <span className="text-4xl font-bold text-primary">
            {periodLength}
          </span>

          <RoundButton onClick={incrementPeriodLength}>
            <Plus className="w-4 h-4" />
          </RoundButton>
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
