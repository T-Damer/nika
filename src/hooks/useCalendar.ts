import { calculateCycleDays } from '@/lib/cycleCalculations'
import { CalendarDayState, User } from '@/types'
import {
  addDays,
  eachDayOfInterval,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
} from 'date-fns'
import { RefObject, useEffect, useState } from 'react'

const today = new Date()
const daysToShow = 7

export default function useCalendar(
  user: User,
  scrollRef: RefObject<HTMLDivElement>
) {
  const [weekStartDate, setWeekStartDate] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  )
  const [weekCalendarDays, setWeekCalendarDays] = useState<CalendarDayState[]>(
    []
  )

  useEffect(() => {
    if (!user.lastPeriodStart) return

    const cycleDays = calculateCycleDays(user)

    const weekViewDays = eachDayOfInterval({
      start: weekStartDate,
      end: addDays(weekStartDate, daysToShow - 1),
    })

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

  return { weekCalendarDays, weekStartDate, setWeekStartDate, daysToShow }
}
