import { OnClickPropVoid } from '@/types/Props'
import { PropsWithChildren } from 'react'

export default function RoundButton({
  children,
  onClick,
}: PropsWithChildren & OnClickPropVoid) {
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-slate-700 flex items-center justify-center text-primary font-bold"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
