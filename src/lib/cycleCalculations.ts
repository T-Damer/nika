import { CycleDay, CyclePhase, HealthTip, User } from '@/types'
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInYears,
  format,
  isSameDay,
  parseISO,
  startOfDay,
} from 'date-fns'

/**
 * Calculate user's age from birthdate components
 */
function calculateAge(user: User): number {
  if (!user.birthYear || !user.birthMonth || !user.birthDay) {
    return 25 // Default age if not provided
  }

  const birthdate = new Date(
    parseInt(user.birthYear),
    parseInt(user.birthMonth) - 1, // Months are 0-indexed in JS Date
    parseInt(user.birthDay)
  )

  return differenceInYears(new Date(), birthdate)
}

/**
 * Calculate cycle days for the user
 * @param user User information including cycle details
 * @param monthsToPredict Number of months to predict into the future
 * @returns Array of cycle days with their types
 */
export function calculateCycleDays(
  user: User,
  monthsToPredict: number = 3
): CycleDay[] {
  if (!user.lastPeriodStart) return []

  const lastPeriodStartDate = parseISO(user.lastPeriodStart)
  const today = startOfDay(new Date())
  const endDate = addMonths(today, monthsToPredict)
  const cycleDays: CycleDay[] = []

  // Get user age
  const age = calculateAge(user)

  // Validate cycle parameters based on age
  const cycleLength = validateCycleLength(user.cycleLength, age)
  const periodLength = validatePeriodLength(user.periodLength, age)

  let currentDate = lastPeriodStartDate
  let isPredicted = differenceInDays(currentDate, today) > 0

  // Calculate past and future cycles
  while (currentDate <= endDate) {
    // Add period days
    for (let i = 0; i < periodLength; i++) {
      const periodDay = addDays(currentDate, i)
      cycleDays.push({
        date: format(periodDay, 'yyyy-MM-dd'),
        type: 'period',
        predicted: isPredicted || !isSameDay(periodDay, lastPeriodStartDate),
      })
    }

    // Calculate ovulation (around 14 days before the next period)
    const ovulationDay = addDays(currentDate, cycleLength - 14)
    cycleDays.push({
      date: format(ovulationDay, 'yyyy-MM-dd'),
      type: 'ovulation',
      predicted: true,
    })

    // Calculate fertile window (5 days before ovulation + ovulation day)
    for (let i = 5; i > 0; i--) {
      const fertileDay = addDays(ovulationDay, -i)
      // Skip if this day is already marked as a period day
      if (!cycleDays.some((d) => d.date === format(fertileDay, 'yyyy-MM-dd'))) {
        cycleDays.push({
          date: format(fertileDay, 'yyyy-MM-dd'),
          type: 'fertile',
          predicted: true,
        })
      }
    }

    // Add normal days for days that don't have a specific type
    // This is needed to maintain compatibility with your CycleDay type
    const cycleStartDay = currentDate
    const nextCycleStartDay = addDays(currentDate, cycleLength)

    for (let i = 0; i < cycleLength; i++) {
      const currentCycleDay = addDays(cycleStartDay, i)

      // Skip if this day already has a type
      if (
        !cycleDays.some((d) => isSameDay(parseISO(d.date), currentCycleDay))
      ) {
        cycleDays.push({
          date: format(currentCycleDay, 'yyyy-MM-dd'),
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

/**
 * Validates cycle length based on user age
 * Younger users tend to have more irregular cycles
 */
function validateCycleLength(userCycleLength: number, age: number): number {
  // Default average cycle length
  const defaultCycleLength = 28

  // For very young users or unrealistic values, use safer defaults
  if (age < 15 || userCycleLength < 21 || userCycleLength > 45) {
    return defaultCycleLength
  }

  return userCycleLength
}

/**
 * Validates period length based on user age
 */
function validatePeriodLength(userPeriodLength: number, age: number): number {
  // Default period length
  const defaultPeriodLength = 5

  // For very young users or unrealistic values, use safer defaults
  if (age < 15 || userPeriodLength < 2 || userPeriodLength > 8) {
    return defaultPeriodLength
  }

  return userPeriodLength
}

/**
 * Get the current day of the cycle
 */
export function getCurrentCycleDay(user: User): number {
  if (!user.lastPeriodStart) return 0

  const lastPeriodStart = parseISO(user.lastPeriodStart)
  const today = startOfDay(new Date())

  // Calculate days since last period started
  const daysSinceStart = differenceInDays(today, lastPeriodStart)

  // If negative, the last period is in the future (which shouldn't happen normally)
  if (daysSinceStart < 0) return 0

  // Calculate which day of the cycle we're on (1-based)
  const currentCycleDay = (daysSinceStart % user.cycleLength) + 1

  return currentCycleDay
}

/**
 * Get the current phase of the cycle
 */
export function getCurrentPhase(user: User): CyclePhase {
  const currentCycleDay = getCurrentCycleDay(user)

  // Define cycle phases
  const phases: CyclePhase[] = [
    { name: 'menstrual', startDay: 1, endDay: user.periodLength },
    {
      name: 'follicular',
      startDay: user.periodLength + 1,
      endDay: user.cycleLength - 15,
    },
    {
      name: 'ovulatory',
      startDay: user.cycleLength - 14,
      endDay: user.cycleLength - 12,
    },
    {
      name: 'luteal',
      startDay: user.cycleLength - 11,
      endDay: user.cycleLength,
    },
  ]

  // Find the current phase
  const currentPhase = phases.find(
    (phase) =>
      currentCycleDay >= phase.startDay && currentCycleDay <= phase.endDay
  )

  return currentPhase || phases[0] // Default to menstrual phase if not found
}

/**
 * Calculate the next period date
 */
export function getNextPeriodDate(user: User): Date | null {
  if (!user.lastPeriodStart) return null

  const lastPeriodStart = parseISO(user.lastPeriodStart)
  const today = startOfDay(new Date())
  const daysSinceStart = differenceInDays(today, lastPeriodStart)

  // Calculate how many days until the next period
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

/**
 * Get the fertile window dates
 */
export function getFertileWindowDates(user: User): {
  start: Date | null
  end: Date | null
} {
  if (!user.lastPeriodStart) return { start: null, end: null }

  const nextPeriodDate = getNextPeriodDate(user)
  if (!nextPeriodDate) return { start: null, end: null }

  // Fertile window is typically from 5 days before ovulation through ovulation day
  // Ovulation occurs about 14 days before the next period
  const ovulationDate = addDays(nextPeriodDate, -14)
  const fertileWindowStart = addDays(ovulationDate, -5)
  const fertileWindowEnd = ovulationDate

  return { start: fertileWindowStart, end: fertileWindowEnd }
}

/**
 * Generate a collection of health tips based on user data and current phase
 */
export function generateHealthTips(user: User): HealthTip[] {
  const currentPhase = getCurrentPhase(user)
  const age = calculateAge(user)
  const phaseName = currentPhase.name

  const tips: HealthTip[] = []

  // Base tips for all users by phase
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
