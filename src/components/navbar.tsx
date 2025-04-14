import { NavLink } from 'react-router-dom'
import {
  Home,
  Calendar as CalendarIcon,
  PenSquare,
  BarChart,
  User,
} from 'lucide-react'
import { t } from 'i18next'

const links = [
  {
    href: '/',
    icon: <Home className="h-6 w-6" />,
    altText: t('nav.home'),
  },
  {
    href: '/calendar',
    icon: <CalendarIcon className="h-6 w-6" />,
    altText: t('nav.calendar'),
  },
  {
    href: '/log',
    icon: <PenSquare className="h-6 w-6" />,
    altText: t('nav.log'),
  },
  {
    href: '/insights',
    icon: <BarChart className="h-6 w-6" />,
    altText: t('nav.insights'),
  },
  {
    href: '/profile',
    icon: <User className="h-6 w-6" />,
    altText: t('nav.profile'),
  },
]

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-neutral-200 dark:border-gray-800 flex justify-around p-2 z-20">
      {links.map((link) => (
        <NavLink
          to={link.href}
          key={link.altText}
          className={({ isActive: active }) =>
            `flex flex-col items-center hover:text-opacity-50 active:brightness-110 transition-colors p-2 ${
              active ? 'text-primary' : 'text-neutral-400 dark:text-neutral-500'
            }`
          }
        >
          {link.icon}
        </NavLink>
      ))}
    </nav>
  )
}
