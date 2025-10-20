import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Theme, Language, Direction, User, UserRole, Service, Order, OrderStatus, Expense, Employee, Notification } from '../types';
import { translations } from '../lib/i18n';
import { DEFAULT_SERVICES } from '../constants';
import { mockOrders, mockExpenses, mockEmployees, mockNotifications } from '../lib/mockData';
import { db } from '../lib/db';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  direction: Direction;
  t: (key: keyof typeof translations.fr) => string;
  
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: {phone: string, password: string}) => boolean;
  signup: (managerData: any) => boolean;
  logout: () => void;
  
  services: Service[];
  updateServicePrice: (id: string, newPrice: number) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  restoreDefaultServices: () => void;
  
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: string) => void;

  notifications: Notification[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => db.getItem<Theme>('theme') || 'system');
  const [language, setLanguageState] = useState<Language>(() => db.getItem<Language>('language') || 'fr');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!db.getItem('user'));
  const [user, setUser] = useState<User | null>(() => db.getItem<User>('user'));

  const initializeState = <T,>(key: string, defaultValue: T): T => {
    const savedValue = db.getItem<T>(key);
    if (savedValue !== null) {
        return savedValue;
    }
    db.setItem(key, defaultValue);
    return defaultValue;
  };

  const [services, setServices] = useState<Service[]>(() => initializeState('services', DEFAULT_SERVICES));
  const [orders, setOrders] = useState<Order[]>(() => initializeState('orders', mockOrders));
  const [expenses, setExpenses] = useState<Expense[]>(() => initializeState('expenses', mockExpenses));
  const [employees, setEmployees] = useState<Employee[]>(() => initializeState('employees', mockEmployees));
  const [notifications, setNotifications] = useState<Notification[]>(() => initializeState('notifications', mockNotifications));
  
  const direction: Direction = useMemo(() => (language === 'ar' ? 'rtl' : 'ltr'), [language]);
  
  const t = (key: keyof typeof translations.fr): string => {
    return translations[language][key] || key;
  };
  
  useEffect(() => { db.setItem('theme', theme); }, [theme]);
  useEffect(() => { db.setItem('language', language); }, [language]);
  useEffect(() => { db.setItem('user', user); }, [user]);
  useEffect(() => { db.setItem('services', services); }, [services]);
  useEffect(() => { db.setItem('orders', orders); }, [orders]);
  useEffect(() => { db.setItem('expenses', expenses); }, [expenses]);
  useEffect(() => { db.setItem('employees', employees); }, [employees]);
  useEffect(() => { db.setItem('notifications', notifications); }, [notifications]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };
  
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    root.classList.add(effectiveTheme);
  }, [theme]);

  const login = (credentials: {phone: string, password: string}) => {
    // Mock login
    if(credentials.phone && credentials.password) {
        const loggedInUser: User = {
            id: 'manager1',
            name: 'Ahmed Fall',
            phone: credentials.phone,
            email: 'manager@pressy.com',
            role: 'manager',
            laundryName: 'Pressy Laundry',
        };
        setUser(loggedInUser);
        setIsAuthenticated(true);
        return true;
    }
    return false;
  };

  const signup = (managerData: any) => {
      // Mock signup
      if (managerData.phone && managerData.password && managerData.laundryName && managerData.managerName) {
        const newUser: User = {
            id: `MGR${Date.now()}`,
            name: managerData.managerName,
            phone: managerData.phone,
            email: managerData.email,
            role: 'manager',
            laundryName: managerData.laundryName,
        };
        setUser(newUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
  }

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newOrderNumber = orders.length > 0 ? Math.max(...orders.map(o => o.orderNumber)) + 1 : 1001;
    const newOrder: Order = {
        ...orderData,
        id: `ORD${Date.now()}`,
        orderNumber: newOrderNumber,
        createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);

    // Add notification if added by employee
    if (user?.role === 'employee') {
      setNotifications(prev => [{
        id: Date.now(),
        title: "New Order Added",
        message: `Employee ${user.name} added order #${newOrder.orderNumber}`,
        type: 'info',
        seen: false,
        createdAt: new Date().toISOString()
      }, ...prev]);
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));
  };
  
  const updateServicePrice = (id: string, newPrice: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = { ...service, id: `SVC${Date.now()}` };
    setServices(prev => [...prev, newService]);
  };
  
  const restoreDefaultServices = () => {
    setServices(DEFAULT_SERVICES);
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
      const newExpense: Expense = {
          ...expenseData,
          id: `EXP${Date.now()}`,
      };
      setExpenses(prev => [newExpense, ...prev]);
  };

  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
      const newEmployee: Employee = {
          ...employeeData,
          id: `EMP${Date.now()}`,
      };
      setEmployees(prev => [newEmployee, ...prev]);
  }

  const updateEmployee = (updatedEmployee: Employee) => {
      setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
  }

  const deleteEmployee = (employeeId: string) => {
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
  }

  const value = {
    theme, setTheme,
    language, setLanguage,
    direction, t,
    isAuthenticated, user, login, signup, logout,
    services, updateServicePrice, addService, restoreDefaultServices,
    orders, addOrder, updateOrderStatus,
    expenses, addExpense,
    employees, addEmployee, updateEmployee, deleteEmployee,
    notifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
