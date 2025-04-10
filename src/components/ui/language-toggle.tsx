import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { updateUserLanguage } from '@/lib/storage'
import { useUser } from '@/contexts/user-context'

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const { user, updateUser } = useUser()
  const [currentLang, setCurrentLang] = useState(i18n.language)

  // Sync component state with i18n current language
  useEffect(() => {
    setCurrentLang(i18n.language)
  }, [i18n.language])

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ru' : 'en'

    // Update i18n
    i18n.changeLanguage(newLang)

    // Update component state
    setCurrentLang(newLang)

    // Update user preferences in context and localStorage
    updateUser({
      preferences: {
        ...user.preferences,
        language: newLang as 'en' | 'ru',
      },
    })

    // Also update through the dedicated function as a backup
    updateUserLanguage(newLang as 'en' | 'ru')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-sm font-medium"
      aria-label={`Switch language to ${
        currentLang === 'en' ? 'Russian' : 'English'
      }`}
    >
      {currentLang === 'en' ? 'RU' : 'EN'}
    </Button>
  )
}
