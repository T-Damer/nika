import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ColorSelect<T extends string>({
  header,
  options,
  value,
  onChange,
}: {
  header: string
  options: Record<string, T>
  value: T
  onChange: (newValue: T) => void
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-xl font-medium">{header}</span>

      <Select value={value} onValueChange={onChange}>
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
    </div>
  )
}
