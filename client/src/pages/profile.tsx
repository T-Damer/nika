import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/user-context";
import { Navbar } from "../components/navbar";
import { useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { clearAllData } from "@/lib/storage";
import { User, Settings, Calendar, Moon, Bell, HelpCircle, LogOut, Trash2 } from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempCycleLength, setTempCycleLength] = useState(user.cycleLength.toString());
  const [tempPeriodLength, setTempPeriodLength] = useState(user.periodLength.toString());
  
  // Handle profile edit
  const startEditing = () => {
    setIsEditing(true);
    setTempName(user.name);
    setTempCycleLength(user.cycleLength.toString());
    setTempPeriodLength(user.periodLength.toString());
  };
  
  const saveProfile = () => {
    updateUser({
      name: tempName,
      cycleLength: parseInt(tempCycleLength),
      periodLength: parseInt(tempPeriodLength)
    });
    setIsEditing(false);
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  // Handle notification preferences
  const toggleNotifications = () => {
    updateUser({
      preferences: {
        ...user.preferences,
        notifications: !user.preferences.notifications
      }
    });
  };
  
  // Handle dark mode
  const toggleDarkMode = () => {
    updateUser({
      preferences: {
        ...user.preferences,
        darkMode: !user.preferences.darkMode
      }
    });
    // In a real implementation, this would also toggle the app's theme
  };
  
  // Handle reset app data
  const resetAppData = () => {
    clearAllData();
    // Navigate to onboarding after resetting
    navigate('/onboarding');
  };
  
  // Generate cycle length options
  const cycleLengthOptions = Array.from({ length: 31 }, (_, i) => (21 + i).toString());
  
  // Generate period length options
  const periodLengthOptions = Array.from({ length: 9 }, (_, i) => (2 + i).toString());
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow">
        <div className="flex justify-between items-center">
          <h1 className="font-heading font-bold text-xl">{t('profile.title')}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* User Profile */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{t('profile.userProfile')}</CardTitle>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={startEditing}>
                  {t('profile.edit')}
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder={t('profile.namePlaceholder')}
                    className="mb-1"
                  />
                ) : (
                  <h2 className="text-lg font-medium">{user.name || t('profile.defaultName')}</h2>
                )}
                <p className="text-sm text-neutral-600">
                  {user.birthDay && user.birthMonth && user.birthYear 
                    ? `${t('profile.birthDate')}: ${user.birthDay}.${user.birthMonth}.${user.birthYear}` 
                    : t('profile.noBirthDate')}
                </p>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cycleLength">{t('profile.cycleLength')}</Label>
                  <Select value={tempCycleLength} onValueChange={setTempCycleLength}>
                    <SelectTrigger id="cycleLength">
                      <SelectValue placeholder={t('profile.selectCycleLength')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cycleLengthOptions.map(length => (
                        <SelectItem key={length} value={length}>
                          {length} {t('common.days')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="periodLength">{t('profile.periodLength')}</Label>
                  <Select value={tempPeriodLength} onValueChange={setTempPeriodLength}>
                    <SelectTrigger id="periodLength">
                      <SelectValue placeholder={t('profile.selectPeriodLength')} />
                    </SelectTrigger>
                    <SelectContent>
                      {periodLengthOptions.map(length => (
                        <SelectItem key={length} value={length}>
                          {length} {t('common.days')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={cancelEditing}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={saveProfile}>
                    {t('common.save')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <div className="text-sm text-neutral-600">{t('profile.cycleLength')}</div>
                  <div className="font-medium">{user.cycleLength} {t('common.days')}</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <div className="text-sm text-neutral-600">{t('profile.periodLength')}</div>
                  <div className="font-medium">{user.periodLength} {t('common.days')}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Settings */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>{t('profile.settings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-neutral-600" />
                  <Label htmlFor="notifications">{t('profile.notifications')}</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={user.preferences.notifications}
                  onCheckedChange={toggleNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-neutral-600" />
                  <Label htmlFor="darkMode">{t('profile.darkMode')}</Label>
                </div>
                <Switch
                  id="darkMode"
                  checked={user.preferences.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Help and Support */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>{t('profile.helpSupport')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <HelpCircle className="h-5 w-5 mr-2" />
                {t('profile.faq')}
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-5 w-5 mr-2" />
                {t('profile.contactSupport')}
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-5 w-5 mr-2" />
                {t('profile.privacyPolicy')}
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-5 w-5 mr-2" />
                {t('profile.termsOfService')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-500">{t('profile.dangerZone')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-5 w-5 mr-2" />
                    {t('profile.resetData')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('profile.confirmReset')}</DialogTitle>
                    <DialogDescription>
                      {t('profile.resetWarning')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      {t('common.cancel')}
                    </Button>
                    <Button variant="destructive" onClick={resetAppData}>
                      {t('profile.confirmResetButton')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full justify-start border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => navigate('/onboarding')}>
                <LogOut className="h-5 w-5 mr-2" />
                {t('profile.logOut')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
