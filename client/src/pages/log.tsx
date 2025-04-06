import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useUser } from "../contexts/user-context";
import { Navbar } from "../components/navbar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CalendarIcon, Droplets, Heart, AlertCircle, Check, SaveIcon } from "lucide-react";

export default function Log() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const currentLocale = i18n.language === 'ru' ? ru : undefined;

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState("period");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [flowIntensity, setFlowIntensity] = useState(2);
  const [painLevel, setPainLevel] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Common symptoms based on user selected symptoms during onboarding
  const commonSymptoms = [
    'cramps', 'headache', 'bloating', 'backPain', 
    'breastTenderness', 'acne', 'fatigue', 'cravings', 
    'nausea', 'spotting'
  ];

  // Common moods based on user selected moods during onboarding
  const commonMoods = [
    'happy', 'calm', 'anxious', 'irritable', 
    'sad', 'emotional', 'energetic', 'tired', 
    'motivated', 'unmotivated'
  ];

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const toggleMood = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const saveLog = () => {
    // Show saving state
    setIsSaving(true);
    
    // Create log entry
    const logEntry = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      isPeriod: activeTab === "period",
      flowIntensity: activeTab === "period" ? flowIntensity : 0,
      painLevel,
      symptoms: selectedSymptoms,
      moods: selectedMoods
    };
    
    // Log to console for demo
    console.log('Saving log for:', format(selectedDate, 'yyyy-MM-dd'));
    console.log(logEntry);
    
    // In a real app, we'd save to localStorage or send to backend here
    
    // Simulate saving delay
    setTimeout(() => {
      // Show success toast notification
      toast({
        title: t('log.saveSuccess'),
        description: t('log.dataRecorded'),
        variant: "default",
        duration: 3000,
      });
      
      // Reset saving state
      setIsSaving(false);
      
      // Reset form after successful save
      setSelectedSymptoms([]);
      setSelectedMoods([]);
      setFlowIntensity(2);
      setPainLevel(1);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header (simplified) */}
      <div className="pt-6 px-4">
        <motion.h1 
          className="font-heading font-bold text-2xl mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {t('log.title')}
        </motion.h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-0">
        {/* Date Selection */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">{t('log.dateTitle')}</CardTitle>
              <div className="flex items-center text-sm">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {format(selectedDate, 'PPP', { locale: currentLocale })}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tracking Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="period" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              {t('log.tabs.period')}
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {t('log.tabs.symptoms')}
            </TabsTrigger>
          </TabsList>

          {/* Period Tab */}
          <TabsContent value="period">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-6">
                  {/* Flow Intensity */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('log.flowIntensity')}</h3>
                    <div className="mb-2">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[flowIntensity]}
                        onValueChange={(values) => setFlowIntensity(values[0])}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                      <span>{t('log.flowLevels.light')}</span>
                      <span>{t('log.flowLevels.medium')}</span>
                      <span>{t('log.flowLevels.heavy')}</span>
                    </div>
                  </div>

                  {/* Pain Level */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('log.painLevel')}</h3>
                    <div className="mb-2">
                      <Slider
                        min={0}
                        max={5}
                        step={1}
                        value={[painLevel]}
                        onValueChange={(values) => setPainLevel(values[0])}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                      <span>{t('log.painLevels.none')}</span>
                      <span>{t('log.painLevels.moderate')}</span>
                      <span>{t('log.painLevels.severe')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Symptoms Tab */}
          <TabsContent value="symptoms">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-6">
                  {/* Symptoms */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('log.symptoms')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {commonSymptoms.map(symptom => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`symptom-${symptom}`} 
                            checked={selectedSymptoms.includes(symptom)}
                            onCheckedChange={() => toggleSymptom(symptom)}
                          />
                          <label 
                            htmlFor={`symptom-${symptom}`}
                            className="text-sm font-medium leading-none"
                          >
                            {t(`symptoms.${symptom}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mood */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('log.mood')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {commonMoods.map(mood => (
                        <div key={mood} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mood-${mood}`} 
                            checked={selectedMoods.includes(mood)}
                            onCheckedChange={() => toggleMood(mood)}
                          />
                          <label 
                            htmlFor={`mood-${mood}`}
                            className="text-sm font-medium leading-none"
                          >
                            {t(`moods.${mood}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <Button 
          className="w-full bg-primary text-white font-medium py-3 px-6 rounded-full hover:bg-primary-dark transition"
          onClick={saveLog}
          disabled={isSaving}
        >
          {isSaving ? (
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('log.saving')}
            </motion.div>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              {t('log.saveButton')}
            </>
          )}
        </Button>
      </main>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
