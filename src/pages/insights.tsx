import { useTranslation } from 'react-i18next'
import { useUser } from '@/contexts/user-context'
import { Navbar } from '@/components/navbar'
import { HealthTipCard } from '@/components/HealthTipCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { Calendar, Droplets } from 'lucide-react'
import { getCurrentCycleDay, getCurrentPhase } from '@/lib/cycleCalculations'
import useHealthTips from '@/hooks/useHealthTips'
import InsightsData from '@/lib/insights-data'

export default function Insights() {
  const { t } = useTranslation()
  const { user } = useUser()

  const currentPhase = getCurrentPhase(user)
  const currentCycleDay = getCurrentCycleDay(user)
  const { healthTips } = useHealthTips(user)
  const { phases } = InsightsData({ user, currentPhase })

  const filterTipsByPhase = (phase: string) => {
    return healthTips.filter(
      (tip) => tip.forPhase === phase || tip.forPhase === 'all'
    )
  }

  return (
    <div className="flex flex-col pb-16">
      <motion.h1
        className="font-heading font-bold text-2xl my-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {t('insights.title')}
      </motion.h1>

      <Card className="mb-6 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>{t('insights.phaseOverview')}</CardTitle>
        </CardHeader>
        <CardContent className="pb-5">
          {/* Phase timeline visualization */}
          <div className="mb-5">
            <div className="relative h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              {phases.map((phase, index) => {
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
                className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-md"
                style={{
                  left: `${((currentCycleDay - 1) / user.cycleLength) * 100}%`,
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
            <div className="flex flex-col">
              <span className="text-2xl font-medium">
                {t(`phases.${currentPhase.name}`)}
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {t(`phases.${currentPhase.name}Description`)}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                {t('insights.dayOfCycle')} {currentCycleDay}/{user.cycleLength}
              </span>
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
          <TabsTrigger value="luteal">{t('insights.tabs.luteal')}</TabsTrigger>
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

      <Navbar />
    </div>
  )
}
