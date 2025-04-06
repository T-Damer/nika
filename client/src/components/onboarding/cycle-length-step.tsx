import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CycleLengthStepProps {
  initialValue: number;
  onNext: (length: number) => void;
  onBack: () => void;
}

export function CycleLengthStep({ initialValue, onNext, onBack }: CycleLengthStepProps) {
  const { t } = useTranslation();
  const [cycleLength, setCycleLength] = useState(initialValue);
  
  const incrementCycleLength = () => {
    if (cycleLength < 50) {
      setCycleLength(cycleLength + 1);
    }
  };
  
  const decrementCycleLength = () => {
    if (cycleLength > 20) {
      setCycleLength(cycleLength - 1);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(cycleLength);
  };
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h2 className="font-heading font-bold text-2xl mb-6">{t('cycleLengthStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs">{t('cycleLengthStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="flex items-center justify-between mb-6">
          <button 
            type="button"
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-primary font-bold"
            onClick={decrementCycleLength}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <span className="text-4xl font-bold text-primary">{cycleLength}</span>
            <p className="text-neutral-600">{t('common.days')}</p>
          </div>
          
          <button 
            type="button"
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-primary font-bold"
            onClick={incrementCycleLength}
          >
            <Plus className="w-4 h-4" />
          </button>
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
