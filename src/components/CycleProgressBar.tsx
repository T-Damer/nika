import { getCurrentPhase, getCurrentCycleDay } from '@/lib/cycleCalculations'
import { User } from '@/types'
import InsightsData from '@/types/InsightsData'
import { useTranslation } from 'react-i18next'

export default function CycleProgressBar({
  user,
  phases,
}: {
  user: User
  phases: InsightsData[]
}) {
  const { t } = useTranslation()
  const currentPhase = getCurrentPhase(user)
  const currentCycleDay = getCurrentCycleDay(user)
  const phasesData = phases.map((phase) => {
    const phaseDuration = phase.endDay - phase.startDay + 1
    const phaseWidth = (phaseDuration / user.cycleLength) * 100
    const phaseStart = ((phase.startDay - 1) / user.cycleLength) * 100

    return {
      phaseWidth,
      phaseStart,
      name: phase.name,
      className: phase.className,
    }
  })

  return (
    <div className="p-1">
      <div className="relative h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
        {phasesData.map(({ phaseStart, phaseWidth, name, className }) => (
          <div
            key={name}
            className={`absolute top-0 bottom-0 ${className}`}
            style={{
              left: `${phaseStart}%`,
              width: `${phaseWidth}%`,
            }}
          />
        ))}

        {/* Current day indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-md"
          style={{
            left: `${((currentCycleDay - 1) / user.cycleLength) * 100}%`,
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        />
      </div>

      <div className="flex flex-wrap justify-between gap-2 items-center text-xs">
        {phasesData.map(({ name, className }) => (
          <div
            key={name}
            className={`w-fit sm:w-1/3 flex gap-x-1 ${currentPhase.name === name ? 'font-bold' : ''}`}
          >
            <div className={`h-4 w-4 rounded-sm ${className}`} />
            <span className="dark:text-white">{t(`phases.${name}Short`)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
