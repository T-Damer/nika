import { LogHistory } from '@/lib/atoms/logHistory'
import { QuestionaryStore } from '@/lib/atoms/questionaryData'
import { User } from '@/types'
import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'

const localTranslations: Record<string, string> = {
  name: 'Имя',
  birthDay: 'День рождения',
  birthMonth: 'Месяц рождения',
  birthYear: 'Год рождения',
  age: 'Возраст',
  lastPeriodStart: 'Дата начала последней менструации',
  cycleLength: 'Длительность цикла',
  periodLength: 'Длительность менструации',
  symptoms: 'Симптомы',
  mood: 'Настроение',
  contraception: 'Контрацепция',
  goals: 'Цели использования приложения',
  activityLevel: 'Уровень активности',
  sleepPatterns: 'Продолжительность сна (часов)',
  diet: 'Диета',
  stressLevel: 'Уровень стресса',
  medicalConditions: 'Заболевания',
  medications: 'Принимаемые препараты',

  date: 'Дата',
  flowIntensity: 'Обильность выделений (от 0 до 4)',
  padsUsed: 'Использовано прокладок',
  painIntensity: 'Интенсивность болей',

  sedentary: 'Малоподвижный',
  lightlyActive: 'Легкая активность',
  moderatelyActive: 'Умеренная активност',
  veryActive: 'Высокая активность',
  extremelyActive: 'Очень высокая активность',

  lessThan6: '<6',
  between6And7: '6-7',
  between7And8: '7-8',
  between8And9: '8-9',
  moreThan9: '>9',

  omnivore: 'Всеядная',
  vegetarian: 'Вегетарианская',
  vegan: 'Веганская',
  pescatarian: 'Пескатарианcкая',
  paleo: 'Палео',
  keto: 'Кето',
  lowCarb: 'С низким содержанием углеводов',
  glutenFree: 'Безглютеновая',
  dairyFree: 'Безмолочная',
  intermittentFasting: 'Интервальное голодание',

  none: 'Нет',
  pcos: 'СПКЯ',
  endometriosis: 'Эндометриоз',
  fibroids: 'Миома',
  thyroidDisorders: 'Заболевания щитовидной железы',
  diabetes: 'Диабет',
  hypertension: 'Гипертония',
  depression: 'Депрессия',
  anxiety: 'Тревожность',

  birthControlPill: 'Противозачаточные таблетки',
  antidepressants: 'Антидепрессанты',
  painMedication: 'Обезболивающие',
  antiAnxiety: 'Противотревожные препараты',
  thyroidMedication: 'Препараты для щитовидной железы',
  antiInflammatory: 'Противовоспалительные',
  hormoneReplacement: 'Заместительная гормональная терапия',

  cramps: 'Спазмы',
  headache: 'Головная боль',
  bloating: 'Вздутие',
  backPain: 'Боль в спине',
  breastTenderness: 'Болезненность груди',
  acne: 'Акне',
  fatigue: 'Усталость',
  cravings: 'Тяга к еде',
  nausea: 'Тошнота',
  spotting: 'Выделения',

  happy: 'Счастье',
  calm: 'Спокойствие',
  anxious: 'Тревога',
  irritable: 'Раздражительность',
  sad: 'Грусть',
  emotional: 'Эмоциональность',
  energetic: 'Энергичность',
  tired: 'Усталость',
  motivated: 'Мотивация ',
  unmotivated: 'Отсутствие мотивации',

  trackPeriod: 'Отслеживать менструацию',
  becomePregnant: 'Забеременеть',
  monitorHealth: 'Контролировать здоровье',
  trackSymptoms: 'Отслеживать симптомы',
  managePMS: 'Управлять ПМС',
  improveWellbeing: 'Улучшить общее благополучие',

  your: 'Ваши заболевания',
  mother: 'Мамы',
  grandmotherMa: 'Бабушки (мама)',
  grandmotherPa: 'Бабушки (папа)',
  sisters: 'Родных сестер',
  cousins: 'Двоюродных сестер',
  aunt: 'Тети',

  color: 'Цвет',
  consistency: 'Консистентность',
  smell: 'Запах',
}

const formatDate = (dateString: string | Date): string => {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return String(dateString) // Return original if invalid date

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const flattenObject = (
  obj: any,
  prefix = '',
  translateKeys = true,
  translateValues = true
): Record<string, any> => {
  const filter = ['preferences', 'onboardingCompleted']
  const dateKeys = ['date', 'lastPeriodStart'] // Add other date field keys here

  return Object.keys(obj).reduce(
    (acc, key) => {
      if (filter.some((el) => el.includes(key))) {
        return acc
      }

      const prefixedKey = prefix ? `${prefix}.${key}` : key
      const translatedKey =
        translateKeys && localTranslations[key]
          ? localTranslations[key]
          : prefixedKey

      const value = obj[key]

      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        Object.assign(
          acc,
          flattenObject(value, translatedKey, translateKeys, translateValues)
        )
      } else {
        // Handle date formatting first
        let processedValue = value
        if (dateKeys.includes(key.toLowerCase())) {
          processedValue = formatDate(value)
        }

        // Then handle value translation if not a date
        let translatedValue = processedValue
        if (
          translateValues &&
          processedValue !== null &&
          processedValue !== undefined &&
          !dateKeys.includes(key.toLowerCase())
        ) {
          if (Array.isArray(processedValue)) {
            translatedValue = processedValue
              .map((v) => localTranslations[v] || v)
              .join(', ')
          } else {
            translatedValue =
              localTranslations[processedValue] || processedValue
          }
        }

        acc[translatedKey] = translatedValue
      }
      return acc
    },
    {} as Record<string, any>
  )
}

export default function exportUserData(
  fileName: string,
  user: User,
  logHistory?: LogHistory,
  questionnaire?: QuestionaryStore
) {
  const workbook = utils.book_new()

  const flatUser = flattenObject(user, '', true, true)
  utils.book_append_sheet(
    workbook,
    utils.json_to_sheet([flatUser]),
    'Данные Пациентки'
  )

  if (logHistory) {
    const logEntries = Object.entries(logHistory).map(([date, entry]) => {
      const translatedEntry = flattenObject(entry, '', true, true)
      return {
        [localTranslations['date'] || 'date']: formatDate(date), // Format the main date key
        ...translatedEntry,
      }
    })

    utils.book_append_sheet(
      workbook,
      utils.json_to_sheet(logEntries),
      'Записи о Менструации'
    )
  }

  if (questionnaire) {
    const flatQuestionnaire = flattenObject(questionnaire, '', true, true)
    utils.book_append_sheet(
      workbook,
      utils.json_to_sheet([flatQuestionnaire]),
      'Семейный Анамнез'
    )
  }

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer]), `${fileName}.xlsx`, { autoBom: true })
}
