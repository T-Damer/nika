export const mensColor = {
  no: 'Нет',
  red: 'Красный',
  yellowGreen: 'Желто-зеленый',
  white: 'Белый',
  brown: 'Коричневый',
} as const

export type MensColorTypes = keyof typeof mensColor
export type MensColorValues = (typeof mensColor)[MensColorTypes]

export const mensConsistency = {
  no: 'Нет',
  creamy: 'Кремовые',
  curdy: 'Творожистые',
  slimy: 'Слизистые',
}

export type MensConsistencyKeys = keyof typeof mensConsistency
export type MensConsistencyValues =
  (typeof mensConsistency)[MensConsistencyKeys]

export const mensSmell = {
  no: 'Нет',
  fishy: 'Рыбный',
  unpleasant: 'Неприятный',
}

export type MensSmellKeys = keyof typeof mensSmell
export type MensSmellValues = (typeof mensSmell)[MensSmellKeys]
