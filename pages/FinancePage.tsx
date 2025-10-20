import React, { useMemo, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PlusIcon, XIcon } from '../components/icons';

const FinancePage: React.FC = () => {
    const { t, orders, expenses, addExpense } = useAppContext();
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

    const income = useMemo(() => 
        orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0),
    [orders]);
    
    const totalExpenses = useMemo(() => 
        expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]);

    const profit = income - totalExpenses;

    const data = [
        { name: t('income'), value: income },
        { name: t('expenses'), value: totalExpenses },
    ];
    const COLORS = ['#3b82f6', '#ef4444'];
    
    const handleAddExpense = (expenseData: {title: string, amount: number, date: string, notes?: string}) => {
        addExpense(expenseData);
        setExpenseModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('finance')}</h2>
                <button onClick={() => setExpenseModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-DEFAULT text-white rounded-lg shadow hover:bg-primary-dark transition">
                    <PlusIcon className="w-5 h-5" />
                    {t('addExpense')}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <StatCard title={t('income')} value={income} currency={t('MRU')} color="text-green-500" />
                <StatCard title={t('expenses')} value={totalExpenses} currency={t('MRU')} color="text-red-500" />
                <StatCard title={t('profit')} value={profit} currency={t('MRU')} color="text-primary-DEFAULT" />
            </div>

            <div className="bg-foreground-light dark:bg-foreground-dark p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-center">Income vs Expenses</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {isExpenseModalOpen && <AddExpenseModal onSave={handleAddExpense} onClose={() => setExpenseModalOpen(false)} />}
        </div>
    );
};

const StatCard: React.FC<{title: string, value: number, currency: string, color: string}> = ({ title, value, currency, color }) => (
    <div className="bg-foreground-light dark:bg-foreground-dark p-4 rounded-lg shadow-md">
        <h4 className="text-md font-medium text-text_secondary-light dark:text-text_secondary-dark">{title}</h4>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value.toLocaleString()} <span className="text-xl">{currency}</span></p>
    </div>
);

interface AddExpenseModalProps {
    onClose: () => void;
    onSave: (data: {title: string, amount: number, date: string, notes?: string}) => void;
}
const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose, onSave }) => {
    const { t } = useAppContext();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!title || isNaN(numAmount) || numAmount <= 0) {
            alert('Please provide a valid title and amount.');
            return;
        }
        onSave({ title, amount: numAmount, date, notes });
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold">{t('addExpense')}</h3>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" placeholder={t('expense_title')} value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <input type="number" placeholder={t('amount')} value={amount} onChange={e => setAmount(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <textarea placeholder={t('notes')} value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" rows={3}></textarea>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary-DEFAULT text-white">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinancePage;