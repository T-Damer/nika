import { Button } from '@/components/ui/Button'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header2 } from '../Text'
import RoundButton from '../RoundButton'
import { cycleConstants } from '@/lib/cycleCalculations'
import { useAtomValue } from 'jotai'
import userAtom from '@/lib/atoms/userAtom'

interface CycleLengthStepProps {
  initialValue: number
  onNext: (length: number) => void
  onBack: () => void
}

export function CycleLengthStep({
  initialValue,
  onNext,
  onBack,
}: CycleLengthStepProps) {
  const { t } = useTranslation()
  const [cycleLength, setCycleLength] = useState(initialValue)
  const user = useAtomValue(userAtom)
  const isTeen = user.age <= 17
  const cycle = isTeen ? cycleConstants.teen : cycleConstants

  const incrementCycleLength = () => {
    if (cycleLength < cycle.lengthMax) {
      setCycleLength(cycleLength + 1)
    }
  }

  const decrementCycleLength = () => {
    if (cycleLength > cycle.lengthMin) {
      setCycleLength(cycleLength - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(cycleLength)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <Header2>{t('cycleLengthStep.title')}</Header2>
      <p className="mb-6">{t('cycleLengthStep.subtitle')}</p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <RoundButton onClick={decrementCycleLength}>
            <Minus className="w-4 h-4" />
          </RoundButton>

          <div className="text-center">
            <span className="text-4xl font-bold text-primary">
              {cycleLength}
            </span>
          </div>

          <RoundButton onClick={incrementCycleLength}>
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
