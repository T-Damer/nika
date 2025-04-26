import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from '../locales/en.json'
import ruTranslation from '../locales/ru.json'

const resources = {
  ru: {
    translation: ruTranslation,
  },
  en: {
    translation: enTranslation,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
