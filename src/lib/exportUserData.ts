import { User } from '@/types'
import { saveAs } from 'file-saver'
import { utils, write } from 'xlsx'
import { LogEntry, LogHistory } from '../atoms/logHistory'
import { QuestionaryStore } from '../atoms/questionaryData'

// Helper to flatten objects and handle arrays
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

// Convert a single log entry to a flat object with date prefix
const processLogEntry = (date: string, entry: LogEntry) => {
  const flatEntry = flattenObject(entry)
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(flatEntry)) {
    result[`log.${date}.${key}`] = value
  }

  return result
}

export default function exportUserData(
  fileName: string,
  user: User,
  logHistory?: LogHistory,
  questionnaire?: QuestionaryStore
) {
  const workbook = utils.book_new()

  const flatUser = flattenObject(user)
  utils.book_append_sheet(
    workbook,
    utils.json_to_sheet([flatUser]),
    'User Profile'
  )

  if (logHistory) {
    const logEntries = Object.entries(logHistory).map(([date, entry]) => ({
      date,
      ...flattenObject(entry),
    }))

    utils.book_append_sheet(
      workbook,
      utils.json_to_sheet(logEntries),
      'Period Logs'
    )
  }

  if (questionnaire) {
    const flatQuestionnaire = flattenObject(questionnaire)
    utils.book_append_sheet(
      workbook,
      utils.json_to_sheet([flatQuestionnaire]),
      'Family History'
    )
  }

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer]), `${fileName}.xlsx`, { autoBom: true })
}
