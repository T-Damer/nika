import { enUS, ru } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

export default function useLocale() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'ru' ? ru : enUS

  return { t, locale }
}
