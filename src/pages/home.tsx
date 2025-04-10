import { useTranslation } from 'react-i18next'
import { useUser } from '@/contexts/user-context'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CycleProgress } from '@/components/cycle-progress'
import { HealthTipCard } from '@/components/health-tip-card'
import { Navbar } from '@/components/navbar'
import { motion } from 'framer-motion'
import {
  format,
  startOfDay,
  startOfWeek,
  addDays,
  eachDayOfInterval,
  isToday,
  isSameDay,
  parseISO,
  subDays,
  addWeeks,
} from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { calculateCycleDays, getCurrentPhase } from '@/lib/cycleCalculations'
import { CalendarDayState, HealthTip } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { user, isLoading } = useUser()
  const navigate = useNavigate()
  const currentLocale = i18n.language === 'ru' ? ru : enUS

  const today = new Date()
  const [weekStartDate, setWeekStartDate] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  )
  const [weekCalendarDays, setWeekCalendarDays] = useState<CalendarDayState[]>(
    []
  )
  const [healthTips, setHealthTips] = useState<HealthTip[]>([])

  const scrollRef = useRef<HTMLDivElement>(null)

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isLoading && !user.onboardingCompleted) {
      navigate('/onboarding')
    }
  }, [user.onboardingCompleted, isLoading, navigate])

  // Calculate 7-day week calendar
  useEffect(() => {
    if (!user.lastPeriodStart) return

    const cycleDays = calculateCycleDays(user)

    // Display 14 days (current week + next week)
    const daysToShow = 14
    const weekViewDays = eachDayOfInterval({
      start: weekStartDate,
      end: addDays(weekStartDate, daysToShow - 1),
    })

    // Create calendar day states
    const weekDays: CalendarDayState[] = weekViewDays.map((date) => ({
      number: date.getDate(),
      isCurrentMonth: true, // Not relevant for week view
      isPeriod: cycleDays.some(
        (d) => isSameDay(parseISO(d.date), date) && d.type === 'period'
      ),
      isPredictedPeriod: cycleDays.some(
        (d) =>
          isSameDay(parseISO(d.date), date) &&
          d.type === 'period' &&
          d.predicted
      ),
      isFertile: cycleDays.some(
        (d) => isSameDay(parseISO(d.date), date) && d.type === 'fertile'
      ),
      isOvulation: cycleDays.some(
        (d) => isSameDay(parseISO(d.date), date) && d.type === 'ovulation'
      ),
      date,
      isToday: isToday(date),
    }))

    setWeekCalendarDays(weekDays)

    // Scroll to today
    setTimeout(() => {
      if (scrollRef.current) {
        const todayIndex = weekDays.findIndex((day) => day.isToday)
        if (todayIndex >= 0) {
          const dayWidth = 56 // 3.5rem (14) width + 0.5rem (2) margin
          scrollRef.current.scrollLeft = todayIndex * dayWidth
        }
      }
    }, 100)
  }, [weekStartDate, user])

  // Set health tips based on current phase
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

  // Navigate week view
  const handlePrevWeek = () => {
    setWeekStartDate(subDays(weekStartDate, 7))
  }

  const handleNextWeek = () => {
    setWeekStartDate(addDays(weekStartDate, 7))
  }

  // Handle day click
  const handleDayClick = (date: Date) => {
    navigate('/log')
  }

  // Format day name
  const formatDayName = (date: Date) => {
    return format(date, 'EEEEEE', { locale: currentLocale })
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Main Content */}
      <main className="flex-1 pt-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cycle Information Card */}
          <CycleProgress userData={user} />

          {/* Week Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading font-semibold text-lg dark:text-white">
                {t('calendar.title')}
              </h2>
              <button
                className="text-primary text-sm font-medium"
                onClick={() => navigate('/calendar')}
              >
                {t('calendar.viewAll')}
              </button>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <button className="p-1" onClick={handlePrevWeek}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="font-medium">
                  {format(weekStartDate, 'MMMM yyyy', {
                    locale: currentLocale,
                  })}
                </h3>
                <button className="p-1" onClick={handleNextWeek}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory"
              >
                {weekCalendarDays.map((day, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-14 mx-1 snap-center"
                  >
                    <div className="text-center mb-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {formatDayName(day.date)}
                    </div>
                    <div
                      className={`
                        aspect-square rounded-full flex items-center justify-center text-sm relative
                        ${day.isToday ? 'border border-primary' : ''} 
                        ${
                          day.isPeriod
                            ? 'bg-primary/20'
                            : day.isPredictedPeriod
                            ? 'bg-primary/10'
                            : ''
                        }
                      `}
                      onClick={() => handleDayClick(day.date)}
                    >
                      <span className={day.isToday ? 'font-bold' : ''}>
                        {day.number}
                      </span>

                      {/* Indicators */}
                      {day.isOvulation && (
                        <span className="absolute bottom-1 w-1 h-1 bg-accent rounded-full"></span>
                      )}
                      {day.isFertile && !day.isOvulation && (
                        <span className="absolute bottom-1 w-1 h-1 bg-success rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-xs flex-wrap">
              <div className="flex items-center mr-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                <span>{t('calendar.period')}</span>
              </div>
              <div className="flex items-center mr-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-primary opacity-30 mr-1"></div>
                <span>{t('calendar.predicted')}</span>
              </div>
              <div className="flex items-center mr-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
                <span>{t('calendar.ovulation')}</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-success mr-1"></div>
                <span>{t('calendar.fertile')}</span>
              </div>
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading font-semibold text-lg dark:text-white">
                {t('healthTips.title')}
              </h2>
              <button
                className="text-primary text-sm font-medium"
                onClick={() => navigate('/insights')}
              >
                {t('healthTips.viewAll')}
              </button>
            </div>

            <div className="space-y-4">
              {healthTips.map((tip) => (
                <HealthTipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  )
}
