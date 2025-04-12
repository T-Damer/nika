import { Button } from '@/components/ui/Button'
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isToday,
  startOfMonth,
} from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
      <p className="text-neutral-800 mb-6">{t('lastPeriodStep.subtitle')}</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full"
      >
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 w-96">
          <div className="flex justify-between items-center mb-8">
            <button type="button" className="p-1" onClick={handlePrevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-2xl font-bold">
              {format(currentMonth, 'LLLL yyyy', { locale: currentLocale })}
            </span>

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
              />
            ))}

            {daysInMonth.map((day) => (
              <div
                key={day.toString()}
                className={`calendar-day rounded-full cursor-pointer ${
                  selectedDate && isSameDay(day, selectedDate)
                    ? 'bg-primary text-white'
                    : ''
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
