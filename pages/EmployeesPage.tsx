
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Employee } from '../types';
import { PlusIcon, EditIcon, TrashIcon, XIcon } from '../components/icons';

const EmployeesPage: React.FC = () => {
    const { t, employees, addEmployee, updateEmployee, deleteEmployee } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const handleOpenModal = (employee: Employee | null = null) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(false);
    };

    const handleSaveEmployee = (employeeData: Omit<Employee, 'id'> | Employee) => {
        if ('id' in employeeData) {
            updateEmployee(employeeData);
            alert(t('employee_updated_successfully'));
        } else {
            addEmployee(employeeData);
            alert(t('employee_added_successfully'));
        }
        handleCloseModal();
    };

    const handleDeleteEmployee = (employeeId: string) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee(employeeId);
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('manageEmployees')}</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-DEFAULT text-white rounded-lg shadow hover:bg-primary-dark transition">
                    <PlusIcon className="w-5 h-5" />
                    {t('addEmployee')}
                </button>
            </div>
            
            <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {employees.map(employee => (
                        <li key={employee.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{employee.name}</p>
                                <p className="text-sm text-text_secondary-light dark:text-text_secondary-dark">{employee.phone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                    {t(employee.status)}
                                </span>
                                <button onClick={() => handleOpenModal(employee)} className="text-blue-500 hover:text-blue-700"><EditIcon /></button>
                                <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && <EmployeeModal employee={editingEmployee} onSave={handleSaveEmployee} onClose={handleCloseModal} />}
        </div>
    );
};


interface EmployeeModalProps {
    employee: Employee | null;
    onClose: () => void;
    onSave: (employeeData: Omit<Employee, 'id'> | Employee) => void;
}
const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, onSave }) => {
    const { t } = useAppContext();
    const [name, setName] = useState(employee?.name || '');
    const [phone, setPhone] = useState(employee?.phone || '');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'active' | 'disabled'>(employee?.status || 'active');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (phone.length !== 8) {
            setError(t('8_digit_phone'));
            return;
        }
        if (!employee && !password) {
            setError('Password is required for new employees.');
            return;
        }
        
        const employeeData = { name, phone, status, ...(password && { password }) };

        if (employee) {
            onSave({ ...employee, ...employeeData });
        } else {
            onSave(employeeData as Omit<Employee, 'id'>);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold">{employee ? t('edit') : t('addEmployee')}</h3>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="bg-red-100 text-red-700 p-2 rounded-md">{error}</p>}
                    <input type="text" placeholder={t('employeeName')} value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <input type="tel" placeholder={t('employeePhone')} value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <input type="password" placeholder={employee ? t('resetPassword') : t('password')} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <div>
                        <label className="block mb-2 text-sm font-medium">{t('employeeStatus')}</label>
                        <select value={status} onChange={e => setStatus(e.target.value as 'active' | 'disabled')} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600">
                            <option value="active">{t('active')}</option>
                            <option value="disabled">{t('disabled')}</option>
                        </select>
                    </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary-DEFAULT text-white">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeesPage;
