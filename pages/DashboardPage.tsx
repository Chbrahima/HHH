
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../hooks/useAppContext';
import { Order } from '../types';
import { CheckCircleIcon, AlertTriangleIcon, InfoIcon, PlusIcon } from '../components/icons';

const DashboardPage: React.FC = () => {
    const { t, user, orders, notifications } = useAppContext();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(o => o.createdAt.startsWith(today));
    const totalOrdersToday = todaysOrders.length;
    const completedOrders = todaysOrders.filter(o => o.status === 'completed').length;
    const unpaidOrders = orders.filter(o => o.status === 'ready').length;
    const dailyIncome = todaysOrders.reduce((sum, o) => o.status === 'completed' ? sum + o.totalPrice : sum, 0);

    const weeklyIncomeData = Array(7).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const day = d.toLocaleDateString(undefined, { weekday: 'short' });
        const income = orders
            .filter(o => o.createdAt.startsWith(d.toISOString().split('T')[0]) && o.status === 'completed')
            .reduce((sum, o) => sum + o.totalPrice, 0);
        return { name: day, [t('income')]: income };
    }).reverse();

    const getNotificationIcon = (type: 'info' | 'warning' | 'success') => {
        switch (type) {
            case 'info': return <InfoIcon className="text-blue-500" />;
            case 'warning': return <AlertTriangleIcon className="text-yellow-500" />;
            case 'success': return <CheckCircleIcon className="text-green-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text_primary-light dark:text-text_primary-dark">
                {t('dashboard')}
            </h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title={t('totalOrdersToday')} value={totalOrdersToday.toString()} />
                <StatCard title={t('completedOrders')} value={completedOrders.toString()} />
                <StatCard title={t('unpaidOrders')} value={unpaidOrders.toString()} />
                <StatCard title={t('dailyIncome')} value={`${dailyIncome} ${t('MRU')}`} />
            </div>

            {/* Weekly Income Chart */}
            <div className="bg-foreground-light dark:bg-foreground-dark p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">{t('weeklyIncome')}</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={weeklyIncomeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                    borderColor: '#3b82f6',
                                    color: '#f8fafc',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                            <Bar dataKey={t('income')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Notifications */}
            {user?.role === 'manager' && notifications.length > 0 && (
                <div className="bg-foreground-light dark:bg-foreground-dark p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                    <ul className="space-y-3">
                        {notifications.filter(n => !n.seen).slice(0, 3).map(n => (
                            <li key={n.id} className="flex items-start gap-3 p-3 bg-secondary-light dark:bg-slate-700 rounded-md">
                                <div className="flex-shrink-0 mt-1">{getNotificationIcon(n.type)}</div>
                                <div>
                                    <p className="font-bold">{n.title}</p>
                                    <p className="text-sm text-text_secondary-light dark:text-text_secondary-dark">{n.message}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <button
                onClick={() => navigate('/orders', { state: { openAddOrderModal: true } })}
                className="fixed bottom-24 ltr:right-6 rtl:left-6 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
                aria-label={t('addOrder')}
            >
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
    <div className="bg-foreground-light dark:bg-foreground-dark p-4 rounded-lg shadow-md text-center">
        <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark">{title}</h4>
        <p className="text-2xl font-bold text-primary-DEFAULT mt-1">{value}</p>
    </div>
);


export default DashboardPage;
