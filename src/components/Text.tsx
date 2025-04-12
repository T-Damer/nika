import { PropsWithChildren } from 'react'

export function Header1({ children }: PropsWithChildren) {
  return <h1 className="font-heading font-bold text-3xl">{children}</h1>
}

export function Header2({ children }: PropsWithChildren) {
  return <h2 className="font-heading font-bold text-2xl">{children}</h2>
}
