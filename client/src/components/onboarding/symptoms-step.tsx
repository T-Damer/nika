import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface SymptomsStepProps {
  initialValues: string[];
  onNext: (symptoms: string[]) => void;
  onBack: () => void;
}

export function SymptomsStep({ initialValues, onNext, onBack }: SymptomsStepProps) {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialValues);
  
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selectedSymptoms);
  };
  
  const commonSymptoms = [
    'cramps', 'headache', 'bloating', 'backPain', 
    'breastTenderness', 'acne', 'fatigue', 'cravings', 
    'nausea', 'spotting'
  ];
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">{t('symptomsStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">{t('symptomsStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {commonSymptoms.map(symptom => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox 
                  id={symptom} 
                  checked={selectedSymptoms.includes(symptom)}
                  onCheckedChange={() => toggleSymptom(symptom)}
                />
                <label 
                  htmlFor={symptom}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`symptoms.${symptom}`)}
                </label>
              </div>
            ))}
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
  );
}
