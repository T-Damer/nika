import { PropsWithChildren } from 'react'

export function Header1({ children }: PropsWithChildren) {
  return <h1 className="font-heading font-bold text-3xl">{children}</h1>
}
