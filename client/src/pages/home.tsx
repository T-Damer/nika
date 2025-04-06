import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/user-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { CycleProgress } from "../components/cycle-progress";
import { HealthTipCard } from "../components/health-tip-card";
import { Navbar } from "../components/navbar";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { calculateCycleDays, getCurrentPhase } from "@/lib/cycleCalculations";
import { CalendarDay } from "@/components/ui/calendar-day";
import { CalendarDayState, HealthTip } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const currentLocale = i18n.language === 'ru' ? ru : undefined;
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDayState[]>([]);
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  
  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isLoading && !user.onboardingCompleted) {
      navigate('/onboarding');
    }
  }, [user.onboardingCompleted, isLoading, navigate]);
  
  // Calculate calendar days
  useEffect(() => {
    if (!user.lastPeriodStart) return;
    
    const cycleDays = calculateCycleDays(user);
    const startOfCurrentMonth = startOfMonth(currentMonth);
    const endOfCurrentMonth = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });
    
    // Adjust the calendar to start with Monday
    const firstDayOfMonth = startOfCurrentMonth.getDay() || 7;
    const prevMonthDays = firstDayOfMonth - 1;
    
    // Add days from previous month
    const previousMonthDays: CalendarDayState[] = [];
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = addDays(startOfCurrentMonth, -i - 1);
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
    
    for (let i = 1; i <= daysToAdd; i++) {
      const date = addDays(endOfCurrentMonth, i);
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
    
    setCalendarDays([...previousMonthDays, ...currentMonthDays, ...nextMonthDays]);
    
  }, [currentMonth, user]);
  
  // Set health tips based on current phase
  useEffect(() => {
    if (!user.lastPeriodStart) return;
    
    const currentPhase = getCurrentPhase(user);
    
    const tips: HealthTip[] = [
      {
        id: '1',
        title: t(`healthTips.${currentPhase.name}.title`),
        content: t(`healthTips.${currentPhase.name}.content`),
        icon: currentPhase.name === 'menstrual' ? 'water' : 
              currentPhase.name === 'follicular' ? 'energy' : 
              currentPhase.name === 'ovulatory' ? 'heart' : 'food',
        forPhase: currentPhase.name,
        highlighted: true
      },
      {
        id: '2',
        title: t('healthTips.selfCare.title'),
        content: t('healthTips.selfCare.content'),
        icon: 'heart',
        forPhase: 'all',
        highlighted: false
      }
    ];
    
    setHealthTips(tips);
    
  }, [user, t]);
  
  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  // Generate weekday labels
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    format(new Date(2021, 0, i + 1), 'EEEEE', { locale: currentLocale })
  );
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header */}
      <header className="bg-white p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading font-bold text-2xl gradient-text">mene</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Cycle Information Card */}
        <CycleProgress userData={user} />
        
        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-semibold text-lg">{t('calendar.title')}</h2>
            <button className="text-primary text-sm font-medium" onClick={() => navigate('/calendar')}>
              {t('calendar.viewAll')}
            </button>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <button className="p-1" onClick={handlePrevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="font-medium">
                {format(currentMonth, 'LLLL yyyy', { locale: currentLocale })}
              </h3>
              <button className="p-1" onClick={handleNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-neutral-600 text-center">
              {weekDays.map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-sm">
              {calendarDays.map((day, index) => (
                <CalendarDay key={index} day={day} />
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
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-semibold text-lg">{t('healthTips.title')}</h2>
            <button className="text-primary text-sm font-medium" onClick={() => navigate('/insights')}>
              {t('healthTips.viewAll')}
            </button>
          </div>
          
          <div className="space-y-4">
            {healthTips.map(tip => (
              <HealthTipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
