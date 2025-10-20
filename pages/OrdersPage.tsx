
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Order, OrderItem, Service, OrderStatus } from '../types';
import { SearchIcon, PlusIcon, MinusIcon, TrashIcon, XIcon, EditIcon } from '../components/icons';
import { PAYMENT_METHODS, ORDER_STATUSES } from '../constants';

const OrdersPage: React.FC = () => {
    const { t, orders, addOrder, updateOrderStatus, services, user } = useAppContext();
    const location = useLocation();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

    useEffect(() => {
        if (location.state?.openAddOrderModal) {
            setIsModalOpen(true);
        }
    }, [location.state]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.clientPhone.includes(searchTerm) ||
                `#${order.orderNumber}`.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);
    
    const handleAddOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
        addOrder(orderData);
        alert(t('order_added_successfully'));
        setIsModalOpen(false);
    };

    const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
        updateOrderStatus(orderId, newStatus);
        alert(t('order_updated_successfully'));
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'ready': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                 <div className="relative w-full sm:w-auto">
                    <SearchIcon className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('searchOrders')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 bg-foreground-light dark:bg-foreground-dark border border-gray-300 dark:border-gray-600 rounded-full py-2 ltr:pl-10 rtl:pr-10 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
                    />
                </div>
                 <div className="flex w-full sm:w-auto gap-2 overflow-x-auto pb-2">
                     <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'all' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('all')}</button>
                     {ORDER_STATUSES.map(status => (
                        <button key={status} onClick={() => setStatusFilter(status as OrderStatus)} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${statusFilter === status ? 'bg-primary-DEFAULT text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t(status as any)}</button>
                     ))}
                 </div>
            </div>

            <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('orderNo')}</th>
                                <th scope="col" className="px-6 py-3">{t('client')}</th>
                                <th scope="col" className="px-6 py-3">{t('total')}</th>
                                <th scope="col" className="px-6 py-3">{t('status')}</th>
                                <th scope="col" className="px-6 py-3">{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="bg-foreground-light dark:bg-foreground-dark border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order.orderNumber}</td>
                                    <td className="px-6 py-4">{order.clientName}</td>
                                    <td className="px-6 py-4">{order.totalPrice} {t('MRU')}</td>
                                    <td className="px-6 py-4">
                                        {user?.role === 'manager' ? (
                                             <select 
                                                value={order.status} 
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                                className={`${getStatusColor(order.status)} text-xs font-medium px-2.5 py-1 rounded-full border-transparent focus:border-primary-DEFAULT focus:ring-0`}
                                             >
                                                {ORDER_STATUSES.map(s => <option key={s} value={s}>{t(s as any)}</option>)}
                                             </select>
                                        ) : (
                                            <span className={`${getStatusColor(order.status)} text-xs font-medium px-2.5 py-1 rounded-full`}>{t(order.status as any)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <AddOrderModal services={services} onClose={() => setIsModalOpen(false)} onSave={handleAddOrder} />}
        </div>
    );
};

interface AddOrderModalProps {
    onClose: () => void;
    onSave: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
    services: Service[];
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ onClose, onSave, services }) => {
    const { t } = useAppContext();
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
    const [notes, setNotes] = useState('');

    const totalPrice = useMemo(() => {
        return orderItems.reduce((total, item) => total + item.quantity * item.price, 0);
    }, [orderItems]);
    
    const handleItemChange = (service: Service, quantity: number) => {
        if (quantity < 0) return;
        
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.serviceId === service.id);
            if (quantity === 0) {
                return prevItems.filter(item => item.serviceId !== service.id);
            }
            if (existingItem) {
                return prevItems.map(item => item.serviceId === service.id ? { ...item, quantity } : item);
            }
            return [...prevItems, { serviceId: service.id, serviceName: service.name, price: service.price, quantity }];
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!clientName || !clientPhone || orderItems.length === 0) {
            alert("Please fill all required fields.");
            return;
        }
        onSave({ clientName, clientPhone, items: orderItems, totalPrice, paymentMethod, status: 'pending', notes });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold">{t('newOrder')}</h3>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <input type="text" placeholder={t('clientName')} value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <input type="tel" placeholder={t('clientPhone')} value={clientPhone} onChange={e => setClientPhone(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    
                    <div>
                        <h4 className="font-semibold mb-2">{t('services')}</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded dark:border-gray-600">
                            {services.map(service => {
                                const currentItem = orderItems.find(item => item.serviceId === service.id);
                                const quantity = currentItem?.quantity || 0;
                                return (
                                    <div key={service.id} className="flex justify-between items-center">
                                        <span className="flex-1">{service.name} - {service.price} {t('MRU')}</span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => handleItemChange(service, quantity - 1)} className="p-1 rounded-full bg-red-500 text-white"><MinusIcon className="w-4 h-4" /></button>
                                            <span className="w-8 text-center">{quantity}</span>
                                            <button type="button" onClick={() => handleItemChange(service, quantity + 1)} className="p-1 rounded-full bg-green-500 text-white"><PlusIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600">
                        {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                    </select>
                    <textarea placeholder={t('notes')} value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" rows={2}></textarea>
                </form>
                 <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
                    <div className="text-lg font-bold">{t('totalPrice')}: <span className="text-primary-DEFAULT">{totalPrice} {t('MRU')}</span></div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">{t('cancel')}</button>
                        <button onClick={handleSubmit} className="px-4 py-2 rounded bg-primary-DEFAULT text-white">{t('save')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default OrdersPage;
