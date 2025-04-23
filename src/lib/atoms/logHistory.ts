import { storeVersion } from '@/lib/atoms/atomStore'
import { FiveStars } from '@/types/FiveStars'
import { atomWithStorage } from 'jotai/utils'

export const commonSymptoms = [
  'cramps',
  'headache',
  'bloating',
  'backPain',
  'breastTenderness',
  'acne',
  'fatigue',
  'cravings',
  'nausea',
  'spotting',
]

export const commonMoods = [
  'happy',
  'calm',
  'anxious',
  'irritable',
  'sad',
  'emotional',
  'energetic',
  'tired',
  'motivated',
  'unmotivated',
]

export interface LogEntry {
  flowIntensity: FiveStars | number
  padsUsed: number
  painIntensity: FiveStars | number
  symptoms: typeof commonSymptoms
  mood: typeof commonMoods
}
export interface LogHistory {
  [data: string]: LogEntry
}

export const logHistoryVersionedKey = `logHistory-${storeVersion}`

export default atomWithStorage<LogHistory>(
  logHistoryVersionedKey,
  {},
  undefined,
  { getOnInit: true }
)
