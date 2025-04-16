import { PropsWithChildren } from 'react'

export default function SelectorCard({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-y-3 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 rounded-xl p-4 max-h-60 overflow-y-auto w-full">
      {children}
    </div>
  )
}
