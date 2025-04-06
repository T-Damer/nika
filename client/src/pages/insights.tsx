import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/user-context";
import { Navbar } from "../components/navbar";
import { HealthTipCard } from "../components/health-tip-card";
import { HealthTip } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as BarChartIcon,
  Calendar,
  Droplets,
  Brain,
  Heart,
  Activity
} from "lucide-react";
import { getCurrentPhase } from "@/lib/cycleCalculations";

export default function Insights() {
  const { t } = useTranslation();
  const { user } = useUser();
  
  // Current phase based on user data
  const currentPhase = getCurrentPhase(user);
  
  // Health tips based on cycle phases
  const healthTips: HealthTip[] = [
    {
      id: 'menstrual-1',
      title: t('healthTips.menstrual.title'),
      content: t('healthTips.menstrual.content'),
      icon: 'water',
      forPhase: 'menstrual',
      highlighted: currentPhase.name === 'menstrual'
    },
    {
      id: 'menstrual-2',
      title: t('healthTips.menstrual.nutrition'),
      content: t('healthTips.menstrual.nutritionTip'),
      icon: 'food',
      forPhase: 'menstrual',
      highlighted: false
    },
    {
      id: 'follicular-1',
      title: t('healthTips.follicular.title'),
      content: t('healthTips.follicular.content'),
      icon: 'energy',
      forPhase: 'follicular',
      highlighted: currentPhase.name === 'follicular'
    },
    {
      id: 'follicular-2',
      title: t('healthTips.follicular.exercise'),
      content: t('healthTips.follicular.exerciseTip'),
      icon: 'energy',
      forPhase: 'follicular',
      highlighted: false
    },
    {
      id: 'ovulatory-1',
      title: t('healthTips.ovulatory.title'),
      content: t('healthTips.ovulatory.content'),
      icon: 'heart',
      forPhase: 'ovulatory',
      highlighted: currentPhase.name === 'ovulatory'
    },
    {
      id: 'ovulatory-2',
      title: t('healthTips.ovulatory.social'),
      content: t('healthTips.ovulatory.socialTip'),
      icon: 'heart',
      forPhase: 'ovulatory',
      highlighted: false
    },
    {
      id: 'luteal-1',
      title: t('healthTips.luteal.title'),
      content: t('healthTips.luteal.content'),
      icon: 'food',
      forPhase: 'luteal',
      highlighted: currentPhase.name === 'luteal'
    },
    {
      id: 'luteal-2',
      title: t('healthTips.luteal.selfCare'),
      content: t('healthTips.luteal.selfCareTip'),
      icon: 'heart',
      forPhase: 'luteal',
      highlighted: false
    },
    {
      id: 'general-1',
      title: t('healthTips.general.sleep'),
      content: t('healthTips.general.sleepTip'),
      icon: 'sleep',
      forPhase: 'all',
      highlighted: false
    },
    {
      id: 'general-2',
      title: t('healthTips.general.hydration'),
      content: t('healthTips.general.hydrationTip'),
      icon: 'water',
      forPhase: 'all',
      highlighted: false
    }
  ];
  
  // Filter tips by phase
  const filterTipsByPhase = (phase: string) => {
    return healthTips.filter(tip => tip.forPhase === phase || tip.forPhase === 'all');
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow">
        <div className="flex justify-between items-center">
          <h1 className="font-heading font-bold text-xl">{t('insights.title')}</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Current Phase */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>{t('insights.currentPhase')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                currentPhase.name === 'menstrual' ? 'bg-primary-light text-primary' :
                currentPhase.name === 'follicular' ? 'bg-accent-light text-accent' :
                currentPhase.name === 'ovulatory' ? 'bg-accent-light text-accent' :
                'bg-primary-light text-primary'
              } mr-3`}>
                {currentPhase.name === 'menstrual' ? <Droplets className="h-6 w-6" /> :
                 currentPhase.name === 'follicular' ? <Activity className="h-6 w-6" /> :
                 currentPhase.name === 'ovulatory' ? <Heart className="h-6 w-6" /> :
                 <Brain className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="font-medium">{t(`phases.${currentPhase.name}`)}</h3>
                <p className="text-sm text-neutral-600">{t(`phases.${currentPhase.name}Description`)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Health Tips by Phase */}
        <Tabs defaultValue="current" className="w-full mb-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="current">{t('insights.tabs.current')}</TabsTrigger>
            <TabsTrigger value="menstrual">{t('insights.tabs.menstrual')}</TabsTrigger>
            <TabsTrigger value="follicular">{t('insights.tabs.follicular')}</TabsTrigger>
            <TabsTrigger value="luteal">{t('insights.tabs.luteal')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.tipsForCurrentPhase')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase(currentPhase.name).map(tip => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="menstrual">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.menstrualPhaseTips')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase('menstrual').map(tip => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="follicular">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.follicularPhaseTips')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase('follicular').map(tip => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="luteal">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('insights.lutealPhaseTips')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTipsByPhase('luteal').map(tip => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Cycle Stats */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>{t('insights.cycleStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg">
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium">{user.cycleLength}</h3>
                <p className="text-sm text-neutral-600">{t('insights.avgCycleLength')}</p>
              </div>
              <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg">
                <Droplets className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium">{user.periodLength}</h3>
                <p className="text-sm text-neutral-600">{t('insights.avgPeriodLength')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
