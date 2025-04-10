import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LastPeriodStepProps {
  initialValue: string
  onNext: (date: string) => void
  onBack: () => void
}

export function LastPeriodStep({
  initialValue,
  onNext,
  onBack,
}: LastPeriodStepProps) {
  const { t, i18n } = useTranslation()
  const currentLocale = i18n.language === 'ru' ? ru : enUS

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialValue ? new Date(initialValue) : null
  )

  const startOfCurrentMonth = startOfMonth(currentMonth)
  const endOfCurrentMonth = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  })

  // Get day names based on locale
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(new Date(2021, 0, i + 1), 'EEEEE', { locale: currentLocale })
  )

  // Adjust the calendar to start with Monday
  const firstDayOfMonth = startOfCurrentMonth.getDay() || 7
  const prevMonthDays = firstDayOfMonth - 1

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    )
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate) {
      onNext(selectedDate.toISOString())
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h2 className="font-heading font-bold text-2xl mb-6">
        {t('lastPeriodStep.title')}
      </h2>
      <p className="text-neutral-800 mb-6 max-w-xs">
        {t('lastPeriodStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <button type="button" className="p-1" onClick={handlePrevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </button>

            <h3 className="font-medium">
              {format(currentMonth, 'LLLL yyyy', { locale: currentLocale })}
            </h3>

            <button type="button" className="p-1" onClick={handleNextMonth}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-neutral-600">
            {weekDays.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for previous month */}
            {Array.from({ length: prevMonthDays }).map((_, index) => (
              <div
                key={`prev-${index}`}
                className="calendar-day text-neutral-400"
              ></div>
            ))}

            {/* Days of current month */}
            {daysInMonth.map((day) => (
              <div
                key={day.toString()}
                className={`calendar-day cursor-pointer ${
                  selectedDate && isSameDay(day, selectedDate) ? 'period' : ''
                } ${isToday(day) ? 'font-bold' : ''}`}
                onClick={() => handleDateSelect(day)}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition"
          disabled={!selectedDate}
        >
          {t('common.continue')}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full mt-3 text-neutral-800 font-medium py-2 px-6 rounded-full hover:bg-neutral-100 transition"
          onClick={onBack}
        >
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
