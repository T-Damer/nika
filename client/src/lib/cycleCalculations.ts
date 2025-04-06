import { CycleDay, User, CyclePhase } from '../types';
import { addDays, addMonths, differenceInDays, format, isSameDay, parseISO, startOfDay } from 'date-fns';

export function calculateCycleDays(user: User, monthsToPredict: number = 3): CycleDay[] {
  if (!user.lastPeriodStart) return [];

  const lastPeriodStartDate = parseISO(user.lastPeriodStart);
  const today = startOfDay(new Date());
  const endDate = addMonths(today, monthsToPredict);
  const cycleDays: CycleDay[] = [];
  const { cycleLength, periodLength } = user;

  let currentDate = lastPeriodStartDate;
  let isPredicted = differenceInDays(currentDate, today) > 0;

  // Calculate past and future cycles
  while (currentDate <= endDate) {
    // Add period days
    for (let i = 0; i < periodLength; i++) {
      const periodDay = addDays(currentDate, i);
      cycleDays.push({
        date: format(periodDay, 'yyyy-MM-dd'),
        type: 'period',
        predicted: isPredicted || !isSameDay(periodDay, lastPeriodStartDate)
      });
    }

    // Calculate ovulation (around 14 days before the next period)
    const ovulationDay = addDays(currentDate, cycleLength - 14);
    cycleDays.push({
      date: format(ovulationDay, 'yyyy-MM-dd'),
      type: 'ovulation',
      predicted: true
    });

    // Calculate fertile window (5 days before ovulation + ovulation day)
    for (let i = 5; i > 0; i--) {
      const fertileDay = addDays(ovulationDay, -i);
      // Skip if this day is already marked as a period day
      if (!cycleDays.some(d => d.date === format(fertileDay, 'yyyy-MM-dd'))) {
        cycleDays.push({
          date: format(fertileDay, 'yyyy-MM-dd'),
          type: 'fertile',
          predicted: true
        });
      }
    }

    // Move to the next cycle
    currentDate = addDays(currentDate, cycleLength);
    isPredicted = true;
  }

  return cycleDays;
}

export function getCurrentCycleDay(user: User): number {
  if (!user.lastPeriodStart) return 0;

  const lastPeriodStart = parseISO(user.lastPeriodStart);
  const today = startOfDay(new Date());
  
  // Calculate days since last period started
  const daysSinceStart = differenceInDays(today, lastPeriodStart);
  
  // If negative, the last period is in the future (which shouldn't happen normally)
  if (daysSinceStart < 0) return 0;
  
  // Calculate which day of the cycle we're on (1-based)
  const currentCycleDay = (daysSinceStart % user.cycleLength) + 1;
  
  return currentCycleDay;
}

export function getCurrentPhase(user: User): CyclePhase {
  const currentCycleDay = getCurrentCycleDay(user);
  
  // Define cycle phases
  const phases: CyclePhase[] = [
    { name: 'menstrual', startDay: 1, endDay: user.periodLength },
    { name: 'follicular', startDay: user.periodLength + 1, endDay: user.cycleLength - 15 },
    { name: 'ovulatory', startDay: user.cycleLength - 14, endDay: user.cycleLength - 12 },
    { name: 'luteal', startDay: user.cycleLength - 11, endDay: user.cycleLength }
  ];
  
  // Find the current phase
  const currentPhase = phases.find(phase => 
    currentCycleDay >= phase.startDay && currentCycleDay <= phase.endDay
  );
  
  return currentPhase || phases[0]; // Default to menstrual phase if not found
}

export function getNextPeriodDate(user: User): Date | null {
  if (!user.lastPeriodStart) return null;

  const lastPeriodStart = parseISO(user.lastPeriodStart);
  const today = startOfDay(new Date());
  const daysSinceStart = differenceInDays(today, lastPeriodStart);
  
  // Calculate how many days until the next period
  const daysUntilNextPeriod = user.cycleLength - (daysSinceStart % user.cycleLength);
  
  // If it's the first day of the period, daysUntilNextPeriod will be cycleLength
  // In that case, we want to return today's date
  if (daysUntilNextPeriod === user.cycleLength && daysSinceStart % user.cycleLength === 0) {
    return today;
  }
  
  return addDays(today, daysUntilNextPeriod);
}

export function getFertileWindowDates(user: User): { start: Date | null; end: Date | null } {
  if (!user.lastPeriodStart) return { start: null, end: null };

  const nextPeriodDate = getNextPeriodDate(user);
  if (!nextPeriodDate) return { start: null, end: null };
  
  // Fertile window is typically from 5 days before ovulation through ovulation day
  // Ovulation occurs about 14 days before the next period
  const ovulationDate = addDays(nextPeriodDate, -14);
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = ovulationDate;
  
  return { start: fertileWindowStart, end: fertileWindowEnd };
}
