import QuestionaryModal from '@/components/Modals/QuestionaryModal'
import { atom } from 'jotai'

export const modalDismissibleAtom = atom(true)

export enum AvailableModals {
  questionary,
}

export const modalToComponent = {
  [AvailableModals.questionary]: { component: QuestionaryModal },
}

export default atom<AvailableModals | null>(null)
