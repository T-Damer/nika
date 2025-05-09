import { DefaultModalProps } from '@/types/Props'
import DefaultModal from '@/components/Modals/DefaultModal'
import { Header2 } from '@/components/Text'
import { PropsWithChildren } from 'react'
import { Input, InputProps } from '@/components/ui/input'
import { useAtom } from 'jotai'
import physicalMensData, {
  physicalMensInputs,
} from '@/lib/atoms/physicalMensData'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

function AnswerInput<T extends string | number>({
  type,
  children,
  onChange,
  value,
  options,
}: PropsWithChildren &
  Omit<InputProps, 'onChange'> & {
    type: string
    value: T
    onChange: (val: T) => void
    options?: string[] | undefined
  }) {
  const isString = typeof value === 'string'

  return (
    <div className="w-full flex flex-col">
      <span className="text-sm text-left leading-tight">{children}</span>
      {options?.length ? (
        <Select
          value={String(value)}
          onValueChange={(newVal) => onChange(newVal as T)}
        >
          <SelectTrigger className="bg-neutral-50 border border-neutral-200 rounded-xl w-full">
            <SelectValue placeholder="Выбрать" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(options).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(ev) =>
            onChange(
              (isString
                ? ev.currentTarget.value
                : ev.currentTarget.valueAsNumber) as T
            )
          }
          className="w-full"
        />
      )}
    </div>
  )
}

function ModalBody() {
  const [atom, setAtom] = useAtom(physicalMensData)

  return (
    <div className="flex flex-col gap-y-2 items-center text-center">
      <Header2>
        Aнкета - анализ менструальной функции, дисменореи в зависимости от
        интенсивности физических нагрузок
      </Header2>

      {Object.entries(physicalMensInputs).map(([key, value]) => (
        <AnswerInput
          options={'options' in value ? value.options : undefined}
          type={'type' in value ? value.type : 'string'}
          key={key}
          onChange={(newVal) => {
            setAtom((prev) => ({ ...prev, [key]: newVal }))
          }}
          value={atom[key]}
        >
          {value.title}
        </AnswerInput>
      ))}
    </div>
  )
}

export default function (props: DefaultModalProps) {
  return <DefaultModal {...props} body={ModalBody} />
}
