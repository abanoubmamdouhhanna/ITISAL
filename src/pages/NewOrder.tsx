
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CustomerLookup from '@/components/CustomerLookup';
import { Customer, Address, Store } from '@/lib/types';
import { findStoreById } from '@/services/storeService';
import AnimatedTransition from '@/components/AnimatedTransition';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const NewOrder = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [step, setStep] = useState<'customer-lookup' | 'order-details'>('customer-lookup');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSelectCustomer = async (selectedCustomer: Customer, selectedAddress: Address) => {
    setCustomer(selectedCustomer);
    setAddress(selectedAddress);
    setLoading(true);
    
    try {
      // Find store that serves this address
      const storeForAddress = await findStoreById(selectedAddress.storeId);
      
      if (storeForAddress) {
        setStore(storeForAddress);
        setStep('order-details');
        toast.success(`Store ${storeForAddress.name} selected for this address`);
        
        // Navigate to POS screen with customer and store info
        navigate('/pos', { 
          state: { 
            customer: selectedCustomer,
            address: selectedAddress,
            store: storeForAddress,
          } 
        });
      } else {
        toast.error(language === 'en' ? 'No store found for this address' : 'لا يوجد متجر لهذا العنوان');
      }
    } catch (error) {
      console.error('Error finding store:', error);
      toast.error(language === 'en' ? 'Failed to find store for this address' : 'فشل في العثور على متجر لهذا العنوان');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AnimatedTransition location="new-order">
      <div className="flex flex-col min-h-screen">
        <Header 
          title={language === 'en' ? 'New Order' : 'طلب جديد'} 
          showBackButton={true}
        />
        
        <main className="flex-1 container mx-auto py-6 sm:py-10 px-2 sm:px-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 sm:mb-10 text-center px-2">
              <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                {language === 'en' ? 'Create New Order' : 'إنشاء طلب جديد'}
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                {language === 'en' ? 'Enter customer\'s phone number to start a new order' : 'أدخل رقم هاتف العميل لبدء طلب جديد'}
              </p>
            </div>
            
            {step === 'customer-lookup' && (
              <CustomerLookup onSelectCustomer={handleSelectCustomer} />
            )}
            
            {loading && (
              <p className="text-center mt-4">
                {language === 'en' ? 'Loading store information...' : 'جاري تحميل معلومات المتجر...'}
              </p>
            )}
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default NewOrder;
