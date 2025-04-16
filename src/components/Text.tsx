import { cn } from '@/lib/utils'
import { ClassNameProp } from '@/types/Props'
import { PropsWithChildren } from 'react'

export function Header1({ children }: PropsWithChildren) {
  return (
    <h1 className="font-heading font-bold text-3xl dark:text-white">
      {children}
    </h1>
  )
}

export function Header2({ children }: PropsWithChildren) {
  return (
    <span className="font-heading font-bold text-2xl text-center leading-7 dark:text-white">
      {children}
    </span>
  )
}

export function BasicText({
  children,
  className,
}: PropsWithChildren & ClassNameProp) {
  return <span className={cn('dark:text-white', className)}>{children}</span>
}
