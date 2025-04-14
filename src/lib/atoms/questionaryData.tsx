import { storeVersion } from '@/lib/atoms/atomStore'
import { atomWithStorage } from 'jotai/utils'

export interface QuestionaryStore {
  your: string
  mother: string
  grandmotherMa: string
  grandmotherPa: string
  sisters: string
  cousins: string
  aunt: string
}

export const defaultQuestionary = {
  your: '',
  mother: '',
  grandmotherMa: '',
  grandmotherPa: '',
  sisters: '',
  cousins: '',
  aunt: '',
}

export type QuestionaryKeys = keyof QuestionaryStore

export default atomWithStorage<QuestionaryStore>(
  `questionary-${storeVersion}`,
  defaultQuestionary,
  undefined,
  { getOnInit: true }
)
