import { CycleDay, CyclePhase, HealthTip, User } from '@/types'
import {
  addDays,
  addMonths,
  differenceInDays,
  format,
  isSameDay,
  parseISO,
  startOfDay,
} from 'date-fns'

const ovulationDefault = 14

export const cycleConstants = {
  lengthMin: 24,
  lengthMax: 38,
  durationMin: 4,
  durationMax: 8,
  bloodLossMin: 50,
  bloodLossMax: 80,
  variability: 4,
  bleedDurationUnder25: 9,
  bleedDurationUnder41: 7,
  bleedDurationUnder45: 9,

  teen: {
    age: 17,
    lengthMin: 21,
    lengthMax: 45,
    durationMin: 2,
    durationMax: 8,
    bloodLossMin: 5,
    bloodLossMax: 80,
  },
}

const isoDateFormat = 'yyyy-MM-dd'

export function calculateCycleDays(
  user: User,
  monthsToPredict: number = 3
): CycleDay[] {
  if (!user.lastPeriodStart) return []

  const { cycleLength, periodLength, lastPeriodStart } = user
  const lastPeriodStartDate = parseISO(lastPeriodStart)
  const today = startOfDay(new Date())
  const endDate = addMonths(today, monthsToPredict)
  const cycleDays: CycleDay[] = []

  let currentDate = lastPeriodStartDate
  let isPredicted = differenceInDays(currentDate, today) > 0

  while (currentDate <= endDate) {
    for (let i = 0; i < periodLength; i++) {
      const periodDay = addDays(currentDate, i)
      cycleDays.push({
        date: format(periodDay, isoDateFormat),
        type: 'period',
        predicted: isPredicted || !isSameDay(periodDay, lastPeriodStartDate),
      })
    }

    const ovulationDay = addDays(currentDate, cycleLength - ovulationDefault)
    cycleDays.push({
      date: format(ovulationDay, isoDateFormat),
      type: 'ovulation',
      predicted: true,
    })

    // -2days and ovulation and +2days
    for (let i = 2; i > -3; i--) {
      const fertileDay = addDays(ovulationDay, -i)

      // Skip if this day is already marked as a period day
      if (
        !cycleDays.some((d) => d.date === format(fertileDay, isoDateFormat))
      ) {
        cycleDays.push({
          date: format(fertileDay, isoDateFormat),
          type: 'fertile',
          predicted: true,
        })
      }
    }

    // Add normal days for days that don't have a specific type
    const cycleStartDay = currentDate
    const nextCycleStartDay = addDays(currentDate, cycleLength)

    for (let i = 0; i < cycleLength; i++) {
      const currentCycleDay = addDays(cycleStartDay, i)

      // Skip if this day already has a type
      if (
        !cycleDays.some((d) => isSameDay(parseISO(d.date), currentCycleDay))
      ) {
        cycleDays.push({
          date: format(currentCycleDay, 'dd.MM.yyyy'),
          type: 'normal',
          predicted: true,
        })
      }
    }

    // Move to the next cycle
    currentDate = addDays(currentDate, cycleLength)
    isPredicted = true
  }

  return cycleDays
}

export function getCurrentCycleDay(user: User): number {
  if (!user.lastPeriodStart) return 0

  const lastPeriodStart = parseISO(user.lastPeriodStart)
  const today = startOfDay(new Date())

  const daysSinceStart = differenceInDays(today, lastPeriodStart)

  if (daysSinceStart < 0) return 0

  const currentCycleDay = (daysSinceStart % user.cycleLength) + 1

  return currentCycleDay
}

export function getCurrentPhase(user: User): CyclePhase {
  const currentCycleDay = getCurrentCycleDay(user)

  const phases: CyclePhase[] = [
    { name: 'menstrual', startDay: 1, endDay: user.periodLength },
    {
      name: 'follicular',
      startDay: user.periodLength + 1,
      endDay: user.cycleLength - 15,
    },
    {
      name: 'ovulatory',
      startDay: user.cycleLength - ovulationDefault,
      endDay: user.cycleLength - 12,
    },
    {
      name: 'luteal',
      startDay: user.cycleLength - 11,
      endDay: user.cycleLength,
    },
  ]

  const currentPhase = phases.find(
    (phase) =>
      currentCycleDay >= phase.startDay && currentCycleDay <= phase.endDay
  )

  return currentPhase || phases[0]
}

export function getNextPeriodDate(user: User): Date | null {
  if (!user.lastPeriodStart) return null

  const lastPeriodStart = parseISO(user.lastPeriodStart)
  const today = startOfDay(new Date())
  const daysSinceStart = differenceInDays(today, lastPeriodStart)

  const daysUntilNextPeriod =
    user.cycleLength - (daysSinceStart % user.cycleLength)

  // If it's the first day of the period, daysUntilNextPeriod will be cycleLength
  // In that case, we want to return today's date
  if (
    daysUntilNextPeriod === user.cycleLength &&
    daysSinceStart % user.cycleLength === 0
  ) {
    return today
  }

  return addDays(today, daysUntilNextPeriod)
}

export function getFertileWindowDates(user: User): {
  start: Date | null
  end: Date | null
} {
  if (!user.lastPeriodStart) return { start: null, end: null }

  const nextPeriodDate = getNextPeriodDate(user)
  if (!nextPeriodDate) return { start: null, end: null }

  // Fertile window is typically from 5 days before ovulation through ovulation day
  // Ovulation occurs about 14 days before the next period
  const ovulationDate = addDays(nextPeriodDate, -ovulationDefault)
  const fertileWindowStart = addDays(ovulationDate, -5)
  const fertileWindowEnd = ovulationDate

  return { start: fertileWindowStart, end: fertileWindowEnd }
}

export function generateHealthTips(user: User): HealthTip[] {
  const currentPhase = getCurrentPhase(user)
  const age = user.age
  const phaseName = currentPhase.name

  const tips: HealthTip[] = []

  if (phaseName === 'menstrual') {
    tips.push({
      id: 'iron-foods',
      title: 'Nutrition',
      content:
        'Focus on iron-rich foods like leafy greens and lean proteins to replenish what you lose during menstruation.',
      icon: 'nutrition',
      forPhase: 'menstrual',
      highlighted: true,
    })

    tips.push({
      id: 'gentle-exercise',
      title: 'Exercise',
      content:
        'Light exercise like walking or gentle yoga can help reduce cramps and improve mood.',
      icon: 'exercise',
      forPhase: 'menstrual',
      highlighted: false,
    })
  } else if (phaseName === 'follicular') {
    tips.push({
      id: 'energy-boost',
      title: 'Energy Levels',
      content:
        'Your energy is likely higher now, making this a good time for more intense physical activity.',
      icon: 'energy',
      forPhase: 'follicular',
      highlighted: true,
    })
  } else if (phaseName === 'ovulatory') {
    tips.push({
      id: 'hydration',
      title: 'Hydration',
      content:
        'Stay well hydrated as water retention may increase during this phase.',
      icon: 'water',
      forPhase: 'ovulatory',
      highlighted: true,
    })
  } else if (phaseName === 'luteal') {
    tips.push({
      id: 'complex-carbs',
      title: 'Nutrition',
      content:
        'Complex carbohydrates can help manage PMS symptoms and mood fluctuations.',
      icon: 'nutrition',
      forPhase: 'luteal',
      highlighted: true,
    })
  }

  // Age-specific tips
  if (age < 18) {
    if (phaseName === 'menstrual') {
      tips.push({
        id: 'teen-cramps',
        title: 'Self-Care',
        content:
          'Using a heating pad or taking a warm bath can help relieve cramps. Remember that cramps are common and usually normal.',
        icon: 'self-care',
        forPhase: 'menstrual',
        highlighted: true,
      })
    }

    if (phaseName === 'luteal') {
      tips.push({
        id: 'teen-mood',
        title: 'Emotional Health',
        content:
          'Mood swings are common before your period. Deep breathing or talking with someone you trust can help.',
        icon: 'mood',
        forPhase: 'luteal',
        highlighted: false,
      })
    }

    // General teen tip
    tips.push({
      id: 'cycle-regularity',
      title: 'Cycle Tracking',
      content:
        "It's normal for teens to have irregular cycles for the first few years. Tracking can help you understand your patterns.",
      icon: 'calendar',
      forPhase: phaseName,
      highlighted: false,
    })
  }

  // Stress level specific tips
  if (user.stressLevel && user.stressLevel > 7) {
    tips.push({
      id: 'stress-management',
      title: 'Stress Relief',
      content:
        'High stress can affect your cycle. Consider relaxation techniques like meditation or deep breathing.',
      icon: 'relax',
      forPhase: phaseName,
      highlighted: true,
    })
  }

  // Activity level specific tips
  if (user.activityLevel === 'high' && phaseName === 'menstrual') {
    tips.push({
      id: 'active-period',
      title: 'Active Lifestyle',
      content:
        'Consider lowering exercise intensity during your period if you experience fatigue or discomfort.',
      icon: 'exercise',
      forPhase: 'menstrual',
      highlighted: false,
    })
  }

  return tips
}
