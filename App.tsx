
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './hooks/useAppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import FinancePage from './pages/FinancePage';
import InvoicesPage from './pages/InvoicesPage';
import EmployeesPage from './pages/EmployeesPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';

const App: React.FC = () => {
  const { theme, language, direction, isAuthenticated, user } = useAppContext();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.lang = language;
    root.dir = direction;
  }, [theme, language, direction]);

  return (
    <HashRouter>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            {user?.role === 'manager' && <Route path="/employees" element={<EmployeesPage />} />}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </HashRouter>
  );
};

export default App;
