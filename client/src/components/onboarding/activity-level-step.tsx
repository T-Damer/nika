import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ActivityLevelStepProps {
  initialValue: string;
  onNext: (activityLevel: string) => void;
  onBack: () => void;
}

export function ActivityLevelStep({ initialValue, onNext, onBack }: ActivityLevelStepProps) {
  const { t } = useTranslation();
  const [activityLevel, setActivityLevel] = useState(initialValue);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(activityLevel);
  };
  
  const activityLevels = [
    'sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extremelyActive'
  ];
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">{t('activityLevelStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">{t('activityLevelStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
          <RadioGroup value={activityLevel} onValueChange={setActivityLevel}>
            {activityLevels.map(level => (
              <div key={level} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={level} id={level} />
                <Label htmlFor={level}>
                  <div>
                    <div className="font-medium">{t(`activityLevels.${level}.title`)}</div>
                    <div className="text-xs text-neutral-600">{t(`activityLevels.${level}.description`)}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
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
  );
}
