import { User } from '@/types'

export default function CycleProgressBar({
  userData,
  currentDay,
}: {
  userData: User
  currentDay: number
}) {
  const periodPercentage = (userData.periodLength / userData.cycleLength) * 100
  const currentPercentage = (currentDay / userData.cycleLength) * 100
  const ovulationPosition =
    ((userData.cycleLength - 14) / userData.cycleLength) * 100
  const fertileWindowStart =
    ((userData.cycleLength - 19) / userData.cycleLength) * 100
  const fertileWindowWidth = (6 / userData.cycleLength) * 100

  return (
    <div className="flex h-3 rounded-full overflow-hidden">
      <div
        className="bg-success"
        style={{
          width: `${fertileWindowWidth}%`,
          marginLeft: `${fertileWindowStart - periodPercentage}%`,
        }}
      ></div>

      <div
        className="brand-gradient rounded-l-full"
        style={{ width: `${periodPercentage}%` }}
      />

      <div
        className="bg-secondary"
        style={{
          width: '2%',
          marginLeft: `${
            ovulationPosition -
            fertileWindowStart -
            fertileWindowWidth -
            periodPercentage
          }%`,
        }}
      ></div>

      {/* Remaining days */}
      <div
        className="bg-neutral-200 dark:bg-gray-600 rounded-r-full"
        style={{
          width: `${100 - Math.max(currentPercentage, periodPercentage)}%`,
        }}
      ></div>
    </div>
  )
}
