import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { updateUserLanguage } from "@/lib/storage";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
    updateUserLanguage(newLang as 'en' | 'ru');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="text-sm font-medium"
    >
      {currentLang === 'en' ? 'RU' : 'EN'}
    </Button>
  );
}
