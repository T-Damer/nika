import { Navbar } from '@/components/navbar'
import { Header1 } from '@/components/Text'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageToggle } from '@/components/ui/language-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useUser } from '@/contexts/user-context'
import { useToast } from '@/hooks/use-toast'
import { clearAllData } from '@/lib/storage'
import { motion } from 'framer-motion'
import { Bell, Moon, Pen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { t } = useTranslation()
  const { user, updateUser } = useUser()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(user.name)
  const [tempCycleLength, setTempCycleLength] = useState(
    user.cycleLength.toString()
  )
  const [tempPeriodLength, setTempPeriodLength] = useState(
    user.periodLength.toString()
  )

  const startEditing = () => {
    setIsEditing(true)
    setTempName(user.name)
    setTempCycleLength(user.cycleLength.toString())
    setTempPeriodLength(user.periodLength.toString())
  }

  const saveProfile = () => {
    updateUser({
      name: tempName,
      cycleLength: parseInt(tempCycleLength),
      periodLength: parseInt(tempPeriodLength),
    })
    setIsEditing(false)

    toast({
      title: t('profile.saveSuccess'),
      description: t('profile.profileUpdated'),
    })
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  // Handle notification preferences
  const toggleNotifications = () => {
    updateUser({
      preferences: {
        ...user.preferences,
        notifications: !user.preferences.notifications,
      },
    })
  }

  // Handle reset app data
  const resetAppData = () => {
    clearAllData()
    // Navigate to onboarding after resetting
    navigate('/onboarding')
  }

  // Generate cycle length options
  const cycleLengthOptions = Array.from({ length: 31 }, (_, i) =>
    (21 + i).toString()
  )

  // Generate period length options
  const periodLengthOptions = Array.from({ length: 9 }, (_, i) =>
    (2 + i).toString()
  )

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <motion.div
        className="flex justify-between items-center pt-6 px-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-3xl font-bold">{t('profile.title')}</span>
        <LanguageToggle />
      </motion.div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-end items-center">
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={startEditing}>
                <Pen />
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
            <div className="flex flex-col">
              {isEditing ? (
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder={t('profile.namePlaceholder')}
                  className="mb-1"
                />
              ) : (
                <span className="text-lg font-medium">
                  {user.name || t('profile.defaultName')}
                </span>
              )}
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {user.birthDay && user.birthMonth && user.birthYear
                  ? `${t('profile.birthDate')}: ${user.birthDay}.${
                      user.birthMonth
                    }.${user.birthYear}`
                  : t('profile.noBirthDate')}
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cycleLength">{t('profile.cycleLength')}</Label>
                <Select
                  value={tempCycleLength}
                  onValueChange={setTempCycleLength}
                >
                  <SelectTrigger id="cycleLength">
                    <SelectValue placeholder={t('profile.selectCycleLength')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cycleLengthOptions.map((length) => (
                      <SelectItem key={length} value={length}>
                        {length} {t('common.days')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="periodLength">
                  {t('profile.periodLength')}
                </Label>
                <Select
                  value={tempPeriodLength}
                  onValueChange={setTempPeriodLength}
                >
                  <SelectTrigger id="periodLength">
                    <SelectValue
                      placeholder={t('profile.selectPeriodLength')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {periodLengthOptions.map((length) => (
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
                <Button onClick={saveProfile}>{t('common.save')}</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('profile.cycleLength')}
                </div>
                <div className="font-medium">
                  {user.cycleLength} {t('common.days')}
                </div>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('profile.periodLength')}
                </div>
                <div className="font-medium">
                  {user.periodLength} {t('common.days')}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Button Only */}
      <Card>
        <CardContent className="pt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="full">
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
        </CardContent>
      </Card>

      <Navbar />
    </div>
  )
}
