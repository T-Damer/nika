import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import useLocale from '@/hooks/useLocale'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { AlertCircle, CalendarIcon, Droplets, SaveIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const commonSymptoms = [
  'cramps',
  'headache',
  'bloating',
  'backPain',
  'breastTenderness',
  'acne',
  'fatigue',
  'cravings',
  'nausea',
  'spotting',
]

const commonMoods = [
  'happy',
  'calm',
  'anxious',
  'irritable',
  'sad',
  'emotional',
  'energetic',
  'tired',
  'motivated',
  'unmotivated',
]

export default function Log() {
  const { t, locale } = useLocale()
  const { toast } = useToast()

  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [activeTab, setActiveTab] = useState('period')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [flowIntensity, setFlowIntensity] = useState(2)
  const [painLevel, setPainLevel] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const toggleMood = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood))
    } else {
      setSelectedMoods([...selectedMoods, mood])
    }
  }

  const flowAmount = [
    t('log.flow0'),
    t('log.flow1'),
    t('log.flow2'),
    t('log.flow3'),
    t('log.flow4'),
  ]

  const saveLog = () => {
    setIsSaving(true)

    const logEntry = {
      date: format(selectedDate, 'dd.MM.yyyy'),
      isPeriod: activeTab === 'period',
      flowIntensity: activeTab === 'period' ? flowIntensity : 0,
      painLevel,
      symptoms: selectedSymptoms,
      moods: selectedMoods,
    }

    // Log to console for demo
    console.log('Saving log for:', format(selectedDate, 'yyyy-MM-dd'))
    console.log(logEntry)

    // In a real app, we'd save to localStorage or send to backend here

    setTimeout(() => {
      toast({
        title: t('log.saveSuccess'),
        description: t('log.dataRecorded'),
        variant: 'default',
        duration: 3000,
      })

      setIsSaving(false)

      setSelectedSymptoms([])
      setSelectedMoods([])
      setFlowIntensity(2)
      setPainLevel(1)
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <motion.h1
        className="font-heading font-bold text-2xl mb-4 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {t('log.title')}
      </motion.h1>

      <main className="pt-0">
        <Card className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                {t('log.dateTitle')}
              </CardTitle>
              <div className="flex items-center text-sm">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {format(selectedDate, 'PPP', { locale })}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-4"
        >
          <TabsList className="flex gap-x-1 w-full">
            <TabsTrigger
              value="period"
              className="flex items-center gap-2 w-full"
            >
              <Droplets className="h-4 w-4" />
              {t('log.tabs.period')}
            </TabsTrigger>
            <TabsTrigger
              value="symptoms"
              className="flex items-center gap-2 w-full"
            >
              <AlertCircle className="h-4 w-4" />
              {t('log.tabs.symptoms')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="period">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-6">
                  <span className="text-xl font-medium">
                    {t('log.flowIntensity')}
                  </span>
                  <div className="flex justify-between gap-x-2 mb-2">
                    {[...Array(5).keys()].map((i) => (
                      <div
                        className="flex flex-col items-center"
                        key={`flowIntensity=${i}`}
                      >
                        <img
                          src={`/mene-tracker/img/flowIntensity/${i}.png`}
                          onClick={() => setFlowIntensity(i)}
                          className={cn(
                            'transition-transform h-24 w-12 sm:w-16 sm:h-32 cursor-pointer',
                            flowIntensity === i
                              ? 'drop-shadow-xl scale-110'
                              : ''
                          )}
                        />
                        <span className="text-sm">{flowAmount[i]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-row items-center gap-x-4">
                    <span className="text-xl font-medium">
                      {t('log.padsAmountDaily')}
                    </span>
                    <Input className="w-32" />
                  </div>

                  <div>
                    <div className="text-xl font-medium mb-2">
                      <span>{t('log.painLevel')}</span>
                    </div>
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
                    <h3 className="text-sm font-medium mb-2">
                      {t('log.symptoms')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {commonSymptoms.map((symptom) => (
                        <div
                          key={symptom}
                          className="flex items-center space-x-2"
                        >
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
                    <h3 className="text-sm font-medium mb-2">
                      {t('log.mood')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {commonMoods.map((mood) => (
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
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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

      <Navbar />
    </div>
  )
}
