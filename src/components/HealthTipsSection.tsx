import { useUser } from '@/contexts/user-context'
import { t } from 'i18next'
import { HealthTipCard } from '@/components/HealthTipCard'
import { Eye } from 'lucide-react'
import useInsights from '@/hooks/useInsights'

export default function HealthTipsSection() {
  const { user } = useUser()
  const { healthTips } = useInsights({ user })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <span className="font-heading font-semibold text-lg dark:text-white">
          {t('healthTips.title')}
        </span>
        <a className="text-primary text-sm font-medium" href="'/insights'">
          <Eye />
        </a>
      </div>

      <div className="space-y-4">
        {healthTips.map((tip) => (
          <HealthTipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </div>
  )
}
