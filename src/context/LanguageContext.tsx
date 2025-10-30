import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { fetchTranslationsByLanguage, fetchAvailableLanguages } from '@/services/translationService';

// Define the language type - now supports any string for flexibility
export type Language = string;

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  isRTL: boolean;
  availableLanguages: { code: string; name: string; isRTL: boolean }[];
  loadingTranslations: boolean;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
  availableLanguages: [],
  loadingTranslations: true,
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Fallback translations (used when database is loading or unavailable)
const fallbackTranslations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.language': 'Language',
    'app.english': 'English',
    'app.arabic': 'Arabic',
    'app.back': 'Back',
    'app.dashboard': 'Dashboard',
    'app.newOrder': 'New Order',
    'app.loading': 'Loading...',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'chat.typeMessage': 'Type a message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    'chat.typing': 'typing...',
    'chat.today': 'Today',
    'chat.yesterday': 'Yesterday',
    // Management (English fallback)
    'management.title': 'Management Dashboard',
    'management.realtimeAnalytics': 'Real-time analytics',
    'management.refresh': 'Refresh',
    'management.last24Hours': 'Last 24 hours',
    'management.last7Days': 'Last 7 days',
    'management.last30Days': 'Last 30 days',
    'management.last90Days': 'Last 90 days',
    'management.filterStore': 'Filter by store',
    'management.allStores': 'All stores',
    'management.totalOrders': 'Total Orders',
    'management.openOrders': 'Open Orders',
    'management.deliveredOrders': 'Delivered Orders',
    'management.totalRevenue': 'Total Revenue',
    'management.byStore': 'Orders by store',
    'management.avg': 'Avg',
    'management.ofTotal': 'of total',
    'management.completion': 'Completion',
    'management.orderTrend': 'Order Trend',
    'management.dailyOrdersRevenue': 'Daily orders & revenue',
    'management.orders': 'Orders',
    'management.revenue': 'Revenue',
    'management.orderStatusDistribution': 'Order Status Distribution',
    'management.breakdownByStatus': 'Breakdown by status',
    'management.orderManagement': 'Order Management',
    'management.viewManageOrders': 'View and manage orders',
    // Order status translations (English)
    'status.orderReceived': 'Order Received',
    'status.storeReceived': 'Store Received',
  },
  ar: {
    // Common
    'app.language': 'اللغة',
    'app.english': 'الإنجليزية',
    'app.arabic': 'العربية',
    'app.back': 'رجوع',
    'app.dashboard': 'لوحة التحكم',
    'app.newOrder': 'طلب جديد',
    'app.loading': 'جاري التحميل...',
    'app.save': 'حفظ',
    'app.cancel': 'إلغاء',
    'chat.typeMessage': 'اكتب رسالة...',
    'chat.send': 'إرسال',
    'chat.online': 'متصل',
    'chat.typing': 'يكتب...',
    'chat.today': 'اليوم',
    'chat.yesterday': 'أمس',
    
    // Header
    'header.pizzaShop': 'لوحة تحكم متجر البيتزا',
    
    // Index page
    'index.managementDashboard': 'لوحة الإدارة',
    'index.orders': 'الطلبات',
    'index.ordersTotal': '{count} طلب إجمالي',
    'index.noOrders': 'لا توجد طلبات',
    'index.listView': 'عرض القائمة',
    'index.kanbanView': 'عرض كانبان',
    
    // 404 page
    '404.oops': 'عفواً! الصفحة غير موجودة',
    '404.returnHome': 'العودة إلى الصفحة الرئيسية',
    
    // New Order
    'newOrder.title': 'طلب جديد',
    'newOrder.createTitle': 'إنشاء طلب جديد',
    'newOrder.enterPhone': 'أدخل رقم هاتف العميل لبدء طلب جديد',
    'newOrder.loadingStore': 'جاري تحميل معلومات المتجر...',
    
    // Order Status - Removing underscores here
    'status.orderReceived': 'تم استلام الطلب',
    'status.storeReceived': 'تم استلام المتجر',
    'status.orderStarted': 'بدأ الطلب',
    'status.deliveryBoySelected': 'تم اختيار عامل التوصيل',
    'status.invoicePrinted': 'تمت طباعة الفاتورة',
    'status.orderDelivered': 'تم توصيل الطلب',
    'status.select': 'اختر الحالة',
    'status.allOrders': 'جميع الطلبات',
    
    // Customer and Orders
    'customer.phone': 'رقم الهاتف',
    'customer.name': 'اسم العميل',
    'customer.address': 'العنوان',
    'customer.history': 'سجل طلبات العميل',
    'customer.noOrders': 'لا توجد طلبات سابقة لهذا العميل',
    'customer.orderNum': 'طلب #',
    'customer.items': 'العناصر',
    'customer.total': 'المجموع',
    'customer.payment': 'الدفع',
    'customer.editOrder': 'تعديل الطلب',
    'customer.cannotEdit': 'لا يمكن تعديل الطلب بالحالة',
    
    // Customer Best Items
    'bestItems.title': 'العناصر المفضلة للعميل',
    'bestItems.noFavorites': 'لم يطلب هذا العميل عناصر كافية لتحديد المفضلات بعد',
    'bestItems.ordered': 'طُلب {count} {times}',
    'bestItems.time': 'مرة',
    'bestItems.times': 'مرات',
    'bestItems.addToCart': 'أضف إلى السلة',
    
    // Complaints
    'complaints.title': 'تقديم شكوى جديدة',
    'complaints.placeholder': 'ما هي المشكلة التي تود الإبلاغ عنها؟',
    'complaints.submit': 'تقديم شكوى',
    'complaints.submitting': 'جاري التقديم...',
    'complaints.previous': 'الشكاوى السابقة',
    'complaints.loading': 'جاري تحميل الشكاوى...',
    'complaints.noComplaints': 'لا توجد شكاوى سابقة',
    'complaints.resolved': 'تم الحل',
    'complaints.open': 'شكوى مفتوحة',
    
    // POS Screen
    'pos.orderDetails': 'تفاصيل الطلب',
    'pos.customerDetails': 'تفاصيل العميل',
    'pos.storeDetails': 'تفاصيل المتجر',
    'pos.productCatalog': 'كتالوج المنتجات',
    'pos.cart': 'سلة التسوق',
    'pos.orderTotal': 'إجمالي الطلب',
    'pos.paymentMethod': 'طريقة الدفع',
    'pos.cash': 'نقدا',
    'pos.creditCard': 'بطاقة ائتمان',
    'pos.placeOrder': 'تقديم الطلب',
    'pos.cancelOrder': 'إلغاء الطلب',
    'pos.confirmOrder': 'تأكيد الطلب',
    'pos.addToCart': 'أضف إلى السلة',
    'pos.remove': 'إزالة',
    'pos.editItem': 'تعديل العنصر',
    'pos.emptyCart': 'سلة التسوق فارغة',
    'pos.lastOrders': 'آخر الطلبات',
    'pos.bestItems': 'أفضل العناصر',
    'pos.complaints': 'الشكاوى',
    
    // Item Editor
    'itemEditor.notes': 'ملاحظات',
    'itemEditor.discount': 'خصم (%)',
    'itemEditor.applyChanges': 'تطبيق التغييرات',
    'itemEditor.specialInstructions': 'أضف تعليمات خاصة لهذا العنصر...',
    'itemEditor.success': 'تم تحديث العنصر بنجاح',
    
    // Management
    'management.title': 'لوحة الإدارة',
    'management.totalOrders': 'إجمالي الطلبات',
    'management.openOrders': 'الطلبات المفتوحة',
    'management.deliveredOrders': 'الطلبات التي تم توصيلها',
    'management.totalRevenue': 'إجمالي الإيرادات',
    'management.byStore': 'الطلبات حسب المتجر',
    'management.filterStore': 'تصفية حسب المتجر',
    'management.allStores': 'جميع المتاجر',
    
    // PWA install prompt text
    'app.installApp': 'تثبيت التطبيق',
    'app.pwaInstalled': 'تم تثبيت التطبيق',
    'app.pwaInstallInstructions': 'أضف إلى الشاشة الرئيسية',
    
    // Login page
    'login.title': 'تسجيل الدخول إلى جولدن بوكس',
    'login.usernamePlaceholder': 'أدخل اسم المستخدم',
    'login.passwordPlaceholder': 'أدخل كلمة المرور',
    'login.button': 'تسجيل الدخول',
    'login.error': 'اسم المستخدم أو كلمة المرور غير صحيحة',

    // Setup page translations - Removing underscores here
    'SetupStores': 'المتاجر',
    'SetupStoresDescription': 'إدارة إعدادات المتاجر',
    'SetupAddStore': 'إضافة متجر',
    'SetupStoreCode': 'رمز المتجر',
    'SetupStoreEngName': 'اسم المتجر بالإنجليزية',
    'SetupStoreArName': 'اسم المتجر بالعربية',
    'SetupEditStore': 'تعديل المتجر',
    'SetupNoStores': 'لا توجد متاجر',
    'SetupRegions': 'المناطق',
    'SetupRegionsDescription': 'إدارة إعدادات المناطق',
    'SetupAddRegion': 'إضافة منطقة',
    'SetupRegionCode': 'رمز المنطقة',
    'SetupRegionEngName': 'اسم المنطقة بالإنجليزية',
    'SetupRegionArName': 'اسم المنطقة بالعربية',
    'SetupDeliveryValue': 'قيمة التوصيل',
    'SetupEditRegion': 'تعديل المنطقة',
    'SetupNoRegions': 'لا توجد مناطق',
    'SetupUsers': 'المستخدمون',
    'SetupUsersDescription': 'إدارة مستخدمي النظام',
    'SetupAddUser': 'إضافة مستخدم',
    'SetupUserCode': 'رمز المستخدم',
    'SetupUserName': 'اسم المستخدم',
    'SetupPassword': 'كلمة المرور',
    'SetupIsAdmin': 'مسؤول',
    'SetupEditUser': 'تعديل المستخدم',
    'SetupNoUsers': 'لا يوجد مستخدمون',
    'SetupSecurity': 'الأمان',
    'SetupSecurityDescription': 'إدارة صلاحيات المستخدمين',
    'SetupUserPermissions': 'صلاحيات المستخدم',
    'SetupSelectUser': 'اختر المستخدم',
    'SetupAdminAllPermissions': 'المسؤول لديه جميع الصلاحيات',
    'SetupAdminPermissionsNote': 'يتمتع المسؤولون بوصول كامل إلى جميع الميزات',
    'SetupStoreRegions': 'مناطق المتجر',
    'SetupStoreRegionsDescription': 'إدارة روابط المتجر بالمنطقة',
    'SetupAddLink': 'أضف رابط',
    'SetupSelectStore': 'اختر متجر',
    'SetupSelectRegion': 'اختر منطقة',
    'SetupCancel': 'إلغاء',
    'SetupSave': 'حفظ',
    'SetupNoLinks': 'لا توجد روابط',
    'SetupStore': 'متجر',
    'SetupRegion': 'منطقة',
    'SetupActions': 'إجراءات',
    'SetupConfirmDelete': 'هل أنت متأكد أنك تريد حذف هذا؟',
    'SetupFillAllFields': 'يرجى ملء جميع الحقول',
    'SetupLinkAlreadyExists': 'هذا الرابط موجود بالفعل',
    'SetupSelectStoreAndRegion': 'الرجاء تحديد متجر ومنطقة',
    'SetupEdit': 'تعديل',
    'SetupDelete': 'حذف',
    'SetupAddLinkSuccess': 'تمت إضافة الرابط بنجاح',
    'SetupDeleteLinkSuccess': 'تم حذف الرابط بنجاح',
    'SetupAllowStoreSetup': 'السماح بإعداد المتجر',
    'SetupAllowStoreSetupDesc': 'السماح للمستخدم بإدارة إعدادات المتجر',
    'SetupAllowRegionSetup': 'السماح بإعداد المنطقة',
    'SetupAllowRegionSetupDesc': 'السماح للمستخدم بإدارة إعدادات المنطقة',
    'SetupAllowNewCustomer': 'السماح بعميل جديد',
    'SetupAllowNewCustomerDesc': 'السماح للمستخدم بإضافة عملاء جدد',
    'SetupAllowItemGroupsSetup': 'السماح بإعداد مجموعات العناصر',
    'SetupAllowItemGroupsSetupDesc': 'السماح للمستخدم بإدارة إعدادات مجموعات العناصر',
    'SetupAllowUserSetup': 'السماح بإعداد المستخدم',
    'SetupAllowUserSetupDesc': 'السماح للمستخدم بإدارة إعدادات المستخدم',
    'SetupSavePermissions': 'حفظ الأذونات',
    'SetupUser': 'المستخدم',
    'SetupNewCustomer': 'عميل جديد',
    'SetupItemGroupsSetup': 'إعداد مجموعات العناصر',
    'SetupAdmin': 'مسؤول',
    'SetupYes': 'نعم',
    'SetupNo': 'لا',

    // New Order page translations
    'NewOrderTitle': 'طلب جديد',
    'NewOrderCreateTitle': 'إنشاء طلب جديد',
    'NewOrderEnterPhone': 'أدخل رقم هاتف العميل لبدء طلب جديد',
    'NewOrderLoadingStore': 'جاري تحميل معلومات المتجر...',
  }
};

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get the language from localStorage, default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });
  
  // State to hold translations from database
  const [dbTranslations, setDbTranslations] = useState<Record<string, Record<string, string>>>({
    en: {},
    ar: {}
  });
  
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string; isRTL: boolean }[]>([]);
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  // Check if the current language is RTL (right-to-left)
  // RTL languages: Arabic (ar), Hebrew (he), Urdu (ur), Persian (fa)
  const rtlLanguages = ['ar', 'he', 'ur', 'fa'];
  const isRTL = rtlLanguages.includes(language);
  
  // Load available languages and translations from database on mount
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoadingTranslations(true);
        
        // Fetch available languages
        const languages = await fetchAvailableLanguages();
        setAvailableLanguages(languages);
        
        // Initialize with empty translations for all languages
        const initialTranslations: Record<string, Record<string, string>> = {};
        languages.forEach(lang => {
          initialTranslations[lang.code] = {};
        });
        
        setDbTranslations(initialTranslations);
        
        // Load translations for all available languages
        const translationsPromises = languages.map(lang => 
          fetchTranslationsByLanguage(lang.code).catch((error) => {
            console.error(`Error loading translations for ${lang.code}:`, error);
            return {};
          })
        );
        
        const translationsResults = await Promise.all(translationsPromises);
        
        const translationsMap: Record<string, Record<string, string>> = {};
        languages.forEach((lang, index) => {
          translationsMap[lang.code] = translationsResults[index] || {};
        });
        
        setDbTranslations(translationsMap);
      } catch (error) {
        console.error('Error loading translations from database:', error);
        // Ensure we have at least the basic structure
        setDbTranslations({
          en: {},
          ar: {}
        });
      } finally {
        setIsLoadingTranslations(false);
      }
    };
    
    loadTranslations();
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Set the dir attribute on the html element
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add or remove RTL class from body
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  // Translation function - prioritize database translations, fallback to hardcoded
  const t = (key: string, variables?: Record<string, string | number>) => {
    let value: string | undefined;

    // Try to get from database first - with proper null checking
    if (dbTranslations[language] && dbTranslations[language][key]) {
      value = dbTranslations[language][key];
    }
    
    // Fallback to hardcoded translations if not found in database
    if (!value && fallbackTranslations[language] && fallbackTranslations[language][key]) {
      value = fallbackTranslations[language][key];
    }
    
    // If still not found, return the key itself
    if (!value) {
      console.warn(`Translation key not found: ${key} for language: ${language}`);
      value = key;
    }
    
    // Handle variable substitution
    if (variables) {
      return Object.entries(variables).reduce((acc, [varKey, varValue]) => {
        return acc.replace(`{${varKey}}`, String(varValue));
      }, value);
    }
    
    return value;
  };

  // Context value
  const contextValue = {
    language,
    setLanguage,
    t,
    isRTL,
    availableLanguages,
    loadingTranslations: isLoadingTranslations
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;