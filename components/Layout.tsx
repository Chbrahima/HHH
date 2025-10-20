
import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import {
  DashboardIcon,
  OrdersIcon,
  FinanceIcon,
  InvoicesIcon,
  EmployeesIcon,
  SettingsIcon,
  WashingMachineIcon,
} from './icons';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, user } = useAppContext();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: DashboardIcon },
    { path: '/orders', label: t('orders'), icon: OrdersIcon },
    { path: '/finance', label: t('finance'), icon: FinanceIcon },
    { path: '/invoices', label: t('invoices'), icon: InvoicesIcon },
    ...(user?.role === 'manager' ? [{ path: '/employees', label: t('employees'), icon: EmployeesIcon }] : []),
    { path: '/settings', label: t('settings'), icon: SettingsIcon },
  ];

  const getPageTitle = () => {
    const currentNavItem = navItems.find(item => location.pathname.startsWith(item.path));
    return currentNavItem ? currentNavItem.label : 'Pressy';
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-text_primary-light dark:text-text_primary-dark">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-center p-4 bg-foreground-light dark:bg-foreground-dark shadow-md h-16">
        <div className="flex items-center gap-2">
            <WashingMachineIcon className="h-8 w-8 text-primary-DEFAULT" />
            <h1 className="text-2xl font-bold text-primary-DEFAULT">Pressy</h1>
        </div>
        <h2 className="absolute text-xl font-semibold left-1/2 -translate-x-1/2">{getPageTitle()}</h2>
      </header>

      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-foreground-light dark:bg-foreground-dark border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-6 max-w-lg mx-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 text-xs sm:text-sm transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-DEFAULT'
                    : 'text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light'
                }`
              }
            >
              <Icon className="w-6 h-6 mb-1" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
