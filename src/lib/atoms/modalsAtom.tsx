import PhysicalFormModal from '@/components/Modals/PhysicalFormModal'
import QuestionaryModal from '@/components/Modals/QuestionaryModal'
import { atom } from 'jotai'

export const modalDismissibleAtom = atom(true)

export enum AvailableModals {
  questionary,
  physical,
}

export const modalToComponent = {
  [AvailableModals.questionary]: { component: QuestionaryModal },
  [AvailableModals.physical]: { component: PhysicalFormModal },
}

export default atom<AvailableModals | null>(null)
