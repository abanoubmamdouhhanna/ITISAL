import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// All translation keys with English and Arabic translations
export const initialTranslations = {
  // Common
  'app.language': { en: 'Language', ar: 'اللغة' },
  'app.english': { en: 'English', ar: 'الإنجليزية' },
  'app.arabic': { en: 'Arabic', ar: 'العربية' },
  'app.back': { en: 'Back', ar: 'رجوع' },
  'app.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'app.newOrder': { en: 'New Order', ar: 'طلب جديد' },
  'app.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'app.save': { en: 'Save', ar: 'حفظ' },
  'app.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'app.apply': { en: 'Apply', ar: 'تطبيق' },
  'app.close': { en: 'Close', ar: 'إغلاق' },
  'app.edit': { en: 'Edit', ar: 'تعديل' },
  'app.delete': { en: 'Delete', ar: 'حذف' },
  'app.search': { en: 'Search', ar: 'بحث' },
  'app.login': { en: 'Login', ar: 'تسجيل الدخول' },
  'app.logout': { en: 'Logout', ar: 'تسجيل الخروج' },
  'app.username': { en: 'Username', ar: 'اسم المستخدم' },
  'app.password': { en: 'Password', ar: 'كلمة المرور' },
  'app.submit': { en: 'Submit', ar: 'إرسال' },
  'app.installApp': { en: 'Install App', ar: 'تثبيت التطبيق' },
  'app.pwaInstalled': { en: 'App installed', ar: 'تم تثبيت التطبيق' },
  'app.pwaInstallInstructions': { en: 'Add to Home Screen', ar: 'أضف إلى الشاشة الرئيسية' },

  // Chat
  'chat.typeMessage': { en: 'Type a message...', ar: 'اكتب رسالة...' },
  'chat.send': { en: 'Send', ar: 'إرسال' },
  'chat.online': { en: 'Online', ar: 'متصل' },
  'chat.typing': { en: 'typing...', ar: 'يكتب...' },
  'chat.today': { en: 'Today', ar: 'اليوم' },
  'chat.yesterday': { en: 'Yesterday', ar: 'أمس' },

  // Header
  'header.pizzaShop': { en: 'Pizza Shop Dashboard', ar: 'لوحة تحكم متجر البيتزا' },

  // Index page
  'index.managementDashboard': { en: 'Management Dashboard', ar: 'لوحة الإدارة' },
  'index.orders': { en: 'Orders', ar: 'الطلبات' },
  'index.ordersTotal': { en: '{count} orders total', ar: '{count} طلب إجمالي' },
  'index.noOrders': { en: 'No orders found', ar: 'لا توجد طلبات' },
  'index.listView': { en: 'List View', ar: 'عرض القائمة' },
  'index.kanbanView': { en: 'Kanban View', ar: 'عرض كانبان' },

  // 404 page
  '404.oops': { en: 'Oops! Page not found', ar: 'عفواً! الصفحة غير موجودة' },
  '404.returnHome': { en: 'Return to Home', ar: 'العودة إلى الصفحة الرئيسية' },

  // New Order
  'newOrder.title': { en: 'New Order', ar: 'طلب جديد' },
  'newOrder.createTitle': { en: 'Create New Order', ar: 'إنشاء طلب جديد' },
  'newOrder.enterPhone': { en: "Enter customer's phone number to start a new order", ar: 'أدخل رقم هاتف العميل لبدء طلب جديد' },
  'newOrder.loadingStore': { en: 'Loading store information...', ar: 'جاري تحميل معلومات المتجر...' },

  // Order Status
  'status.orderReceived': { en: 'Order Received', ar: 'تم استلام الطلب' },
  'status.storeReceived': { en: 'Store Received', ar: 'تم استلام المتجر' },
  'status.orderStarted': { en: 'Order Started', ar: 'بدأ الطلب' },
  'status.deliveryBoySelected': { en: 'Delivery Boy Selected', ar: 'تم اختيار عامل التوصيل' },
  'status.invoicePrinted': { en: 'Invoice Printed', ar: 'تمت طباعة الفاتورة' },
  'status.orderDelivered': { en: 'Order Delivered', ar: 'تم توصيل الطلب' },
  'status.select': { en: 'Select status', ar: 'اختر الحالة' },
  'status.allOrders': { en: 'All Orders', ar: 'جميع الطلبات' },

  // Customer and Orders
  'customer.phone': { en: 'Phone Number', ar: 'رقم الهاتف' },
  'customer.name': { en: 'Customer Name', ar: 'اسم العميل' },
  'customer.address': { en: 'Address', ar: 'العنوان' },
  'customer.history': { en: "Customer's Order History", ar: 'سجل طلبات العميل' },
  'customer.noOrders': { en: 'No previous orders found for this customer', ar: 'لا توجد طلبات سابقة لهذا العميل' },
  'customer.orderNum': { en: 'Order #', ar: 'طلب #' },
  'customer.items': { en: 'Items', ar: 'العناصر' },
  'customer.total': { en: 'Total', ar: 'المجموع' },
  'customer.payment': { en: 'Payment', ar: 'الدفع' },
  'customer.editOrder': { en: 'Edit Order', ar: 'تعديل الطلب' },
  'customer.cannotEdit': { en: 'Cannot edit order with status', ar: 'لا يمكن تعديل الطلب بالحالة' },

  // Customer Best Items
  'bestItems.title': { en: "Customer's Favorite Items", ar: 'العناصر المفضلة للعميل' },
  'bestItems.noFavorites': { en: "This customer hasn't ordered enough items to determine favorites yet", ar: 'لم يطلب هذا العميل عناصر كافية لتحديد المفضلات بعد' },
  'bestItems.ordered': { en: 'Ordered {count} {times}', ar: 'طُلب {count} {times}' },
  'bestItems.time': { en: 'time', ar: 'مرة' },
  'bestItems.times': { en: 'times', ar: 'مرات' },
  'bestItems.addToCart': { en: 'Add to Cart', ar: 'أضف إلى السلة' },

  // Complaints
  'complaints.title': { en: 'Submit New Complaint', ar: 'تقديم شكوى جديدة' },
  'complaints.placeholder': { en: 'What issue would you like to report?', ar: 'ما هي المشكلة التي تود الإبلاغ عنها؟' },
  'complaints.submit': { en: 'Submit Complaint', ar: 'تقديم شكوى' },
  'complaints.submitting': { en: 'Submitting...', ar: 'جاري التقديم...' },
  'complaints.previous': { en: 'Previous Complaints', ar: 'الشكاوى السابقة' },
  'complaints.loading': { en: 'Loading complaints...', ar: 'جاري تحميل الشكاوى...' },
  'complaints.noComplaints': { en: 'No previous complaints found', ar: 'لا توجد شكاوى سابقة' },
  'complaints.resolved': { en: 'Resolved', ar: 'تم الحل' },
  'complaints.open': { en: 'Open Complaint', ar: 'شكوى مفتوحة' },

  // POS Screen
  'pos.orderDetails': { en: 'Order Details', ar: 'تفاصيل الطلب' },
  'pos.customerDetails': { en: 'Customer Details', ar: 'تفاصيل العميل' },
  'pos.storeDetails': { en: 'Store Details', ar: 'تفاصيل المتجر' },
  'pos.productCatalog': { en: 'Product Catalog', ar: 'كتالوج المنتجات' },
  'pos.cart': { en: 'Cart', ar: 'سلة التسوق' },
  'pos.orderTotal': { en: 'Order Total', ar: 'إجمالي الطلب' },
  'pos.paymentMethod': { en: 'Payment Method', ar: 'طريقة الدفع' },
  'pos.cash': { en: 'Cash', ar: 'نقدا' },
  'pos.creditCard': { en: 'Credit Card', ar: 'بطاقة ائتمان' },
  'pos.placeOrder': { en: 'Place Order', ar: 'تقديم الطلب' },
  'pos.cancelOrder': { en: 'Cancel Order', ar: 'إلغاء الطلب' },
  'pos.confirmOrder': { en: 'Confirm Order', ar: 'تأكيد الطلب' },
  'pos.addToCart': { en: 'Add to Cart', ar: 'أضف إلى السلة' },
  'pos.remove': { en: 'Remove', ar: 'إزالة' },
  'pos.editItem': { en: 'Edit Item', ar: 'تعديل العنصر' },
  'pos.emptyCart': { en: 'Your cart is empty', ar: 'سلة التسوق فارغة' },
  'pos.lastOrders': { en: 'Last Orders', ar: 'آخر الطلبات' },
  'pos.bestItems': { en: 'Best Items', ar: 'أفضل العناصر' },
  'pos.complaints': { en: 'Complaints', ar: 'الشكاوى' },

  // Item Editor
  'itemEditor.notes': { en: 'Notes', ar: 'ملاحظات' },
  'itemEditor.discount': { en: 'Discount (%)', ar: 'خصم (%)' },
  'itemEditor.applyChanges': { en: 'Apply Changes', ar: 'تطبيق التغييرات' },
  'itemEditor.specialInstructions': { en: 'Add special instructions for this item...', ar: 'أضف تعليمات خاصة لهذا العنصر...' },
  'itemEditor.success': { en: 'Item updated successfully', ar: 'تم تحديث العنصر بنجاح' },

  // Management
  'management.title': { en: 'Management Dashboard', ar: 'لوحة الإدارة' },
  'management.totalOrders': { en: 'Total Orders', ar: 'إجمالي الطلبات' },
  'management.openOrders': { en: 'Open Orders', ar: 'الطلبات المفتوحة' },
  'management.deliveredOrders': { en: 'Delivered Orders', ar: 'الطلبات المُوصّلة' },
  'management.totalRevenue': { en: 'Total Revenue', ar: 'إجمالي الإيرادات' },
  'management.byStore': { en: 'Orders by Store', ar: 'الطلبات حسب المتجر' },
  'management.filterStore': { en: 'Filter by Store', ar: 'تصفية حسب المتجر' },
  'management.allStores': { en: 'All Stores', ar: 'جميع المتاجر' },
  'management.orderManagement': { en: 'Order Management', ar: 'إدارة الطلبات' },

  // Login page
  'login.title': { en: 'Login to Golden Box', ar: 'تسجيل الدخول إلى جولدن بوكس' },
  'login.usernamePlaceholder': { en: 'Enter your username', ar: 'أدخل اسم المستخدم' },
  'login.passwordPlaceholder': { en: 'Enter your password', ar: 'أدخل كلمة المرور' },
  'login.button': { en: 'Login', ar: 'تسجيل الدخول' },
  'login.error': { en: 'Invalid username or password', ar: 'اسم المستخدم أو كلمة المرور غير صحيحة' },

  // Setup pages
  'SetupStores': { en: 'Stores', ar: 'المتاجر' },
  'SetupStoresDescription': { en: 'Manage store configurations', ar: 'إدارة إعدادات المتاجر' },
  'SetupAddStore': { en: 'Add Store', ar: 'إضافة متجر' },
  'SetupStoreCode': { en: 'Store Code', ar: 'رمز المتجر' },
  'SetupStoreEngName': { en: 'Store English Name', ar: 'اسم المتجر بالإنجليزية' },
  'SetupStoreArName': { en: 'Store Arabic Name', ar: 'اسم المتجر بالعربية' },
  'SetupEditStore': { en: 'Edit Store', ar: 'تعديل المتجر' },
  'SetupNoStores': { en: 'No stores found', ar: 'لا توجد متاجر' },
  'SetupBrands': { en: 'Brands', ar: 'العلامات التجارية' },
  'SetupBrandsDescription': { en: 'Manage brand configurations', ar: 'إدارة إعدادات العلامات التجارية' },
  'SetupAddBrand': { en: 'Add Brand', ar: 'إضافة علامة تجارية' },
  'SetupEditBrand': { en: 'Edit Brand', ar: 'تعديل علامة تجارية' },
  'SetupBrandEngName': { en: 'Brand English Name', ar: 'اسم العلامة التجارية بالإنجليزية' },
  'SetupBrandArName': { en: 'Brand Arabic Name', ar: 'اسم العلامة التجارية بالعربية' },
  'SetupBrandImage': { en: 'Brand Image', ar: 'صورة العلامة التجارية' },
  'SetupBrandImagePlaceholder': { en: 'Enter image URL', ar: 'أدخل رابط الصورة' },
  'SetupNoBrands': { en: 'No brands found', ar: 'لا توجد علامات تجارية' },
  'SetupRegions': { en: 'Regions', ar: 'المناطق' },
  'SetupRegionsDescription': { en: 'Manage region configurations', ar: 'إدارة إعدادات المناطق' },
  'SetupAddRegion': { en: 'Add Region', ar: 'إضافة منطقة' },
  'SetupRegionCode': { en: 'Region Code', ar: 'رمز المنطقة' },
  'SetupRegionEngName': { en: 'Region English Name', ar: 'اسم المنطقة بالإنجليزية' },
  'SetupRegionArName': { en: 'Region Arabic Name', ar: 'اسم المنطقة بالعربية' },
  'SetupDeliveryValue': { en: 'Delivery Value', ar: 'قيمة التوصيل' },
  'SetupEditRegion': { en: 'Edit Region', ar: 'تعديل المنطقة' },
  'SetupNoRegions': { en: 'No regions found', ar: 'لا توجد مناطق' },
  'SetupUsers': { en: 'Users', ar: 'المستخدمون' },
  'SetupUsersDescription': { en: 'Manage system users', ar: 'إدارة مستخدمي النظام' },
  'SetupAddUser': { en: 'Add User', ar: 'إضافة مستخدم' },
  'SetupUserCode': { en: 'User Code', ar: 'رمز المستخدم' },
  'SetupUserName': { en: 'User Name', ar: 'اسم المستخدم' },
  'SetupPassword': { en: 'Password', ar: 'كلمة المرور' },
  'SetupIsAdmin': { en: 'Is Admin', ar: 'مسؤول' },
  'SetupEditUser': { en: 'Edit User', ar: 'تعديل المستخدم' },
  'SetupNoUsers': { en: 'No users found', ar: 'لا يوجد مستخدمون' },
  'SetupSecurity': { en: 'Security', ar: 'الأمان' },
  'SetupSecurityDescription': { en: 'Manage user permissions', ar: 'إدارة صلاحيات المستخدمين' },
  'SetupUserPermissions': { en: 'User Permissions', ar: 'صلاحيات المستخدم' },
  'SetupSelectUser': { en: 'Select User', ar: 'اختر المستخدم' },
  'SetupAdminAllPermissions': { en: 'Admin has all permissions', ar: 'المسؤول لديه جميع الصلاحيات' },
  'SetupAdminPermissionsNote': { en: 'Administrators have full access to all features', ar: 'يتمتع المسؤولون بوصول كامل إلى جميع الميزات' },
  'SetupStoreRegions': { en: 'Store Regions', ar: 'مناطق المتجر' },
  'SetupStoreRegionsDescription': { en: 'Manage store to region links', ar: 'إدارة روابط المتجر بالمنطقة' },
  'SetupAddLink': { en: 'Add Link', ar: 'أضف رابط' },
  'SetupSelectStore': { en: 'Select Store', ar: 'اختر متجر' },
  'SetupSelectRegion': { en: 'Select Region', ar: 'اختر منطقة' },
  'SetupCancel': { en: 'Cancel', ar: 'إلغاء' },
  'SetupSave': { en: 'Save', ar: 'حفظ' },
  'SetupNoLinks': { en: 'No links found', ar: 'لا توجد روابط' },
  'SetupStore': { en: 'Store', ar: 'متجر' },
  'SetupRegion': { en: 'Region', ar: 'منطقة' },
  'SetupActions': { en: 'Actions', ar: 'إجراءات' },
  'SetupConfirmDelete': { en: 'Are you sure you want to delete this?', ar: 'هل أنت متأكد أنك تريد حذف هذا؟' },
  'SetupFillAllFields': { en: 'Please fill all fields', ar: 'يرجى ملء جميع الحقول' },
  'SetupLinkAlreadyExists': { en: 'This link already exists', ar: 'هذا الرابط موجود بالفعل' },
  'SetupSelectStoreAndRegion': { en: 'Please select a store and a region', ar: 'الرجاء تحديد متجر ومنطقة' },
  'SetupEdit': { en: 'Edit', ar: 'تعديل' },
  'SetupDelete': { en: 'Delete', ar: 'حذف' },
  'SetupAddLinkSuccess': { en: 'Link added successfully', ar: 'تمت إضافة الرابط بنجاح' },
  'SetupDeleteLinkSuccess': { en: 'Link deleted successfully', ar: 'تم حذف الرابط بنجاح' },
  'SetupAllowStoreSetup': { en: 'Allow Store Setup', ar: 'السماح بإعداد المتجر' },
  'SetupAllowStoreSetupDesc': { en: 'Allow user to manage store settings', ar: 'السماح للمستخدم بإدارة إعدادات المتجر' },
  'SetupAllowRegionSetup': { en: 'Allow Region Setup', ar: 'السماح بإعداد المنطقة' },
  'SetupAllowRegionSetupDesc': { en: 'Allow user to manage region settings', ar: 'السماح للمستخدم بإدارة إعدادات المنطقة' },
  'SetupAllowNewCustomer': { en: 'Allow New Customer', ar: 'السماح بعميل جديد' },
  'SetupAllowNewCustomerDesc': { en: 'Allow user to add new customers', ar: 'السماح للمستخدم بإضافة عملاء جدد' },
  'SetupAllowItemGroupsSetup': { en: 'Allow Item Groups Setup', ar: 'السماح بإعداد مجموعات العناصر' },
  'SetupAllowItemGroupsSetupDesc': { en: 'Allow user to manage item groups settings', ar: 'السماح للمستخدم بإدارة إعدادات مجموعات العناصر' },
  'SetupAllowUserSetup': { en: 'Allow User Setup', ar: 'السماح بإعداد المستخدم' },
  'SetupAllowUserSetupDesc': { en: 'Allow user to manage user settings', ar: 'السماح للمستخدم بإدارة إعدادات المستخدم' },
  'SetupSavePermissions': { en: 'Save Permissions', ar: 'حفظ الأذونات' },
  'SetupUser': { en: 'User', ar: 'المستخدم' },
  'SetupNewCustomer': { en: 'New Customer', ar: 'عميل جديد' },
  'SetupItemGroupsSetup': { en: 'Item Groups Setup', ar: 'إعداد مجموعات العناصر' },
  'SetupAdmin': { en: 'Admin', ar: 'مسؤول' },
  'SetupYes': { en: 'Yes', ar: 'نعم' },
  'SetupNo': { en: 'No', ar: 'لا' },

  // New Order page translations (alternative keys)
  'NewOrderTitle': { en: 'New Order', ar: 'طلب جديد' },
  'NewOrderCreateTitle': { en: 'Create New Order', ar: 'إنشاء طلب جديد' },
  'NewOrderEnterPhone': { en: "Enter customer's phone number to start a new order", ar: 'أدخل رقم هاتف العميل لبدء طلب جديد' },
  'NewOrderLoadingStore': { en: 'Loading store information...', ar: 'جاري تحميل معلومات المتجر...' },

  // Language Management page
  'lang.title': { en: 'Language Management', ar: 'إدارة اللغات' },
  'lang.description': { en: 'Manage languages and translations for your application', ar: 'إدارة اللغات والترجمات لتطبيقك' },
  
  // Setup Menu
  'setup.title': { en: 'Setup', ar: 'الإعدادات' },
  'setup.stores': { en: 'Stores', ar: 'المتاجر' },
  'setup.storesDescription': { en: 'Manage store configurations', ar: 'إدارة إعدادات المتاجر' },
  'setup.brands': { en: 'Brands', ar: 'العلامات التجارية' },
  'setup.brandsDescription': { en: 'Manage brand configurations', ar: 'إدارة إعدادات العلامات التجارية' },
  'setup.regions': { en: 'Regions', ar: 'المناطق' },
  'setup.regionsDescription': { en: 'Manage region configurations', ar: 'إدارة إعدادات المناطق' },
  'setup.regions_description': { en: 'Manage region configurations and delivery values', ar: 'إدارة إعدادات المناطق وقيم التوصيل' },
  'setup.add_region': { en: 'Add Region', ar: 'إضافة منطقة' },
  'setup.region_code': { en: 'Region Code', ar: 'رمز المنطقة' },
  'setup.region_eng_name': { en: 'English Name', ar: 'الاسم بالإنجليزية' },
  'setup.region_ar_name': { en: 'Arabic Name', ar: 'الاسم بالعربية' },
  'setup.delivery_value': { en: 'Delivery Value', ar: 'قيمة التوصيل' },
  'setup.actions': { en: 'Actions', ar: 'الإجراءات' },
  'setup.storeRegions': { en: 'Store Regions', ar: 'مناطق المتجر' },
  'setup.storeRegionsDescription': { en: 'Manage store to region links', ar: 'إدارة روابط المتجر بالمنطقة' },
  'setup.store_regions': { en: 'Store Regions', ar: 'مناطق المتجر' },
  'setup.store_regions_description': { en: 'Link stores to their service regions', ar: 'ربط المتاجر بمناطق الخدمة الخاصة بها' },
  'setup.add_link': { en: 'Add Link', ar: 'إضافة رابط' },
  'setup.store': { en: 'Store', ar: 'متجر' },
  'setup.region': { en: 'Region', ar: 'منطقة' },
  'setup.items': { en: 'Items', ar: 'العناصر' },
  'setup.itemsDescription': { en: 'Manage product items and groups', ar: 'إدارة عناصر ومجموعات المنتجات' },
  'setup.items_description': { en: 'Configure product catalog and pricing', ar: 'تكوين كتالوج المنتجات والتسعير' },
  'setup.itemGroupsSetupDesc': { en: 'Manage item groups settings', ar: 'إدارة إعدادات مجموعات العناصر' },
  'setup.users': { en: 'Users', ar: 'المستخدمون' },
  'setup.usersDescription': { en: 'Manage system users', ar: 'إدارة مستخدمي النظام' },
  'setup.users_description': { en: 'Manage system users and access', ar: 'إدارة مستخدمي النظام والوصول' },
  'setup.add_user': { en: 'Add User', ar: 'إضافة مستخدم' },
  'setup.user_code': { en: 'User Code', ar: 'رمز المستخدم' },
  'setup.user_name': { en: 'User Name', ar: 'اسم المستخدم' },
  'setup.is_admin': { en: 'Is Admin', ar: 'مسؤول' },
  'setup.yes': { en: 'Yes', ar: 'نعم' },
  'setup.no': { en: 'No', ar: 'لا' },
  'setup.security': { en: 'Security', ar: 'الأمان' },
  'setup.securityDescription': { en: 'Manage user permissions', ar: 'إدارة صلاحيات المستخدمين' },
  'setup.security_description': { en: 'Configure user roles and permissions', ar: 'تكوين أدوار وصلاحيات المستخدمين' },
  'setup.user_permissions': { en: 'User Permissions', ar: 'صلاحيات المستخدم' },
  'setup.select_user': { en: 'Select User', ar: 'اختر المستخدم' },
  'setup.user': { en: 'User', ar: 'المستخدم' },
  'setup.store_setup': { en: 'Store Setup', ar: 'إعداد المتجر' },
  'setup.region_setup': { en: 'Region Setup', ar: 'إعداد المنطقة' },
  'setup.new_customer': { en: 'New Customer', ar: 'عميل جديد' },
  'setup.item_groups_setup': { en: 'Item Groups Setup', ar: 'إعداد مجموعات العناصر' },
  'setup.user_setup': { en: 'User Setup', ar: 'إعداد المستخدم' },
  'setup.admin': { en: 'Admin', ar: 'مسؤول' },
  'setup.languageSetup': { en: 'Language Setup', ar: 'إعداد اللغة' },
  'setup.languageSetupDesc': { en: 'Manage translations for all languages', ar: 'إدارة الترجمات لجميع اللغات' },
  'setup.noPermission': { en: 'You do not have permission to access this page', ar: 'ليس لديك صلاحية للوصول إلى هذه الصفحة' },
  'setup.confirm_delete': { en: 'Are you sure you want to delete this?', ar: 'هل أنت متأكد أنك تريد حذف هذا؟' },
  'setup.fill_all_fields': { en: 'Please fill all fields', ar: 'يرجى ملء جميع الحقول' },
  'setup.no_items_or_groups': { en: 'No items or groups yet', ar: 'لا توجد عناصر أو مجموعات بعد' },
  'setup.new_group': { en: 'New Group', ar: 'مجموعة جديدة' },
  'setup.new_item': { en: 'New Item', ar: 'عنصر جديد' },
  'setup.edit_group': { en: 'Edit Group', ar: 'تعديل المجموعة' },
  'setup.group_details': { en: 'Group Details', ar: 'تفاصيل المجموعة' },
  'setup.item_details': { en: 'Item Details', ar: 'تفاصيل العنصر' },
  'setup.edit_item': { en: 'Edit Item', ar: 'تعديل العنصر' },
  'setup.group_code': { en: 'Group Code', ar: 'رمز المجموعة' },
  'setup.group_eng_name': { en: 'Group English Name', ar: 'اسم المجموعة بالإنجليزية' },
  'setup.group_ar_name': { en: 'Group Arabic Name', ar: 'اسم المجموعة بالعربية' },
  'setup.item_code': { en: 'Item Code', ar: 'رمز العنصر' },
  'setup.item_eng_name': { en: 'Item English Name', ar: 'اسم العنصر بالإنجليزية' },
  'setup.item_ar_name': { en: 'Item Arabic Name', ar: 'اسم العنصر بالعربية' },
  'setup.item_group': { en: 'Item Group', ar: 'مجموعة العنصر' },
  'setup.select_group': { en: 'Select a group', ar: 'اختر مجموعة' },
  'setup.uom': { en: 'Unit of Measure', ar: 'وحدة القياس' },
  'setup.price': { en: 'Price', ar: 'السعر' },
  
  // Common actions (more specific)
  'common.add': { en: 'Add', ar: 'إضافة' },
  'common.edit': { en: 'Edit', ar: 'تعديل' },
  'common.delete': { en: 'Delete', ar: 'حذف' },
  'common.remove': { en: 'Remove', ar: 'إزالة' },
  'common.close': { en: 'Close', ar: 'إغلاق' },
  'common.open': { en: 'Open', ar: 'فتح' },
  'common.select': { en: 'Select', ar: 'اختر' },
  'common.selectAddress': { en: 'Select Address', ar: 'اختر العنوان' },
  'common.pleaseSelectAddress': { en: 'Please select an address', ar: 'الرجاء اختيار عنوان' },
  'common.addNewCustomer': { en: 'Add a new customer to the system', ar: 'إضافة عميل جديد إلى النظام' },
  'common.deliveryAddress': { en: 'Delivery address', ar: 'عنوان التوصيل' },
  'common.credit': { en: 'Credit', ar: 'ائتمان' },
  'common.resolved': { en: 'Resolved', ar: 'تم الحل' },
  'common.openComplaint': { en: 'Open Complaint', ar: 'شكوى مفتوحة' },
  'common.noCustomerSelected': { en: 'No customer selected', ar: 'لم يتم اختيار عميل' },
  'common.selectAndContinue': { en: 'Select and Continue', ar: 'اختر واستمر' },
  'common.createNewCustomer': { en: 'Create New Customer', ar: 'إنشاء عميل جديد' },
  'common.region': { en: 'Region', ar: 'المنطقة' },
  'common.selectRegion': { en: 'Select region', ar: 'اختر المنطقة' },
  'common.paymentMethods': { en: 'Payment Methods', ar: 'طرق الدفع' },
  'common.cash': { en: 'Cash', ar: 'نقداً' },
  'common.visa': { en: 'Visa', ar: 'فيزا' },
  'lang.totalLanguages': { en: 'Total Languages', ar: 'إجمالي اللغات' },
  'lang.translations': { en: 'Translations', ar: 'الترجمات' },
  'lang.populateAll': { en: 'Populate All Translations', ar: 'تعبئة جميع الترجمات' },
  'lang.populating': { en: 'Populating...', ar: 'جاري التعبئة...' },
  'lang.languages': { en: 'Languages', ar: 'اللغات' },
  'lang.manageLanguages': { en: 'Manage available languages', ar: 'إدارة اللغات المتاحة' },
  'lang.addLanguage': { en: 'Add Language', ar: 'إضافة لغة' },
  'lang.editLanguage': { en: 'Edit Language', ar: 'تعديل اللغة' },
  'lang.addNewLanguage': { en: 'Add New Language', ar: 'إضافة لغة جديدة' },
  'lang.languageCode': { en: 'Language Code', ar: 'رمز اللغة' },
  'lang.name': { en: 'Name', ar: 'الاسم' },
  'lang.nativeName': { en: 'Native Name', ar: 'الاسم الأصلي' },
  'lang.rtlLanguage': { en: 'Right-to-Left (RTL) language', ar: 'لغة من اليمين إلى اليسار (RTL)' },
  'lang.active': { en: 'Active', ar: 'نشط' },
  'lang.inactive': { en: 'Inactive', ar: 'غير نشط' },
  'lang.rtl': { en: 'RTL', ar: 'RTL' },
  'lang.status': { en: 'Status', ar: 'الحالة' },
  'lang.code': { en: 'Code', ar: 'الرمز' },
  'lang.noLanguages': { en: 'No languages found. Add your first language to get started.', ar: 'لم يتم العثور على لغات. أضف لغتك الأولى للبدء.' },
  'lang.deleteLanguage': { en: 'Delete Language', ar: 'حذف اللغة' },
  'lang.deleteLanguageConfirm': { en: 'Are you sure you want to delete "{name}"? This will also delete all translations for this language.', ar: 'هل أنت متأكد أنك تريد حذف "{name}"؟ سيؤدي هذا أيضًا إلى حذف جميع الترجمات لهذه اللغة.' },
  'lang.languageDeleted': { en: 'Language deleted successfully', ar: 'تم حذف اللغة بنجاح' },
  'lang.languageUpdated': { en: 'Language updated successfully', ar: 'تم تحديث اللغة بنجاح' },
  'lang.languageCreated': { en: 'Language created successfully', ar: 'تم إنشاء اللغة بنجاح' },
  'lang.codeAndNameRequired': { en: 'Code and name are required', ar: 'الرمز والاسم مطلوبان' },
  'lang.saving': { en: 'Saving...', ar: 'جاري الحفظ...' },
  'lang.update': { en: 'Update', ar: 'تحديث' },
  'lang.create': { en: 'Create', ar: 'إنشاء' },
  'lang.translationKeys': { en: 'Translation Keys', ar: 'مفاتيح الترجمة' },
  'lang.manageTranslations': { en: 'Manage translations for each language', ar: 'إدارة الترجمات لكل لغة' },
  'lang.selectLanguage': { en: 'Select a language', ar: 'اختر لغة' },
  'lang.filterByLanguage': { en: 'Filter by Language', ar: 'تصفية حسب اللغة' },
  'lang.allLanguages': { en: 'All Languages', ar: 'جميع اللغات' },
  'lang.addTranslation': { en: 'Add Translation', ar: 'إضافة ترجمة' },
  'lang.editTranslation': { en: 'Edit Translation', ar: 'تعديل الترجمة' },
  'lang.addNewTranslation': { en: 'Add New Translation', ar: 'إضافة ترجمة جديدة' },
  'lang.key': { en: 'Key', ar: 'المفتاح' },
  'lang.translationKey': { en: 'Translation Key', ar: 'مفتاح الترجمة' },
  'lang.translatedText': { en: 'Translated Text', ar: 'النص المترجم' },
  'lang.category': { en: 'Category', ar: 'الفئة' },
  'lang.optional': { en: 'Optional', ar: 'اختياري' },
  'lang.value': { en: 'Value', ar: 'القيمة' },
  'lang.noTranslations': { en: 'No translations found. Select a language and add translations.', ar: 'لم يتم العثور على ترجمات. اختر لغة وأضف ترجمات.' },
  'lang.selectLanguageFirst': { en: 'Select a language to view translations', ar: 'اختر لغة لعرض الترجمات' },
  'lang.deleteTranslation': { en: 'Delete Translation', ar: 'حذف الترجمة' },
  'lang.deleteTranslationConfirm': { en: 'Are you sure you want to delete this translation?', ar: 'هل أنت متأكد أنك تريد حذف هذه الترجمة؟' },
  'lang.translationDeleted': { en: 'Translation deleted successfully', ar: 'تم حذف الترجمة بنجاح' },
  'lang.translationUpdated': { en: 'Translation updated successfully', ar: 'تم تحديث الترجمة بنجاح' },
  'lang.translationCreated': { en: 'Translation created successfully', ar: 'تم إنشاء الترجمة بنجاح' },
  'lang.keyValueLanguageRequired': { en: 'Key, value, and language are required', ar: 'المفتاح والقيمة واللغة مطلوبة' },
  'lang.actions': { en: 'Actions', ar: 'الإجراءات' },
};

/**
 * Populate the database with initial translations
 * This will check if languages exist, create them if needed, and then add all translations
 */
export const populateInitialTranslations = async () => {
  try {
    const languages = ['en', 'ar'];
    
    // First, ensure languages exist
    for (const langCode of languages) {
      const { data: existingLang } = await supabase
        .from('languages')
        .select('id')
        .eq('code', langCode)
        .single();
      
      if (!existingLang) {
        // Create language if it doesn't exist
        const languageData = {
          code: langCode,
          name: langCode === 'en' ? 'English' : 'Arabic',
          native_name: langCode === 'en' ? 'English' : 'العربية',
          is_rtl: langCode === 'ar',
          is_active: true
        };
        
        const { error } = await supabase
          .from('languages')
          .insert(languageData);
        
        if (error) {
          console.error(`Error creating ${langCode} language:`, error);
          throw error;
        }
      }
    }
    
    // Prepare translation records
    const translationRecords: Array<{
      key_name: string;
      language_code: string;
      translated_text: string;
      group_category: string;
    }> = [];
    
    Object.entries(initialTranslations).forEach(([key, translations]) => {
      languages.forEach(langCode => {
        const category = key.split('.')[0] || 'general';
        translationRecords.push({
          key_name: key,
          language_code: langCode,
          translated_text: translations[langCode as 'en' | 'ar'],
          group_category: category
        });
      });
    });
    
    // Check which translations already exist
    const { data: existingTranslations } = await supabase
      .from('language_setup')
      .select('key_name, language_code');
    
    const existingKeys = new Set(
      (existingTranslations || []).map(t => `${t.key_name}:${t.language_code}`)
    );
    
    // Filter out translations that already exist
    const newTranslations = translationRecords.filter(
      t => !existingKeys.has(`${t.key_name}:${t.language_code}`)
    );
    
    if (newTranslations.length === 0) {
      toast.info('All translations already exist in the database');
      return { added: 0, skipped: translationRecords.length };
    }
    
    // Insert new translations in batches (Supabase has a limit)
    const batchSize = 100;
    let totalAdded = 0;
    
    for (let i = 0; i < newTranslations.length; i += batchSize) {
      const batch = newTranslations.slice(i, i + batchSize);
      const { error } = await supabase
        .from('language_setup')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting translation batch:', error);
        throw error;
      }
      
      totalAdded += batch.length;
    }
    
    toast.success(`Successfully added ${totalAdded} translations to the database`);
    return {
      added: totalAdded,
      skipped: translationRecords.length - totalAdded
    };
  } catch (error) {
    console.error('Error populating translations:', error);
    toast.error('Failed to populate translations. Check console for details.');
    throw error;
  }
};
