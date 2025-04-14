import { DefaultModalProps } from '@/types/Props'
import DefaultModal from '@/components/Modals/DefaultModal'
import { Header2 } from '@/components/Text'
import { PropsWithChildren } from 'react'
import { Input } from '@/components/ui/input'
import questionaryData, {
  defaultQuestionary,
  QuestionaryKeys,
  QuestionaryStore,
} from '@/lib/atoms/questionaryData'
import { useAtom } from 'jotai'

function RelativeWithDisease({
  children,
  onChange,
  value,
}: PropsWithChildren & { value: string; onChange: (val: string) => void }) {
  return (
    <div className="w-full flex gap-x-2 items-center">
      <span className="w-32 text-sm text-right leading-tight">{children}</span>
      <Input
        value={value}
        onChange={(ev) => onChange(ev.currentTarget.value)}
        className="w-full"
      />
    </div>
  )
}

function ModalBody() {
  const [atom, setAtom] = useAtom(questionaryData)

  const relativesTranslation: QuestionaryStore = {
    your: 'Ваши',
    mother: 'Мамы',
    grandmotherMa: 'Бабушки (мама)',
    grandmotherPa: 'Бабушки (папа)',
    sisters: 'Родных сестер',
    cousins: 'Двоюродных сестер',
    aunt: 'Тети',
  }

  return (
    <div className="flex flex-col gap-y-2 items-center text-center">
      <Header2>
        Скрининг анкета генеалогических гинекологических заболеваний
      </Header2>
      <span className="text-neutral-500">
        Какие заболевания встречались в вашей семье?
      </span>
      {Object.keys(defaultQuestionary).map((relative) => (
        <RelativeWithDisease
          key={relative}
          value={atom[relative as QuestionaryKeys]}
          onChange={(val) =>
            setAtom((prev) => ({
              ...prev,
              [relative]: val,
            }))
          }
        >
          {relativesTranslation[relative as QuestionaryKeys]}
        </RelativeWithDisease>
      ))}
    </div>
  )
}

export default function (props: DefaultModalProps) {
  return <DefaultModal {...props} body={ModalBody} />
}
