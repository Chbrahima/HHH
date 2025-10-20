
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Order } from '../types';
import { WashingMachineIcon, XIcon } from '../components/icons';

const InvoicesPage: React.FC = () => {
  const { t, orders } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('invoices')}</h2>
      
      <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t('orderNo')}</th>
                <th scope="col" className="px-6 py-3">{t('client')}</th>
                <th scope="col" className="px-6 py-3">{t('total')}</th>
                <th scope="col" className="px-6 py-3">{t('date')}</th>
                <th scope="col" className="px-6 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map(order => (
                <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4">#{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.clientName}</td>
                  <td className="px-6 py-4">{order.totalPrice} {t('MRU')}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedOrder(order)} className="font-medium text-primary-DEFAULT hover:underline">{t('view')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedOrder && <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};


interface InvoiceModalProps {
    order: Order;
    onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
    const { t, user } = useAppContext();

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-to-print');
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // To restore event listeners
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold">{t('invoice')} #{order.orderNumber}</h3>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                
                <div id="invoice-to-print" className="p-6 overflow-y-auto text-black dark:text-white bg-white dark:bg-gray-900">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <WashingMachineIcon className="h-10 w-10 text-primary-DEFAULT" />
                                <h1 className="text-3xl font-bold text-primary-DEFAULT">Pressy</h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{user?.laundryName}</p>
                            <p className="text-gray-600 dark:text-gray-400">{user?.phone}</p>
                            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold uppercase">{t('invoice')}</h2>
                            <p>#{order.orderNumber}</p>
                            <p>{t('date')}: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-bold mb-1">{t('billTo')}</h4>
                        <p>{order.clientName}</p>
                        <p>{order.clientPhone}</p>
                    </div>
                    <table className="w-full mb-6">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                <th className="p-2 text-left">{t('services')}</th>
                                <th className="p-2 text-center">{t('quantity')}</th>
                                <th className="p-2 text-right">{t('price')}</th>
                                <th className="p-2 text-right">{t('total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.serviceId} className="border-b dark:border-gray-600">
                                    <td className="p-2">{item.serviceName}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right">{item.price} {t('MRU')}</td>
                                    <td className="p-2 text-right">{item.price * item.quantity} {t('MRU')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs">
                            <div className="flex justify-between font-bold text-lg p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <span>{t('totalPrice')}</span>
                                <span>{order.totalPrice} {t('MRU')}</span>
                            </div>
                        </div>
                    </div>
                     <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>{t('paymentMethod')}:</strong> {order.paymentMethod}</p>
                    </div>
                </div>
                <div className="flex justify-end items-center p-4 border-t dark:border-gray-700">
                    <button onClick={handlePrint} className="px-6 py-2 rounded bg-primary-DEFAULT text-white">{t('print')}</button>
                </div>
            </div>
        </div>
    );
};

export default InvoicesPage;
