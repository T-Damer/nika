import { storeVersion } from '@/lib/atoms/atomStore'
import { FiveStars } from '@/types/FiveStars'
import {
  MensColorValues,
  MensConsistencyValues,
  MensSmellValues,
} from '@/types/Log'
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
  color: MensColorValues
  consistency: MensConsistencyValues
  smell: MensSmellValues
  padsUsed: number
  painIntensity: FiveStars | number
  symptoms: typeof commonSymptoms
  mood: typeof commonMoods
}
export interface LogHistory {
  [data: string]: LogEntry
}

export default atomWithStorage<LogHistory>(
  `logHistory-${storeVersion}`,
  {},
  undefined,
  { getOnInit: true }
)
