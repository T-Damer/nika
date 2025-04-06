import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface CompleteStepProps {
  onComplete: () => void;
}

export function CompleteStep({ onComplete }: CompleteStepProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="mb-8 bg-primary-light p-4 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="font-heading font-bold text-2xl mb-3">{t('completeStep.title')}</h2>
      <p className="text-neutral-800 mb-8 max-w-xs">{t('completeStep.subtitle')}</p>
      
      <div className="w-full max-w-xs">
        <Button 
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition"
          onClick={onComplete}
        >
          {t('completeStep.goToDashboard')}
        </Button>
      </div>
    </div>
  );
}
