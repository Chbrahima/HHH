
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { CheckCircleIcon } from '../components/icons';

const SubscriptionPage: React.FC = () => {
  const { t } = useAppContext();

  // Mock subscription data
  const currentPlan = {
    name: 'Free Trial',
    expiry: '7 days remaining',
  };

  const plans = [
    {
      name: 'Basic',
      price: 300,
      duration: t('monthly'),
      features: ['Up to 5 employees', '1000 orders/month', 'Basic analytics'],
    },
    {
      name: 'Premium',
      price: 3000,
      duration: t('yearly'),
      features: ['Unlimited employees', 'Unlimited orders', 'Advanced analytics', 'Cloud backup', 'Priority support'],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{t('subscription')}</h2>
        <p className="text-text_secondary-light dark:text_secondary-dark mt-2">
          {t('currentPlan')}: <span className="font-semibold text-primary-DEFAULT">{currentPlan.name}</span> ({currentPlan.expiry})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-foreground-light dark:bg-foreground-dark rounded-lg shadow-lg p-6 flex flex-col">
            <h3 className="text-2xl font-bold text-primary-DEFAULT text-center">{plan.name}</h3>
            <p className="text-center text-text_secondary-light dark:text_secondary-dark mt-2">{plan.duration}</p>
            <p className="text-4xl font-extrabold text-center my-6">
              {plan.price} <span className="text-lg font-medium">{t('MRU')}</span>
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 ltr:mr-2 rtl:ml-2 flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-primary-DEFAULT text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition mt-auto">
              Choose Plan
            </button>
          </div>
        ))}
      </div>

      <div className="text-center p-6 bg-secondary-light dark:bg-slate-700 rounded-lg">
        <h4 className="font-semibold text-lg">Pay with your favorite local apps</h4>
        <p className="text-text_secondary-light dark:text_secondary-dark mt-2">
            Bankily, Masrivi, Sedad, Click, Moov Money, and more...
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
