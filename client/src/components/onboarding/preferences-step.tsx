import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PreferencesStepProps {
  initialValues: {
    notifications: boolean;
    darkMode: boolean;
  };
  onNext: (preferences: { notifications: boolean; darkMode: boolean }) => void;
  onBack: () => void;
}

export function PreferencesStep({ initialValues, onNext, onBack }: PreferencesStepProps) {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState(initialValues);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(preferences);
  };
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="font-heading font-bold text-2xl mb-6 text-center">{t('preferencesStep.title')}</h2>
      <p className="text-neutral-800 mb-6 max-w-xs text-center">{t('preferencesStep.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">{t('preferences.notifications')}</Label>
                <p className="text-sm text-neutral-600">{t('preferences.notificationsDescription')}</p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">{t('preferences.darkMode')}</Label>
                <p className="text-sm text-neutral-600">{t('preferences.darkModeDescription')}</p>
              </div>
              <Switch
                id="darkMode"
                checked={preferences.darkMode}
                onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
              />
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
