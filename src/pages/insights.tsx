import { useTranslation } from 'react-i18next'
import { useUser } from '../contexts/user-context'
import { Navbar } from '../components/navbar'
import { HealthTipCard } from '../components/health-tip-card'
import { HealthTip } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import {
  BarChart as BarChartIcon,
  Calendar,
  Droplets,
  Brain,
  Heart,
  Activity,
} from 'lucide-react'
import { getCurrentCycleDay, getCurrentPhase } from '@/lib/cycleCalculations'

export default function Insights() {
  const { t } = useTranslation()
  const { user } = useUser()

  // Current phase and cycle day based on user data
  const currentPhase = getCurrentPhase(user)
  const currentCycleDay = getCurrentCycleDay(user)

  const phases = [
    {
      name: 'menstrual',
      startDay: 1,
      endDay: user.periodLength,
      icon: <Droplets className="h-6 w-6" />,
      className: 'bg-primary/20 text-primary',
    },
    {
      name: 'follicular',
      startDay: user.periodLength + 1,
      endDay: user.cycleLength - 15,
      icon: <Activity className="h-6 w-6" />,
      className: 'bg-accent/20 text-accent',
    },
    {
      name: 'ovulatory',
      startDay: user.cycleLength - 14,
      endDay: user.cycleLength - 12,
      icon: <Heart className="h-6 w-6" />,
      className: 'bg-success/20 text-success',
    },
    {
      name: 'luteal',
      startDay: user.cycleLength - 11,
      endDay: user.cycleLength,
      icon: <Brain className="h-6 w-6" />,
      className: 'bg-amber-500/20 text-amber-500',
    },
  ]

  // Health tips based on cycle phases
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

  // Filter tips by phase
  const filterTipsByPhase = (phase: string) => {
    return healthTips.filter(
      (tip) => tip.forPhase === phase || tip.forPhase === 'all'
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header (simplified, no longer an app bar) */}
      <div className="pt-6 px-4">
        <motion.h1
          className="font-heading font-bold text-2xl mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {t('insights.title')}
        </motion.h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-0">
        {/* Cycle Phases Visualization */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>{t('insights.phaseOverview')}</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            {/* Phase timeline visualization */}
            <div className="mb-5">
              <div className="relative h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                {phases.map((phase, index) => {
                  // Calculate phase width based on day range
                  const phaseDuration = phase.endDay - phase.startDay + 1
                  const phaseWidth = (phaseDuration / user.cycleLength) * 100
                  const phaseStart =
                    ((phase.startDay - 1) / user.cycleLength) * 100

                  return (
                    <div
                      key={phase.name}
                      className={`absolute top-0 bottom-0 ${phase.className} ${
                        currentPhase.name === phase.name
                          ? 'opacity-100'
                          : 'opacity-50'
                      }`}
                      style={{
                        left: `${phaseStart}%`,
                        width: `${phaseWidth}%`,
                      }}
                    />
                  )
                })}

                {/* Current day indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white dark:bg-black shadow-md"
                  style={{
                    left: `${
                      ((currentCycleDay - 1) / user.cycleLength) * 100
                    }%`,
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                  }}
                />
              </div>

              {/* Phase labels */}
              <div className="flex justify-between text-xs mt-1">
                {phases.map((phase) => (
                  <div
                    key={phase.name}
                    className={`text-center ${
                      currentPhase.name === phase.name ? 'font-bold' : ''
                    }`}
                  >
                    {t(`phases.${phase.name}Short`)}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Phase Info */}
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full ${
                  phases.find((p) => p.name === currentPhase.name)?.className
                } mr-3`}
              >
                {phases.find((p) => p.name === currentPhase.name)?.icon}
              </div>
              <div>
                <h3 className="font-medium">
                  {t(`phases.${currentPhase.name}`)}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t(`phases.${currentPhase.name}Description`)}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {t('insights.dayOfCycle', {
                    day: currentCycleDay,
                    total: user.cycleLength,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Tips by Phase */}
        <Tabs defaultValue="current" className="w-full mb-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="current">
              {t('insights.tabs.current')}
            </TabsTrigger>
            <TabsTrigger value="menstrual">
              {t('insights.tabs.menstrual')}
            </TabsTrigger>
            <TabsTrigger value="follicular">
              {t('insights.tabs.follicular')}
            </TabsTrigger>
            <TabsTrigger value="luteal">
              {t('insights.tabs.luteal')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.tipsForCurrentPhase')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase(currentPhase.name).map((tip) => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menstrual">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.menstrualPhaseTips')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase('menstrual').map((tip) => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="follicular">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.follicularPhaseTips')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase('follicular').map((tip) => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="luteal">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.lutealPhaseTips')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase('luteal').map((tip) => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cycle Stats */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>{t('insights.cycleStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium">{user.cycleLength}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('insights.avgCycleLength')}
                </p>
              </div>
              <div className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <Droplets className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium">{user.periodLength}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('insights.avgPeriodLength')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  )
}
