import AnimatedEntryHeader from '@/components/AnimatedEntryHeader'
import LogSelect from '@/components/Log/LogSelect'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import useLocale from '@/hooks/useLocale'
import logHistory, {
  commonMoods,
  commonSymptoms,
  LogEntry,
} from '@/lib/atoms/logHistory'
import { cn } from '@/lib/utils'
import {
  MensColorTypes,
  MensColorValues,
  MensConsistencyValues,
  MensSmellValues,
  mensColor,
  mensConsistency,
  mensSmell,
} from '@/types/Log'
import { format } from 'date-fns'
import { useAtom } from 'jotai'
import { AlertCircle, CalendarIcon, Droplets, SaveIcon } from 'lucide-react'
import { useState } from 'react'

export default function Log() {
  const [logEntry, setLogEntry] = useAtom(logHistory)
  const { t, locale } = useLocale()
  const { toast } = useToast()

  const today = new Date()
  const [color, setMensColor] = useState<MensColorValues>(mensColor.red)
  const [consistency, setConsistency] = useState<MensConsistencyValues>(
    mensConsistency.creamy
  )
  const [smell, setSmell] = useState<MensSmellValues>(mensSmell.no)
  const [selectedDate, setSelectedDate] = useState(today)
  const [padsUsed, setPadsUsed] = useState(0)
  const [activeTab, setActiveTab] = useState('period')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [flowIntensity, setFlowIntensity] = useState(2)
  const [painLevel, setPainLevel] = useState(1)

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
    const date = format(selectedDate, 'dd.MM.yyyy')
    if (logEntry[date]) {
      toast({
        title: t('log.entryExists'),
        duration: 3000,
      })
      return
    }

    const newEntry: LogEntry = {
      flowIntensity,
      color,
      consistency,
      smell,
      padsUsed,
      painIntensity: painLevel,
      symptoms: selectedSymptoms,
      mood: selectedMoods,
    }

    setLogEntry((prev) => ({ ...prev, [date]: newEntry }))

    toast({
      title: t('log.saveSuccess'),
      description: t('log.dataRecorded'),
      variant: 'default',
      duration: 3000,
    })

    setSelectedSymptoms([])
    setSelectedMoods([])
    setFlowIntensity(2)
    setPainLevel(1)
  }

  return (
    <div className="flex flex-col pb-16">
      <AnimatedEntryHeader>{t('log.title')}</AnimatedEntryHeader>

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
                  <div className="grid grid-cols-3 sm:flex justify-between gap-x-1 mb-2">
                    {[...Array(5).keys()].map((i) => (
                      <div
                        className="flex flex-col items-center "
                        key={`flowIntensity-${i}`}
                      >
                        <img
                          src={`/nika/img/flowIntensity/${i}.png`}
                          onClick={() => setFlowIntensity(i)}
                          className={cn(
                            'transition-transform h-24 w-12  sm:w-16 sm:h-32 cursor-pointer',
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
                    <Input
                      className="w-32"
                      type="number"
                      step={1}
                      onChange={(e) =>
                        setPadsUsed(e.currentTarget.valueAsNumber)
                      }
                      value={padsUsed}
                    />
                  </div>

                  <LogSelect<MensColorValues>
                    header="Цвет выделений"
                    value={color}
                    onChange={setMensColor}
                    options={mensColor}
                  />

                  <LogSelect<MensConsistencyValues>
                    header="Консистентность"
                    value={consistency}
                    onChange={setConsistency}
                    options={mensConsistency}
                  />

                  <LogSelect<MensSmellValues>
                    header="Запах"
                    value={smell}
                    onChange={setSmell}
                    options={mensSmell}
                  />

                  <div>
                    <div className="text-xl font-medium mb-2">
                      <span>{t('log.painLevel')}</span>
                    </div>
                    <div className="mb-2">
                      <Slider
                        min={0}
                        max={4}
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

          <TabsContent value="symptoms">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-6">
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
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          {t('log.saveButton')}
        </Button>
      </main>

      <Navbar />
    </div>
  )
}
