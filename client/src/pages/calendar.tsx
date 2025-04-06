import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/user-context";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, addDays, isToday, isSameDay, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "../components/navbar";
import { CalendarDay } from "@/components/ui/calendar-day";
import { calculateCycleDays } from "@/lib/cycleCalculations";
import { CalendarDayState } from "@/types";

export default function Calendar() {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const currentLocale = i18n.language === 'ru' ? ru : undefined;
  
  const [currentViewingMonth, setCurrentViewingMonth] = useState(new Date());
  const [monthsToDisplay, setMonthsToDisplay] = useState(3);
  const [calendarMonths, setCalendarMonths] = useState<{
    month: Date;
    days: CalendarDayState[];
  }[]>([]);
  
  // Generate calendar data for multiple months
  useEffect(() => {
    if (!user.lastPeriodStart) return;
    
    const cycleDays = calculateCycleDays(user, 6);
    const months = [];
    
    // Create months starting from current viewing month
    for (let i = 0; i < monthsToDisplay; i++) {
      const monthDate = addMonths(currentViewingMonth, i);
      const startOfCurrentMonth = startOfMonth(monthDate);
      const endOfCurrentMonth = endOfMonth(monthDate);
      const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });
      
      // Adjust the calendar to start with Monday
      const firstDayOfMonth = startOfCurrentMonth.getDay() || 7;
      const prevMonthDays = firstDayOfMonth - 1;
      
      // Add days from previous month
      const previousMonthDays: CalendarDayState[] = [];
      for (let j = prevMonthDays - 1; j >= 0; j--) {
        const date = addDays(startOfCurrentMonth, -j - 1);
        previousMonthDays.push({
          number: date.getDate(),
          isCurrentMonth: false,
          isPeriod: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'period'),
          isPredictedPeriod: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'period' && d.predicted),
          isFertile: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'fertile'),
          isOvulation: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'ovulation'),
          date,
          isToday: isToday(date)
        });
      }
      
      // Current month days
      const currentMonthDays: CalendarDayState[] = daysInMonth.map(date => ({
        number: date.getDate(),
        isCurrentMonth: true,
        isPeriod: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'period'),
        isPredictedPeriod: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'period' && d.predicted),
        isFertile: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'fertile'),
        isOvulation: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'ovulation'),
        date,
        isToday: isToday(date)
      }));
      
      // Add days from next month to fill out the grid (6 rows of 7 days)
      const totalDaysToShow = 42; // 6 weeks
      const nextMonthDays: CalendarDayState[] = [];
      const daysToAdd = totalDaysToShow - (previousMonthDays.length + currentMonthDays.length);
      
      for (let j = 1; j <= daysToAdd; j++) {
        const date = addDays(endOfCurrentMonth, j);
        nextMonthDays.push({
          number: date.getDate(),
          isCurrentMonth: false,
          isPeriod: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'period'),
          isPredictedPeriod: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'period' && d.predicted),
          isFertile: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'fertile'),
          isOvulation: cycleDays.some(d => isSameDay(parseISO(d.date), date) && d.type === 'ovulation'),
          date,
          isToday: isToday(date)
        });
      }
      
      months.push({
        month: monthDate,
        days: [...previousMonthDays, ...currentMonthDays, ...nextMonthDays]
      });
    }
    
    setCalendarMonths(months);
  }, [currentViewingMonth, user, monthsToDisplay]);
  
  const navigateToPreviousMonth = () => {
    setCurrentViewingMonth(prev => addMonths(prev, -1));
  };
  
  const navigateToNextMonth = () => {
    setCurrentViewingMonth(prev => addMonths(prev, 1));
  };
  
  const handleDayClick = (date: Date) => {
    // TODO: Implement day selection or detail view
    console.log('Selected date:', date);
  };
  
  // Generate weekday labels
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    format(new Date(2021, 0, i + 1), 'EEEEE', { locale: currentLocale })
  );
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow">
        <div className="flex justify-between items-center">
          <h1 className="font-heading font-bold text-xl">{t('calendar.title')}</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1" onClick={navigateToPreviousMonth}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="p-1" onClick={navigateToNextMonth}>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* Calendar Legend */}
        <div className="bg-white rounded-xl p-3 mb-4 flex justify-between flex-wrap">
          <div className="flex items-center mr-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
            <span className="text-sm">{t('calendar.period')}</span>
          </div>
          <div className="flex items-center mr-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-primary opacity-30 mr-1"></div>
            <span className="text-sm">{t('calendar.predicted')}</span>
          </div>
          <div className="flex items-center mr-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
            <span className="text-sm">{t('calendar.ovulation')}</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-success mr-1"></div>
            <span className="text-sm">{t('calendar.fertile')}</span>
          </div>
        </div>
        
        {/* Months */}
        {calendarMonths.map((monthData, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <h3 className="font-medium mb-4">
              {format(monthData.month, 'LLLL yyyy', { locale: currentLocale })}
            </h3>
            
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-neutral-600 text-center">
              {weekDays.map((day, idx) => (
                <div key={idx}>{day}</div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1 text-sm">
              {monthData.days.map((day, dayIndex) => (
                <CalendarDay 
                  key={dayIndex} 
                  day={day} 
                  onClick={handleDayClick}
                />
              ))}
            </div>
          </div>
        ))}
      </main>
      
      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
