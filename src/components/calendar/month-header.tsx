import { format, Locale } from 'date-fns'

export default function MonthHeader({
  month,
  locale,
}: {
  month: Date
  locale: Locale
}) {
  return (
    <span className="inline-flex font-3xl mt-2 mb-6 dark:text-white">
      {format(month, 'LLL yyyy', { locale })}
    </span>
  )
}
