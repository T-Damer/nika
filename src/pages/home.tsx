import { useUser } from '@/contexts/user-context'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CycleProgress } from '@/components/CycleProgressCard'
import { Navbar } from '@/components/navbar'
import { motion } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import useCalendar from '@/hooks/useCalendar'
import useLocale from '@/hooks/useLocale'

export default function Home() {
  const { t, locale } = useLocale()
  const { user, isLoading } = useUser()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { weekCalendarDays, setWeekStartDate, weekStartDate } = useCalendar(
    user,
    scrollRef
  )

  useEffect(() => {
    if (!isLoading && !user.onboardingCompleted) {
      navigate('/onboarding')
    }
  }, [user.onboardingCompleted, isLoading, navigate])

  const handlePrevWeek = () => {
    setWeekStartDate(subDays(weekStartDate, 14))
  }

  const handleNextWeek = () => {
    setWeekStartDate(addDays(weekStartDate, 14))
  }

  const formatDayName = (date: Date) => {
    return format(date, 'EEEEEE', { locale })
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 my-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CycleProgress userData={user} />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-heading font-semibold text-lg dark:text-white">
              {t('calendar.title')}
            </span>
            <button
              className="text-primary text-sm font-medium"
              onClick={() => navigate('/calendar')}
            >
              <Eye />
            </button>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <button className="p-1" onClick={handlePrevWeek}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-2xl font-medium">
                {format(weekStartDate, 'LLL yyyy', { locale })}
              </span>
              <button className="p-1" onClick={handleNextWeek}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory"
            >
              {weekCalendarDays.map((day, index) => (
                <div key={index} className="w-14 mx-1">
                  <div className="text-center mb-1 text-xs text-neutral-400">
                    {formatDayName(day.date)}
                  </div>
                  <div
                    className={`
                        aspect-square rounded-full flex items-center justify-center text-sm relative
                        ${day.isToday ? 'border border-primary' : ''} 
                        ${
                          day.isPeriod
                            ? 'bg-primary bg-opacity-20 text-white'
                            : day.isPredictedPeriod
                              ? 'bg-primary bg-opacity-10'
                              : ''
                        }
                      `}
                    onClick={() => {
                      console.log('selects day')
                    }}
                  >
                    <span className={day.isToday ? 'font-bold' : ''}>
                      {day.number}
                    </span>

                    {/* Indicators */}
                    {day.isOvulation && (
                      <span className="absolute -bottom-1.5 sm:bottom-1 w-1 h-1 bg-accent rounded-full"></span>
                    )}
                    {day.isFertile && !day.isOvulation && (
                      <span className="absolute -bottom-1.5 sm:bottom-1 w-1 h-1 bg-success rounded-full"></span>
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
              <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
              <span>{t('calendar.ovulation')}</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-success mr-1"></div>
              <span>{t('calendar.fertile')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <Navbar />
    </div>
  )
}
