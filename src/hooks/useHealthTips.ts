import { getCurrentPhase } from '@/lib/cycleCalculations'
import { HealthTip, User } from '@/types'
import { t } from 'i18next'
import { useEffect, useState } from 'react'

export default function useHealthTips(user: User) {
  const [healthTips, setHealthTips] = useState<HealthTip[]>([])

  useEffect(() => {
    if (!user.lastPeriodStart) return

    const currentPhase = getCurrentPhase(user)

    const tips: HealthTip[] = [
      {
        id: '1',
        title: t(`healthTips.${currentPhase.name}.title`),
        content: t(`healthTips.${currentPhase.name}.content`),
        icon:
          currentPhase.name === 'menstrual'
            ? 'water'
            : currentPhase.name === 'follicular'
              ? 'energy'
              : currentPhase.name === 'ovulatory'
                ? 'heart'
                : 'food',
        forPhase: currentPhase.name,
        highlighted: true,
      },
      {
        id: '2',
        title: t('healthTips.selfCare.title'),
        content: t('healthTips.selfCare.content'),
        icon: 'heart',
        forPhase: 'all',
        highlighted: false,
      },
    ]

    setHealthTips(tips)
  }, [user, t])

  return { healthTips }
}
