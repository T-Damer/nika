import { useTranslation } from 'react-i18next'
import { useUser } from '@/contexts/user-context'
import { useState, useEffect } from 'react'
import { format, addMonths } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { CalendarDay } from '@/components/ui/calendar-day'
import { calculateCycleDays } from '@/lib/cycleCalculations'
import { generateMonthCalendarData } from '@/lib/calendarUtils'
import { CalendarDayState } from '@/types'
import { CalendarLegend } from '@/components/calendar/calendar-legend'
import MonthHeader from '@/components/calendar/month-header'
import WeekDaysHeader from '@/components/calendar/week-days-header'
import { motion } from 'framer-motion'
import useLocale from '@/hooks/useLocale'

const monthsToDisplay = 1

export default function Calendar() {
  const { t, locale } = useLocale()
  const { user } = useUser()

  const [currentViewingMonth, setCurrentViewingMonth] = useState(new Date())
  const [calendarMonths, setCalendarMonths] = useState<
    {
      month: Date
      days: CalendarDayState[]
    }[]
  >([])

  useEffect(() => {
    if (!user.lastPeriodStart) return

    const cycleDays = calculateCycleDays(user, 6)
    const months = []

    for (let i = 0; i < monthsToDisplay; i++) {
      const monthDate = addMonths(currentViewingMonth, i)
      const monthData = generateMonthCalendarData(monthDate, cycleDays)
      months.push(monthData)
    }

    setCalendarMonths(months)
  }, [currentViewingMonth, user, monthsToDisplay])

  const navigateToPreviousMonth = () => {
    setCurrentViewingMonth((prev) => addMonths(prev, -1))
  }

  const navigateToNextMonth = () => {
    setCurrentViewingMonth((prev) => addMonths(prev, 1))
  }

  const handleDayClick = (date: Date) => {
    // TODO: Implement day selection or detail view
    console.log('Selected date:', date)
  }

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(new Date(2025, 0, i + 1), 'EEEEE', { locale })
  )

  return (
    <div className="min-h-screen flex flex-col pt-safe pb-16">
      <motion.h1
        className="font-heading font-bold text-2xl my-4 dark:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {t('calendar.title')}
      </motion.h1>

      <div className="flex justify-between items-center mb-4">
        <button
          className="p-1 dark:text-white"
          onClick={navigateToPreviousMonth}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="font-medium dark:text-white">
          {format(currentViewingMonth, 'LLLL yyyy', { locale })}
        </span>
        <button className="p-1 dark:text-white" onClick={navigateToNextMonth}>
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <CalendarLegend />

      {calendarMonths.map((monthData, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-6"
        >
          <MonthHeader month={monthData.month} locale={locale} />

          <WeekDaysHeader weekDays={weekDays} />

          <div className="grid grid-cols-7 gap-1 text-sm">
            {monthData.days.map((day, dayIndex) => (
              <CalendarDay key={dayIndex} day={day} onClick={handleDayClick} />
            ))}
          </div>
        </div>
      ))}

      <Navbar />
    </div>
  )
}
