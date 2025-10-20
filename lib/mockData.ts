
import { Order, Expense, Employee, Notification } from '../types';

export const mockOrders: Order[] = [
  {
    id: '1', orderNumber: 1001, clientName: 'Moussa Ali', clientPhone: '22334455',
    items: [{ serviceId: '1', serviceName: 'BOUBOU', quantity: 2, price: 50 }, { serviceId: '2', serviceName: 'CHEMISE', quantity: 3, price: 30 }],
    totalPrice: 190, paymentMethod: 'Bankily', status: 'completed', createdAt: '2023-10-27T10:00:00Z'
  },
  {
    id: '2', orderNumber: 1002, clientName: 'Fatima Ahmed', clientPhone: '44556677',
    items: [{ serviceId: '3', serviceName: 'PANTALON', quantity: 5, price: 30 }],
    totalPrice: 150, paymentMethod: 'Cash', status: 'ready', createdAt: '2023-10-27T11:30:00Z'
  },
  {
    id: '3', orderNumber: 1003, clientName: 'Yacoub Sidi', clientPhone: '33445566',
    items: [{ serviceId: '4', serviceName: 'VOILE', quantity: 10, price: 30 }],
    totalPrice: 300, paymentMethod: 'Click', status: 'processing', createdAt: '2023-10-28T09:00:00Z'
  },
  {
    id: '4', orderNumber: 1004, clientName: 'Mariam Mint', clientPhone: '20304050',
    items: [{ serviceId: '5', serviceName: 'ROBE', quantity: 4, price: 20 }, { serviceId: '6', serviceName: 'GOMME', quantity: 1, price: 10 }],
    totalPrice: 90, paymentMethod: 'Cash', status: 'pending', createdAt: '2023-10-28T14:00:00Z'
  },
];

export const mockExpenses: Expense[] = [
  { id: '1', title: 'Detergent', amount: 1500, date: '2023-10-25' },
  { id: '2', title: 'Electricity Bill', amount: 3500, date: '2023-10-28' },
  { id: '3', title: 'Rent', amount: 10000, date: '2023-10-01' },
];

export const mockEmployees: Employee[] = [
    { id: '1', name: 'Brahim Salem', phone: '41424344', status: 'active' },
    { id: '2', name: 'Aicha Fall', phone: '36373839', status: 'active' },
    { id: '3', name: 'Sidi Mohamed', phone: '28292021', status: 'disabled' },
];

export const mockNotifications: Notification[] = [
    { id: 1, title: 'Unpaid Order', message: 'Order #1002 for Fatima Ahmed is ready but remains unpaid.', type: 'warning', seen: false, createdAt: '2023-10-27T12:00:00Z'},
    { id: 2, title: 'New Employee Order', message: 'Employee Brahim Salem has added a new order #1004.', type: 'info', seen: true, createdAt: '2023-10-28T14:05:00Z'}
];
