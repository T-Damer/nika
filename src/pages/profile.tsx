import { Navbar } from '@/components/navbar'
import { format, formatDuration } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import { useUser } from '@/contexts/user-context'
import { useToast } from '@/hooks/use-toast'
import { clearAllData } from '@/lib/storage'
import { motion } from 'framer-motion'
import { Pen, Save, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocale from '@/hooks/useLocale'
import { DialogClose } from '@radix-ui/react-dialog'
import { useAtomValue, useSetAtom } from 'jotai'
import modalsAtom, { AvailableModals } from '@/lib/atoms/modalsAtom'
import exportUserData from '@/lib/exportUserData'
import logHistoryAtom from '@/lib/atoms/logHistory'
import questionaryData from '@/lib/atoms/questionaryData'

const cycleLengthOptions = Array.from({ length: 31 }, (_, i) => 21 + i)

const periodLengthOptions = Array.from({ length: 9 }, (_, i) => 2 + i)

export default function Profile() {
  const setModal = useSetAtom(modalsAtom)
  const logHistory = useAtomValue(logHistoryAtom)
  const questionary = useAtomValue(questionaryData)
  const { t, locale } = useLocale()
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

  const resetAppData = () => {
    clearAllData()
    navigate('/onboarding')
  }

  const exportData = useCallback(() => {
    const today = format(new Date(), 'dd-mm-yyyy')
    const fileName = user.name + ' ' + today

    exportUserData(fileName, user, logHistory, questionary)
  }, [user, logHistory, questionary])

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <motion.div
        className="flex justify-between items-center pt-6 px-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-3xl font-bold dark:text-white">
          {t('profile.title')}
        </span>
        <LanguageToggle />
      </motion.div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-end items-center">
            {isEditing ? null : (
              <Button variant="ghost" size="sm" onClick={startEditing}>
                <Pen />
              </Button>
            )}
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
                      <SelectItem
                        key={`cycle-length-${length}`}
                        value={String(length)}
                      >
                        {formatDuration({ days: length }, { locale })}
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
                      <SelectItem
                        key={`period-length-${length}`}
                        value={String(length)}
                      >
                        {formatDuration({ days: length }, { locale })}
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
              <div className="bg-neutral-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('profile.cycleLength')}
                </div>
                <div className="font-medium">
                  {formatDuration({ days: user.cycleLength }, { locale })}
                </div>
              </div>
              <div className="bg-neutral-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t('profile.periodLength')}
                </div>
                <div className="font-medium">
                  {formatDuration({ days: user.periodLength }, { locale })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => setModal(AvailableModals.questionary)}
        className="mb-4"
      >
        Пройти опрос
      </Button>

      <Card>
        <CardContent className="flex flex-col gap-y-2 pt-6">
          <Button size="full" onClick={exportData}>
            <Save />
            {t('profile.exportData')}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="full">
                <Trash2 />
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
                <DialogClose>
                  <Button variant="outline" size="full">
                    {t('common.cancel')}
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  size="full"
                  onClick={resetAppData}
                >
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
