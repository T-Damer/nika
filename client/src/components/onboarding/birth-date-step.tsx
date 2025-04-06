import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BirthDateStepProps {
  initialDay: string;
  initialMonth: string;
  initialYear: string;
  onNext: (day: string, month: string, year: string) => void;
  onBack: () => void;
}

export function BirthDateStep({ initialDay, initialMonth, initialYear, onNext, onBack }: BirthDateStepProps) {
  const { t } = useTranslation();
  const [day, setDay] = useState(initialDay);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(day, month, year);
  };
  
  // Generate days 1-31
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  
  // Generate years (from current year - 10 to current year - 60)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - 10 - i).toString());
  
  // Generate months (using translation for localization)
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  const isFormValid = day && month && year;
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h2 className="font-heading font-bold text-2xl mb-6">{t('birthDateStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs">{t('birthDateStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="flex gap-2 mb-6">
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl">
              <SelectValue placeholder={t('birthDateStep.day')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {days.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl">
              <SelectValue placeholder={t('birthDateStep.month')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {months.map(m => (
                  <SelectItem key={m} value={m}>{t(`months.${parseInt(m) - 1}`)}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl">
              <SelectValue placeholder={t('birthDateStep.year')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit"
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition"
          disabled={!isFormValid}
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
