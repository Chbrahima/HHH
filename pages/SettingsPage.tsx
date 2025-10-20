
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Theme, Language, Service } from '../types';
import { SunIcon, MoonIcon, SystemIcon, EditIcon } from '../components/icons';

const SettingsPage: React.FC = () => {
    const { t, theme, setTheme, language, setLanguage, logout, user, services, updateServicePrice, addService, restoreDefaultServices } = useAppContext();
    const [laundryName, setLaundryName] = useState(user?.laundryName || '');
    const [managerName, setManagerName] = useState(user?.name || '');
    const [isEditingPrices, setIsEditingPrices] = useState(false);
    const [editedServices, setEditedServices] = useState<Service[]>(JSON.parse(JSON.stringify(services)));
    const [newServiceName, setNewServiceName] = useState('');
    const [newServicePrice, setNewServicePrice] = useState('');

    const handlePriceChange = (id: string, price: string) => {
        const numericPrice = parseFloat(price);
        if (!isNaN(numericPrice)) {
            setEditedServices(prev => prev.map(s => s.id === id ? { ...s, price: numericPrice } : s));
        }
    };

    const handleSavePrices = () => {
        editedServices.forEach(s => {
            updateServicePrice(s.id, s.price);
        });
        setIsEditingPrices(false);
        alert(t('service_prices_updated'));
    };

    const handleAddNewService = () => {
        const price = parseFloat(newServicePrice);
        if (newServiceName && !isNaN(price) && price >= 0) {
            addService({ name: newServiceName, price });
            setNewServiceName('');
            setNewServicePrice('');
        }
    };
    
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <SettingSection title={t('settings')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LanguageSelector />
                    <ThemeSelector />
                </div>
            </SettingSection>

            <SettingSection title={t('editProfile')}>
                 <div className="space-y-4">
                    <input type="text" value={laundryName} onChange={(e) => setLaundryName(e.target.value)} placeholder={t('laundryName')} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <input type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder={t('managerName')} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                    <button className="px-4 py-2 rounded bg-primary-DEFAULT text-white">{t('save')}</button>
                </div>
            </SettingSection>

            {user?.role === 'manager' && (
                <SettingSection title={t('services')}>
                    <div className="space-y-2">
                        {editedServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-2 bg-secondary-light dark:bg-slate-700 rounded-md">
                                <span>{service.name}</span>
                                {isEditingPrices ? (
                                    <input type="number" value={service.price} onChange={e => handlePriceChange(service.id, e.target.value)} className="w-24 p-1 text-right border rounded dark:bg-gray-800 dark:border-gray-600" />
                                ) : (
                                    <span>{service.price} {t('MRU')}</span>
                                )}
                            </div>
                        ))}
                    </div>
                     <div className="flex justify-between items-center mt-4">
                        {isEditingPrices ? (
                             <button onClick={handleSavePrices} className="px-4 py-2 rounded bg-green-500 text-white">{t('save')}</button>
                        ) : (
                             <button onClick={() => setIsEditingPrices(true)} className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white"><EditIcon className="w-4 h-4" />{t('edit_prices')}</button>
                        )}
                         <button onClick={restoreDefaultServices} className="px-4 py-2 rounded bg-yellow-500 text-white">{t('restore_defaults')}</button>
                    </div>
                     <div className="mt-4 pt-4 border-t dark:border-gray-600">
                        <h4 className="font-semibold mb-2">{t('add_service')}</h4>
                        <div className="flex gap-2">
                            <input type="text" placeholder={t('new_service_name')} value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="flex-grow p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                            <input type="number" placeholder={t('new_service_price')} value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} className="w-24 p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                            <button onClick={handleAddNewService} className="px-4 py-2 rounded bg-primary-DEFAULT text-white">{t('add')}</button>
                        </div>
                    </div>
                </SettingSection>
            )}

            <button onClick={logout} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition">
                {t('logout')}
            </button>
        </div>
    );
};

const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-foreground-light dark:bg-foreground-dark p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">{title}</h3>
        {children}
    </div>
);

const LanguageSelector = () => {
    const { language, setLanguage, t } = useAppContext();
    return (
        <div>
            <label className="block mb-2 font-medium">{t('language')}</label>
            <div className="flex rounded-md shadow-sm">
                <button onClick={() => setLanguage('fr')} className={`px-4 py-2 rounded-l-md w-full transition ${language === 'fr' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                    Français
                </button>
                <button onClick={() => setLanguage('ar')} className={`px-4 py-2 rounded-r-md w-full transition ${language === 'ar' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                    العربية
                </button>
            </div>
        </div>
    );
};

const ThemeSelector = () => {
    const { theme, setTheme, t } = useAppContext();
    const themes: { name: Theme, icon: React.FC<any> }[] = [
        { name: 'light', icon: SunIcon },
        { name: 'dark', icon: MoonIcon },
        { name: 'system', icon: SystemIcon }
    ];
    return (
        <div>
            <label className="block mb-2 font-medium">{t('theme')}</label>
            <div className="flex rounded-md shadow-sm bg-gray-200 dark:bg-gray-600 p-1 space-x-1">
                {themes.map(th => (
                    <button
                        key={th.name}
                        onClick={() => setTheme(th.name)}
                        className={`w-full flex justify-center items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${theme === th.name ? 'bg-white dark:bg-gray-800 text-primary-DEFAULT shadow' : 'text-gray-600 dark:text-gray-300'}`}
                    >
                        <th.icon className="w-5 h-5" />
                        {t(th.name)}
                    </button>
                ))}
            </div>
        </div>
    );
};


export default SettingsPage;
