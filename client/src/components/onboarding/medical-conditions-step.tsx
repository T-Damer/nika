import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface MedicalConditionsStepProps {
  initialValues: string[];
  onNext: (conditions: string[]) => void;
  onBack: () => void;
}

export function MedicalConditionsStep({ initialValues, onNext, onBack }: MedicalConditionsStepProps) {
  const { t } = useTranslation();
  const [selectedConditions, setSelectedConditions] = useState<string[]>(initialValues);
  const [customCondition, setCustomCondition] = useState('');
  
  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };
  
  const addCustomCondition = () => {
    if (customCondition.trim() && !selectedConditions.includes(customCondition.trim())) {
      setSelectedConditions([...selectedConditions, customCondition.trim()]);
      setCustomCondition('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selectedConditions);
  };
  
  const commonConditions = [
    'none', 'pcos', 'endometriosis', 'fibroids', 
    'thyroidDisorders', 'diabetes', 'hypertension', 'depression', 'anxiety'
  ];
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">{t('medicalConditionsStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">{t('medicalConditionsStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {commonConditions.map(condition => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox 
                  id={condition} 
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                />
                <label 
                  htmlFor={condition}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`medicalConditions.${condition}`)}
                </label>
              </div>
            ))}
            
            {/* Custom conditions that were added */}
            {selectedConditions
              .filter(condition => !commonConditions.includes(condition))
              .map(condition => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox 
                    id={condition} 
                    checked={true}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <label 
                    htmlFor={condition}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {condition}
                  </label>
                </div>
              ))
            }
            
            {/* Add custom condition */}
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="text"
                placeholder={t('medicalConditionsStep.customPlaceholder')}
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                className="text-sm"
              />
              <Button 
                type="button" 
                size="sm"
                onClick={addCustomCondition}
              >
                {t('common.add')}
              </Button>
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
  );
}
