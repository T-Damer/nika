import { CalendarDayState } from '@/types'
import { cn } from '@/lib/utils'

interface CalendarDayProps {
  day: CalendarDayState
  onClick?: (date: Date) => void
}

export function CalendarDay({ day, onClick }: CalendarDayProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(day.date)
    }
  }

  return (
    <div
      className={cn(
        'calendar-day aspect-square flex items-center justify-center rounded-full cursor-pointer dark:text-white',
        !day.isCurrentMonth && 'opacity-20',
        day.isPeriod && 'bg-primary bg-opacity-20 text-white',
        day.isPredictedPeriod && 'bg-primary bg-opacity-20',
        day.isOvulation && '!bg-accent !bg-opacity-20 text-white',
        day.isFertile &&
          !day.isOvulation &&
          '!bg-success !bg-opacity-20 text-white',
        day.isToday && 'border border-primary font-bold'
      )}
      onClick={handleClick}
    >
      {day.number}
    </div>
  )
}
