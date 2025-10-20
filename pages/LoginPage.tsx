
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { WashingMachineIcon } from '../components/icons';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup, t } = useAppContext();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [laundryName, setLaundryName] = useState('');
    const [managerName, setManagerName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const success = login({ phone, password });
            if (!success) {
                setError(t('something_went_wrong'));
            }
        } else {
            if (phone.length !== 8) {
                setError(t('8_digit_phone'));
                return;
            }
            const success = signup({ phone, password, laundryName, managerName, email });
            if (!success) {
                setError(t('something_went_wrong'));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <WashingMachineIcon className="h-16 w-16 text-primary-DEFAULT mx-auto" />
                    <h1 className="text-4xl font-bold text-primary-DEFAULT mt-2">Pressy</h1>
                    <p className="text-text_secondary-light dark:text-text_secondary-dark mt-2">{isLogin ? t('welcome_back') : t('manage_your_laundry')}</p>
                </div>

                <div className="bg-foreground-light dark:bg-foreground-dark p-8 rounded-lg shadow-2xl">
                    <h2 className="text-2xl font-bold text-center text-text_primary-light dark:text-text_primary-dark mb-6">
                        {isLogin ? t('login_to_pressy') : t('signup_for_pressy')}
                    </h2>
                    
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    placeholder={t('laundryName')}
                                    value={laundryName}
                                    onChange={(e) => setLaundryName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
                                />
                                <input
                                    type="text"
                                    placeholder={t('managerName')}
                                    value={managerName}
                                    onChange={(e) => setManagerName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
                                />
                            </>
                        )}
                        <input
                            type="tel"
                            placeholder={t('phone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
                        />
                        {!isLogin && (
                            <input
                                type="email"
                                placeholder={t('optional_email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
                            />
                        )}
                        <input
                            type="password"
                            placeholder={t('password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
                        />
                        <button
                            type="submit"
                            className="w-full bg-primary-DEFAULT hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition duration-300"
                        >
                            {isLogin ? t('login') : t('signup')}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-text_secondary-light dark:text-text_secondary-dark">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="font-semibold text-primary-DEFAULT hover:underline ltr:ml-1 rtl:mr-1">
                            {isLogin ? t('signup') : t('login')}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
