import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface DietStepProps {
  initialValues: string[];
  onNext: (diet: string[]) => void;
  onBack: () => void;
}

export function DietStep({ initialValues, onNext, onBack }: DietStepProps) {
  const { t } = useTranslation();
  const [selectedDiets, setSelectedDiets] = useState<string[]>(initialValues);
  
  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter(d => d !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selectedDiets);
  };
  
  const dietTypes = [
    'omnivore', 'vegetarian', 'vegan', 'pescatarian', 
    'paleo', 'keto', 'lowCarb', 'glutenFree', 
    'dairyFree', 'intermittentFasting'
  ];
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">{t('dietStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">{t('dietStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {dietTypes.map(diet => (
              <div key={diet} className="flex items-center space-x-2">
                <Checkbox 
                  id={diet} 
                  checked={selectedDiets.includes(diet)}
                  onCheckedChange={() => toggleDiet(diet)}
                />
                <label 
                  htmlFor={diet}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`dietTypes.${diet}`)}
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
