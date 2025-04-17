import { useTranslation } from 'react-i18next'

export function CalendarLegend() {
  const { t } = useTranslation()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 flex justify-between flex-wrap">
      <div className="flex items-center mr-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
        <span className="text-sm">{t('calendar.period')}</span>
      </div>
      <div className="flex items-center mr-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-accent mr-1"></div>
        <span className="text-sm">{t('calendar.ovulation')}</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-3 h-3 rounded-full bg-success mr-1"></div>
        <span className="text-sm">{t('calendar.fertile')}</span>
      </div>
    </div>
  )
}
