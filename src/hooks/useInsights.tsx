import { getCurrentPhase } from '@/lib/cycleCalculations'
import { HealthTip, User } from '@/types'
import { t } from 'i18next'
import { Droplets, Activity, Heart, Brain } from 'lucide-react'

export default function useInsights({ user }: { user: User }) {
  const currentPhase = getCurrentPhase(user)

  const phases = [
    {
      name: 'menstrual',
      startDay: 1,
      endDay: user.periodLength,
      icon: <Droplets className="h-6 w-6" />,
      className: 'bg-primary text-primary',
    },
    {
      name: 'follicular',
      startDay: user.periodLength + 1,
      endDay: user.cycleLength - 15,
      icon: <Activity className="h-6 w-6" />,
      className: 'bg-accent text-accent',
    },
    {
      name: 'ovulatory',
      startDay: user.cycleLength - 14,
      endDay: user.cycleLength - 12,
      icon: <Heart className="h-6 w-6" />,
      className: 'bg-success text-success',
    },
    {
      name: 'luteal',
      startDay: user.cycleLength - 11,
      endDay: user.cycleLength,
      icon: <Brain className="h-6 w-6" />,
      className: 'bg-amber-500 text-amber-500',
    },
  ]

  const healthTips: HealthTip[] = [
    {
      id: 'menstrual-1',
      title: t('healthTips.menstrual.title'),
      content: t('healthTips.menstrual.content'),
      icon: 'water',
      forPhase: 'menstrual',
      highlighted: currentPhase.name === 'menstrual',
    },
    {
      id: 'menstrual-2',
      title: t('healthTips.menstrual.nutrition'),
      content: t('healthTips.menstrual.nutritionTip'),
      icon: 'food',
      forPhase: 'menstrual',
      highlighted: false,
    },
    {
      id: 'follicular-1',
      title: t('healthTips.follicular.title'),
      content: t('healthTips.follicular.content'),
      icon: 'energy',
      forPhase: 'follicular',
      highlighted: currentPhase.name === 'follicular',
    },
    {
      id: 'follicular-2',
      title: t('healthTips.follicular.exercise'),
      content: t('healthTips.follicular.exerciseTip'),
      icon: 'energy',
      forPhase: 'follicular',
      highlighted: false,
    },
    {
      id: 'ovulatory-1',
      title: t('healthTips.ovulatory.title'),
      content: t('healthTips.ovulatory.content'),
      icon: 'heart',
      forPhase: 'ovulatory',
      highlighted: currentPhase.name === 'ovulatory',
    },
    {
      id: 'ovulatory-2',
      title: t('healthTips.ovulatory.social'),
      content: t('healthTips.ovulatory.socialTip'),
      icon: 'heart',
      forPhase: 'ovulatory',
      highlighted: false,
    },
    {
      id: 'luteal-1',
      title: t('healthTips.luteal.title'),
      content: t('healthTips.luteal.content'),
      icon: 'food',
      forPhase: 'luteal',
      highlighted: currentPhase.name === 'luteal',
    },
    {
      id: 'luteal-2',
      title: t('healthTips.luteal.selfCare'),
      content: t('healthTips.luteal.selfCareTip'),
      icon: 'heart',
      forPhase: 'luteal',
      highlighted: false,
    },
    {
      id: 'general-1',
      title: t('healthTips.general.sleep'),
      content: t('healthTips.general.sleepTip'),
      icon: 'sleep',
      forPhase: 'all',
      highlighted: false,
    },
    {
      id: 'general-2',
      title: t('healthTips.general.hydration'),
      content: t('healthTips.general.hydrationTip'),
      icon: 'water',
      forPhase: 'all',
      highlighted: false,
    },
  ]

  return { phases, healthTips }
}
