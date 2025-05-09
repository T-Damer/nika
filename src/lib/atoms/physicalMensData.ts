import { storeVersion } from '@/lib/atoms/atomStore'
import { atomWithStorage } from 'jotai/utils'

const sportDiet = [
  'Нет',
  'Ограничиваю калорийность пищи',
  'Диета с высоким содержанием белком',
  'Другая диета',
]

const cycleEstablish = [
  'Сразу',
  'Через 6 месяцев',
  'Через 1 год',
  'Через 2 год и более',
]

const mensFlowChange = ['Не менялись', 'Увеличивались', 'Уменьшались']

const activityChange = [
  'Нет',
  'Немного снижается',
  'Умеренно снижается',
  'Значительно снижается',
]

const sexRate = [
  'Не веду',
  'Несколько раз в год',
  'Несколько раз в месяц',
  '1-2 раза в неделю',
  '3-4 раза в неделю',
  '1 раз в день',
  'Несколько раз в день',
]
const painControlMethod = [
  'Терплю',
  'Прпнимаю лекарства при сильной боли',
  'Всегда принимаю лекарства',
  'Другое',
]
const painControlPersons = [
  'Врач',
  'Фармацевт',
  'Реклама',
  'Друзья',
  'Личный опыт',
  'Другое',
]
const painRelieveEffectiveness = [
  'Боль исчезла',
  'Уменьшилась',
  'Заглушилась',
  'Эффекта нет',
]

export const physicalMensInputs: Record<
  string,
  {
    title: string
    type?: 'number' | 'string'
    options?: string[]
    defaultValue?: number | string
    min?: number
    max?: number
    step?: number
  }
> = {
  weightChange3Years: {
    title:
      'Менялся ли Ваш вес за последние 3 года (отрицательное число, если вес снизилизся)',
    type: 'number',
    defaultValue: 0,
    step: 1,
  },
  sportType: { title: 'Каким спортом занимаетесь?  Спортивное звание' },
  sportLength: {
    title: 'Сколько лет занимаетесь спортом',
    type: 'number',
    defaultValue: 0,
    min: 0,
    step: 1,
  },
  sportYear: {
    title: 'С какого возраста заниматесь спортом',
    type: 'number',
    defaultValue: 0,
    min: 0,
    step: 1,
  },
  repeatsPerWeek: {
    title: 'Сколько раз в неделю',
    type: 'number',
    defaultValue: 0,
    min: 0,
  },
  hoursPerRepeat: {
    title: 'По сколько часов',
    type: 'number',
    defaultValue: 0,
    min: 0,
  },
  diet: {
    title: 'Соблюдаете спортивную диету?',
    type: 'string',
    options: sportDiet,
    defaultValue: sportDiet[0],
  },
  physicalIntensity: {
    title: 'Оцените спортвную нагрузку по 10-бальной шкале',
    type: 'number',
    min: 1,
    max: 10,
    step: 1,
  },
  sportEffect: {
    title:
      'Замечаете ли Вы, что занятия спортом оказывают влияние на общее состояние организма? Какое?',
    type: 'string',
  },
  mensStartAge: {
    title: 'С какого возраста начались менструации?',
    type: 'number',
    min: 4,
    step: 1,
  },
  cycleEstablish: {
    title: 'Как быстро установился менструальный цикл?',
    type: 'string',
    options: cycleEstablish,
    defaultValue: cycleEstablish[0],
  },
  heavyMensDays: {
    title: 'Сколько дней метструации Вы отмечаете как обильные?',
    type: 'number',
    min: 0,
    step: 1,
  },
  padsChangesPerDay: {
    title: 'Сколько раз в сутки вы меняете прокладки?',
    type: 'number',
    min: 0,
    step: 1,
  },
  bloodDropsPerPad: {
    title: 'На сколько капель используете прокладку?',
    type: 'number',
    min: 0,
    step: 1,
  },
  mensFlowChangePerLife: {
    title: 'Менялась ли интенсивность менструации на протяжении Вашей жизни?',
    type: 'string',
    options: mensFlowChange,
    defaultValue: mensFlowChange[0],
  },
  mensFlowChangePerSport: {
    title: 'Меняется ли Ваш менструальный  цикл на фоне занятий спортом?',
    type: 'string',
    options: mensFlowChange,
    defaultValue: mensFlowChange[0],
  },
  activityChangePerMens: {
    title: 'Меняется ли Ваша физическая активность во время менструации?',
    options: activityChange,
    defaultValue: activityChange[0],
  },
  sexIntensity: {
    title: 'Интенсивность половой жизни',
    options: sexRate,
    defaultValue: sexRate[0],
  },
  gaveBirth: { title: 'Были ли у вас роды?', type: 'string' },
  aborts: { title: 'Были ли у вас аборты?', type: 'string' },
  painIntensityChange: {
    title: '  Менялась ли интенсивность боли при менструации в течение жизни?',
    options: mensFlowChange,
  },
  painActivityChange: {
    title: 'Изменился ли характер боли на фоне занятий спортом?',
    options: mensFlowChange,
  },
  painRelieveMethod: {
    title: 'Что Вы делаете для облегчения болей в менструацию?',
    options: painControlMethod,
  },
  painRelieveDrugs: {
    title: 'Какие препараты Вы используете для облегчения боли?',
  },
  painRelieveMethodAffectedBy: {
    title: 'Кто оказал влияние на выбор препаратата для снятия боли',
    options: painControlPersons,
  },
  painRelieveMethodEffectivness: {
    title: 'Как Вы оцениваете эффективность принимаегого препарата',
    options: painRelieveEffectiveness,
  },
  painRelieveSideEffects: {
    title: 'Отмечаете ли Вы побочные эффекты от принимаемых препаратов',
    options: [
      'Не отмечаю',
      'Головные боли',
      'Тошнота',
      'Понос',
      'Аллергии',
      'Дургие',
    ],
  },
  painRelieveImportance: {
    title:
      'Что важно для Вас при выборе лекарственного препарата для облегчения менструальных болей',
    options: [
      'цена',
      'эффективность',
      'положительные отзывы знакомых',
      'реклама',
      'удобство применения',
      'известность производителя',
      'другое',
    ],
  },
  drugCountryOrigin: {
    title:
      'Обращаете ли Вы при выборе препарата внимание  на  страну-производителя',
    options: ['Нет', 'Лучше импортное', 'Лучше отечественное'],
  },
  drugPrice: {
    title: 'Важна ли для Вас цена препарата',
    options: ['Нет', 'Покупаю дешевые', 'Покупаю дорогие', 'По-разному'],
  },
  drugReplace: {
    title:
      'Если в аптеке нет обычно используемого препарата, заменяете ли его другим?',
    options: ['Не заменяю', 'Заменяю', 'Ищу в других аптеках'],
  },
}

export type PhysicalQuestionaryStore = Record<string, string | number>

export default atomWithStorage<PhysicalQuestionaryStore>(
  `questionary-physical-${storeVersion}`,
  {},
  undefined,
  { getOnInit: true }
)
