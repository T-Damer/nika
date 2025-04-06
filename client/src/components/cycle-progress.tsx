import { useTranslation } from "react-i18next";
import { User } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getCurrentCycleDay, getCurrentPhase, getNextPeriodDate, getFertileWindowDates } from "@/lib/cycleCalculations";

interface CycleProgressProps {
  userData: User;
}

export function CycleProgress({ userData }: CycleProgressProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === 'ru' ? ru : undefined;
  
  const currentDay = getCurrentCycleDay(userData);
  const currentPhase = getCurrentPhase(userData);
  const nextPeriodDate = getNextPeriodDate(userData);
  const fertileWindow = getFertileWindowDates(userData);

  // Calculate progress percentages for the progress bar
  const periodPercentage = (userData.periodLength / userData.cycleLength) * 100;
  const currentPercentage = (currentDay / userData.cycleLength) * 100;
  const ovulationPosition = ((userData.cycleLength - 14) / userData.cycleLength) * 100;
  const fertileWindowStart = ((userData.cycleLength - 19) / userData.cycleLength) * 100;
  const fertileWindowWidth = (6 / userData.cycleLength) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-semibold text-lg">{t('cycleInfo.title')}</h2>
        <span className="text-sm text-neutral-600">
          {nextPeriodDate && format(nextPeriodDate, 'MMMM yyyy', { locale: currentLocale })}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-neutral-600 mb-1">{t('cycleInfo.currentPhase')}</div>
        <div className="font-medium text-primary">
          {t(`phases.${currentPhase.name}`)} ({t('cycleInfo.day')} {currentDay} {t('cycleInfo.ofCycle')})
        </div>
      </div>
      
      <div className="bg-neutral-50 rounded-xl p-2 mb-4">
        <div className="flex h-2 rounded-full overflow-hidden">
          {/* Period section */}
          <div 
            className="bg-primary rounded-l-full" 
            style={{ width: `${periodPercentage}%` }}
          ></div>
          
          {/* Fertile window */}
          <div 
            className="bg-success" 
            style={{ width: `${fertileWindowWidth}%`, marginLeft: `${fertileWindowStart - periodPercentage}%` }}
          ></div>
          
          {/* Ovulation */}
          <div 
            className="bg-accent" 
            style={{ width: '2%', marginLeft: `${ovulationPosition - fertileWindowStart - fertileWindowWidth - periodPercentage}%` }}
          ></div>
          
          {/* Remaining days */}
          <div 
            className="bg-neutral-200 rounded-r-full" 
            style={{ width: `${100 - Math.max(currentPercentage, periodPercentage)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>{t('cycleInfo.period')}</span>
          <span>{t('cycleInfo.ovulation')}</span>
          <span>{t('cycleInfo.nextPeriod')}</span>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-neutral-600">
        <div>
          <div>{t('cycleInfo.nextPeriod')}</div>
          <div className="font-medium text-neutral-900">
            {nextPeriodDate && format(nextPeriodDate, 'MMM d', { locale: currentLocale })}
          </div>
        </div>
        <div>
          <div>{t('cycleInfo.fertileWindow')}</div>
          <div className="font-medium text-neutral-900">
            {fertileWindow.start && fertileWindow.end ? 
              `${format(fertileWindow.start, 'MMM d', { locale: currentLocale })}-${format(fertileWindow.end, 'd', { locale: currentLocale })}` : 
              '-'}
          </div>
        </div>
        <div>
          <div>{t('cycleInfo.cycleLength')}</div>
          <div className="font-medium text-neutral-900">
            {userData.cycleLength} {t('cycleInfo.days')}
          </div>
        </div>
      </div>
    </div>
  );
}
