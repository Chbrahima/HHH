
export type UserRole = 'manager' | 'employee';
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'fr' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  laundryName?: string;
  logo?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  clientName: string;
  clientPhone: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  employeeId?: string;
  notes?: string;
}

export interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
    notes?: string;
}

export interface Employee {
    id: string;
    name: string;
    phone: string;
    status: 'active' | 'disabled';
    password?: string; // only for creation/reset
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  seen: boolean;
  createdAt: string;
}
