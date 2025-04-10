import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface PreferencesStepProps {
  initialValues: {
    notifications: boolean
    theme: 'light' | 'dark' | 'system'
  }
  onNext: (preferences: {
    notifications: boolean
    theme: 'light' | 'dark' | 'system'
  }) => void
  onBack: () => void
}

export function PreferencesStep({
  initialValues,
  onNext,
  onBack,
}: PreferencesStepProps) {
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState(initialValues)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(preferences)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">
        {t('preferencesStep.title')}
      </h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">
        {t('preferencesStep.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">
                  {t('preferences.notifications')}
                </Label>
                <p className="text-sm text-neutral-600">
                  {t('preferences.notificationsDescription')}
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, notifications: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="space-y-0.5">
                <Label>{t('preferences.theme')}</Label>
                <p className="text-sm text-neutral-600">
                  {t('preferences.themeDescription')}
                </p>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="themeSystem"
                    name="theme"
                    value="system"
                    checked={preferences.theme === 'system'}
                    onChange={() =>
                      setPreferences({ ...preferences, theme: 'system' })
                    }
                    className="h-4 w-4 text-primary"
                  />
                  <Label
                    htmlFor="themeSystem"
                    className="text-sm font-normal cursor-pointer"
                  >
                    {t('preferences.themeSystem')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="themeLight"
                    name="theme"
                    value="light"
                    checked={preferences.theme === 'light'}
                    onChange={() =>
                      setPreferences({ ...preferences, theme: 'light' })
                    }
                    className="h-4 w-4 text-primary"
                  />
                  <Label
                    htmlFor="themeLight"
                    className="text-sm font-normal cursor-pointer"
                  >
                    {t('preferences.themeLight')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="themeDark"
                    name="theme"
                    value="dark"
                    checked={preferences.theme === 'dark'}
                    onChange={() =>
                      setPreferences({ ...preferences, theme: 'dark' })
                    }
                    className="h-4 w-4 text-primary"
                  />
                  <Label
                    htmlFor="themeDark"
                    className="text-sm font-normal cursor-pointer"
                  >
                    {t('preferences.themeDark')}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition"
        >
          {t('common.continue')}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full mt-3 text-neutral-800 font-medium py-2 px-6 rounded-full hover:bg-neutral-100 transition"
          onClick={onBack}
        >
          {t('common.back')}
        </Button>
      </form>
    </div>
  )
}
