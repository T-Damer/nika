import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <div className="mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <h1 className="font-heading font-bold text-3xl mb-3 text-primary">{t('welcome.title')}</h1>
      <p className="text-neutral-800 mb-8 max-w-xs">{t('welcome.subtitle')}</p>
      
      <div className="w-full max-w-xs">
        <Button 
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition"
          onClick={onNext}
        >
          {t('welcome.getStarted')}
        </Button>
        
        <Button
          variant="ghost"
          className="w-full mt-3 text-primary font-medium py-2 px-6 rounded-full hover:bg-primary-light transition"
          onClick={onSkip}
        >
          {t('welcome.alreadyHaveAccount')}
        </Button>
      </div>
      
      <p className="mt-8 text-xs text-neutral-600 max-w-xs">
        {t('welcome.termsNotice')} <a href="#" className="text-primary">{t('welcome.termsLink')}</a> {t('welcome.and')} <a href="#" className="text-primary">{t('welcome.privacyLink')}</a>
      </p>
    </div>
  );
}
