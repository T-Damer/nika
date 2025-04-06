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
import { CalendarIcon, Droplets, Heart, AlertCircle, Thermometer, Moon, SaveIcon } from "lucide-react";

export default function Log() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useUser();
  const currentLocale = i18n.language === 'ru' ? ru : undefined;

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState("period");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [flowIntensity, setFlowIntensity] = useState(2);
  const [painLevel, setPainLevel] = useState(1);

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
    // In a real implementation, this would save to localStorage
    // For now, we'll just log to console
    console.log('Saving log for:', format(selectedDate, 'yyyy-MM-dd'));
    console.log({
      date: format(selectedDate, 'yyyy-MM-dd'),
      isPeriod: activeTab === "period",
      flowIntensity: activeTab === "period" ? flowIntensity : 0,
      painLevel,
      symptoms: selectedSymptoms,
      moods: selectedMoods
    });
    
    // Show success message (in a real app, use toast or other notification)
    alert(t('log.saveSuccess'));
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow">
        <div className="flex justify-between items-center">
          <h1 className="font-heading font-bold text-xl">{t('log.title')}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
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
                    <div className="flex justify-between text-xs text-neutral-600">
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
                    <div className="flex justify-between text-xs text-neutral-600">
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
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          {t('log.saveButton')}
        </Button>
      </main>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
