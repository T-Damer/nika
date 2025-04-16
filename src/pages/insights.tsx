import { useTranslation } from 'react-i18next'
import { useUser } from '@/contexts/user-context'
import { Navbar } from '@/components/navbar'
import { HealthTipCard } from '@/components/HealthTipCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { Calendar, Droplets } from 'lucide-react'
import { getCurrentCycleDay, getCurrentPhase } from '@/lib/cycleCalculations'
import CycleProgressBar from '@/components/CycleProgressBar'
import useInsights from '@/hooks/useInsights'
import AnimatedEntryHeader from '@/components/AnimatedEntryHeader'

export default function Insights() {
  const { t } = useTranslation()
  const { user } = useUser()

  const currentPhase = getCurrentPhase(user)
  const currentCycleDay = getCurrentCycleDay(user)
  const { phases, healthTips } = useInsights({ user })

  const filterTipsByPhase = (phase: string) => {
    return healthTips.filter(
      (tip) => tip.forPhase === phase || tip.forPhase === 'all'
    )
  }

  return (
    <div className="flex flex-col pb-16">
      <AnimatedEntryHeader>{t('insights.title')}</AnimatedEntryHeader>

      <Card className="mb-6 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>{t('insights.phaseOverview')}</CardTitle>
        </CardHeader>

        <CardContent className="pb-5">
          <CycleProgressBar phases={phases} user={user} />

          {/* Current Phase Info */}
          <div className="flex items-center mt-4">
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

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle>{t('insights.cycleStats')}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-slate-800 rounded-lg">
              <Calendar className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-medium">{user.cycleLength}</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                {t('insights.avgCycleLength')}
              </span>
            </div>

            <div className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-slate-800 rounded-lg">
              <Droplets className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-medium">{user.periodLength}</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                {t('insights.avgPeriodLength')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Navbar />
    </div>
  )
}
