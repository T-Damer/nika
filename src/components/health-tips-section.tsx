import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateHealthTips, getCurrentPhase } from '@/lib/cycleCalculations'
import { User } from '@/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function HealthTipsSection({ user }: { user: User }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const tips = generateHealthTips(user)
  const currentPhase = getCurrentPhase(user)

  if (!tips.length) return null

  const displayTips = expanded
    ? tips
    : tips.filter((tip) => tip.highlighted).slice(0, 1)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium dark:text-white">{t('healthTips.title')}</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 dark:text-gray-400"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {t('healthTips.currentPhase', {
          phase: t(`phases.${currentPhase.name}`),
        })}
      </p>

      <div className="space-y-3">
        {displayTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
          >
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                {tip.title}
              </span>
              {tip.highlighted && (
                <span className="ml-2 px-1.5 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                  {t('healthTips.highlighted')}
                </span>
              )}
            </div>
            <p className="text-sm mt-1 dark:text-white">{tip.content}</p>
          </div>
        ))}
      </div>

      {tips.length > 1 && !expanded && (
        <button
          className="text-sm text-primary mt-3 font-medium"
          onClick={() => setExpanded(true)}
        >
          {t('healthTips.showMore', {
            count: tips.length - displayTips.length,
          })}
        </button>
      )}
    </div>
  )
}
