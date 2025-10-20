
import { Service } from './types';

export const DEFAULT_SERVICES: Service[] = [
  { id: '1', name: 'BOUBOU', price: 50 },
  { id: '2', name: 'CHEMISE', price: 30 },
  { id: '3', name: 'PANTALON', price: 30 },
  { id: '4', name: 'VOILE', price: 30 },
  { id: '5', name: 'ROBE', price: 20 },
  { id: '6', name: 'GOMME', price: 10 },
];

export const PAYMENT_METHODS: string[] = [
  'Cash', 'Click', 'Moov Money', 'BCI Pay', 'Amanety', 'Bankily', 'Sedad', 'Masrivi', 'Bim Bank'
];

export const ORDER_STATUSES = ['pending', 'processing', 'ready', 'completed', 'cancelled'];
