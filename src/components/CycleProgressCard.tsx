import { User } from '@/types'
import { format } from 'date-fns'
import {
  getCurrentCycleDay,
  getCurrentPhase,
  getNextPeriodDate,
  getFertileWindowDates,
} from '@/lib/cycleCalculations'
import useLocale from '@/hooks/useLocale'
import CycleProgressBar from './CycleProgressBar'
import useInsights from '@/hooks/useInsights'

interface CycleProgressProps {
  userData: User
}

export function CycleProgress({ userData }: CycleProgressProps) {
  const { t, locale } = useLocale()

  const { phases } = useInsights({ user: userData })
  const currentDay = getCurrentCycleDay(userData)
  const currentPhase = getCurrentPhase(userData)
  const nextPeriodDate = getNextPeriodDate(userData)
  const fertileWindow = getFertileWindowDates(userData)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <span className="font-heading font-semibold text-lg dark:text-white">
          {t('cycleInfo.title')}
        </span>
        {format(new Date(), 'dd.MM.yyyy', { locale })}
      </div>

      <div className="font-medium gradient-text mb-4">
        {t(`phases.${currentPhase.name}`)} ({t('cycleInfo.day')} {currentDay})
      </div>

      <div className="bg-neutral-50 dark:bg-gray-700 rounded-xl p-2 mb-4">
        <CycleProgressBar user={userData} phases={phases} />
      </div>

      <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <div>
          <div>{t('cycleInfo.nextPeriod')}</div>
          <div className="font-medium text-neutral-900 dark:text-white">
            {nextPeriodDate && format(nextPeriodDate, 'LLL d', { locale })}
          </div>
        </div>

        <div>
          <div>{t('cycleInfo.fertileWindow')}</div>
          <div className="font-medium text-neutral-900 dark:text-white">
            {fertileWindow.start && fertileWindow.end
              ? `${format(fertileWindow.start, 'LLL d', {
                  locale,
                })}-${format(fertileWindow.end, 'd', {
                  locale,
                })}`
              : '-'}
          </div>
        </div>
      </div>
    </div>
  )
}
