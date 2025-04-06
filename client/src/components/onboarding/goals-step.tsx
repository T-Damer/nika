import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface GoalsStepProps {
  initialValues: string[];
  onNext: (goals: string[]) => void;
  onBack: () => void;
}

export function GoalsStep({ initialValues, onNext, onBack }: GoalsStepProps) {
  const { t } = useTranslation();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialValues);
  
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selectedGoals);
  };
  
  const commonGoals = [
    'trackPeriod', 'predictFertility', 'becomePregnant', 
    'avoidPregnancy', 'monitorHealth', 'trackSymptoms', 
    'managePMS', 'improveWellbeing'
  ];
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">{t('goalsStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">{t('goalsStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {commonGoals.map(goal => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox 
                  id={goal} 
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={() => toggleGoal(goal)}
                />
                <label 
                  htmlFor={goal}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`goals.${goal}`)}
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
