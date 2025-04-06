import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Calendar as CalendarIcon, PenSquare, BarChart, User } from "lucide-react";

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around p-2">
      <NavLink 
        to="/"
        className={({ isActive: active }) => 
          `flex flex-col items-center p-2 ${active ? 'text-primary' : 'text-neutral-400'}`
        }
      >
        <Home className="h-6 w-6" />
        <span className="text-xs">{t('nav.home')}</span>
      </NavLink>
      
      <NavLink 
        to="/calendar"
        className={({ isActive: active }) => 
          `flex flex-col items-center p-2 ${active ? 'text-primary' : 'text-neutral-400'}`
        }
      >
        <CalendarIcon className="h-6 w-6" />
        <span className="text-xs">{t('nav.calendar')}</span>
      </NavLink>
      
      <NavLink 
        to="/log"
        className={({ isActive: active }) => 
          `flex flex-col items-center p-2 ${active ? 'text-primary' : 'text-neutral-400'}`
        }
      >
        <PenSquare className="h-6 w-6" />
        <span className="text-xs">{t('nav.log')}</span>
      </NavLink>
      
      <NavLink 
        to="/insights"
        className={({ isActive: active }) => 
          `flex flex-col items-center p-2 ${active ? 'text-primary' : 'text-neutral-400'}`
        }
      >
        <BarChart className="h-6 w-6" />
        <span className="text-xs">{t('nav.insights')}</span>
      </NavLink>
      
      <NavLink 
        to="/profile"
        className={({ isActive: active }) => 
          `flex flex-col items-center p-2 ${active ? 'text-primary' : 'text-neutral-400'}`
        }
      >
        <User className="h-6 w-6" />
        <span className="text-xs">{t('nav.profile')}</span>
      </NavLink>
    </nav>
  );
}
