import { CalendarDayState, CycleDay } from '@/types'
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
} from 'date-fns'

/**
 * Generates calendar data for a specific month
 */
export function generateMonthCalendarData(
  monthDate: Date,
  cycleDays: CycleDay[]
): {
  month: Date
  days: CalendarDayState[]
} {
  const startOfCurrentMonth = startOfMonth(monthDate)
  const endOfCurrentMonth = endOfMonth(monthDate)
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  })

  // Adjust the calendar to start with Monday
  const firstDayOfMonth = startOfCurrentMonth.getDay() || 7
  const prevMonthDays = firstDayOfMonth - 1

  // Add days from previous month
  const previousMonthDays: CalendarDayState[] = []
  for (let j = prevMonthDays - 1; j >= 0; j--) {
    const date = addDays(startOfCurrentMonth, -j - 1)
    previousMonthDays.push(createCalendarDayState(date, false, cycleDays))
  }

  // Current month days
  const currentMonthDays: CalendarDayState[] = daysInMonth.map((date) =>
    createCalendarDayState(date, true, cycleDays)
  )

  // Add days from next month to fill out the grid (6 rows of 7 days)
  const totalDaysToShow = 42 // 6 weeks
  const nextMonthDays: CalendarDayState[] = []
  const daysToAdd =
    totalDaysToShow - (previousMonthDays.length + currentMonthDays.length)

  for (let j = 1; j <= daysToAdd; j++) {
    const date = addDays(endOfCurrentMonth, j)
    nextMonthDays.push(createCalendarDayState(date, false, cycleDays))
  }

  return {
    month: monthDate,
    days: [...previousMonthDays, ...currentMonthDays, ...nextMonthDays],
  }
}

function createCalendarDayState(
  date: Date,
  isCurrentMonth: boolean,
  cycleDays: CycleDay[]
): CalendarDayState {
  return {
    number: date.getDate(),
    isCurrentMonth,
    isPeriod: cycleDays.some(
      (d) => isSameDay(parseISO(d.date), date) && d.type === 'period'
    ),
    isPredictedPeriod: cycleDays.some(
      (d) =>
        isSameDay(parseISO(d.date), date) && d.type === 'period' && d.predicted
    ),
    isFertile: cycleDays.some(
      (d) => isSameDay(parseISO(d.date), date) && d.type === 'fertile'
    ),
    isOvulation: cycleDays.some(
      (d) => isSameDay(parseISO(d.date), date) && d.type === 'ovulation'
    ),
    date,
    isToday: isToday(date),
  }
}
