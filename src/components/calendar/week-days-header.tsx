export default function WeekDaysHeader({ weekDays }: { weekDays: string[] }) {
  return (
    <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-neutral-600 dark:text-neutral-400 text-center">
      {weekDays.map((day, idx) => (
        <div key={idx}>{day}</div>
      ))}
    </div>
  )
}
