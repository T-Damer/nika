import { LogHistory } from '@/lib/atoms/logHistory'
import { QuestionaryStore } from '@/lib/atoms/questionaryData'
import i18n from '@/lib/i18n'
import { User } from '@/types'
import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'

const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const prefixedKey = prefix ? `${prefix}.${key}` : key
      if (
        typeof obj[key] === 'object' &&
        !Array.isArray(obj[key]) &&
        obj[key] !== null
      ) {
        Object.assign(acc, flattenObject(obj[key], prefixedKey))
      } else {
        acc[prefixedKey] = obj[key]
      }
      return acc
    },
    {} as Record<string, any>
  )
}

const translateKeys = (rec: Record<string, any>): Record<string, any> =>
  Object.entries(rec).reduce(
    (acc, [rawKey, value]) => {
      const label = i18n.t(rawKey, { defaultValue: rawKey })
      acc[label] = value
      return acc
    },
    {} as Record<string, any>
  )

export default function exportUserData(
  fileName: string,
  user: User,
  logHistory?: LogHistory,
  questionnaire?: QuestionaryStore
) {
  const workbook = utils.book_new()

  const flatUser = flattenObject(user)
  const filteredUser = Object.fromEntries(
    Object.entries(flatUser).filter(
      ([key]) =>
        !key.startsWith('preferences.') && key !== 'onboardingCompleted'
    )
  )
  const translatedUser = translateKeys(filteredUser)

  utils.book_append_sheet(
    workbook,
    utils.json_to_sheet([translatedUser]),
    'Пациент'
  )

  if (logHistory) {
    const logEntries = Object.entries(logHistory).map(([date, entry]) => ({
      date,
      ...flattenObject(entry),
    }))

    utils.book_append_sheet(
      workbook,
      utils.json_to_sheet(logEntries),
      'Отметки о цикле'
    )
  }

  if (questionnaire) {
    const flatQuestionnaire = flattenObject(questionnaire)
    utils.book_append_sheet(
      workbook,
      utils.json_to_sheet([flatQuestionnaire]),
      'Генеалогия'
    )
  }

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer]), `${fileName}.xlsx`, { autoBom: true })
}
