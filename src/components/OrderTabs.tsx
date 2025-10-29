
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Package, Clock, Truck, FileText } from 'lucide-react';
import { OrderStatus } from '@/lib/types';
import OrderStatusBadge from './OrderStatusBadge';
import OrderStatusEditor from './OrderStatusEditor';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

const ALL_STATUSES: OrderStatus[] = [
  'Order Received',
  'Store Received',
  'Order Started',
  'Delivery Boy Selected',
  'Invoice Printed',
  'Order Delivered'
];

const ORDER_STATUS_ICONS = {
  'Order Received': <Check className="h-4 w-4" />,
  'Store Received': <Package className="h-4 w-4" />,
  'Order Started': <Clock className="h-4 w-4" />,
  'Delivery Boy Selected': <Truck className="h-4 w-4" />,
  'Invoice Printed': <FileText className="h-4 w-4" />,
  'Order Delivered': <Check className="h-4 w-4" />,
};

const OrderCard = ({ order, index }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { stores, customers } = useStore();
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.25, 0, 1],
      },
    }),
  };

  const handleEditOrder = () => {
    // Find the customer by ID
    const customer = customers.find(c => c.id === order.customerId);
    if (!customer) return;
    
    // Find the address from the order
    const address = customer.addresses.find(a => a.id === order.addressId) || customer.addresses[0];
    if (!address) return;
    
    // Find the store
    const store = stores.find(s => s.id === order.storeId);
    if (!store) return;
    
    // Navigate to the POS screen with the order data
    navigate('/pos', {
      state: {
        customer,
        address,
        store,
        editOrder: order.id
      }
    });
  };

  const getOrderLabel = (key: string) => {
    if (language === 'en') {
      switch (key) {
        case 'customer.name': return 'Name';
        case 'customer.items': return 'Items';
        case 'customer.total': return 'Total';
        case 'customer.payment': return 'Payment';
        case 'customer.orderNum': return 'Order #';
        default: return key;
      }
    } else {
      switch (key) {
        case 'customer.name': return 'اسم العميل';
        case 'customer.items': return 'العناصر';
        case 'customer.total': return 'المجموع';
        case 'customer.payment': return 'الدفع';
        case 'customer.orderNum': return 'طلب #';
        default: return key;
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="w-full"
    >
      <Card className="p-3 sm:p-4 h-full transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 
            className="font-medium cursor-pointer hover:text-primary hover:underline text-sm sm:text-base" 
            onClick={handleEditOrder}
          >
            {getOrderLabel('customer.orderNum')}{order.id.substring(order.id.length - 4)}
          </h3>
          <OrderStatusEditor orderId={order.id} currentStatus={order.status} />
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
          {new Date(order.createdAt).toLocaleString()}
        </div>
        <div className="mt-2 space-y-1 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">{getOrderLabel('customer.name')}:</span>
            <span className="text-sm font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">{getOrderLabel('customer.items')}:</span>
            <span className="text-sm font-medium">{order.items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">{getOrderLabel('customer.total')}:</span>
            <span className="text-sm font-medium">${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">{getOrderLabel('customer.payment')}:</span>
            <span className="text-sm font-medium capitalize">{order.paymentMethod}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const OrderTabs = () => {
  const { orders } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const { t, language } = useLanguage();

  const getFilteredOrders = (status: OrderStatus | 'all') => {
    if (status === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === status);
  };

  const filteredOrders = getFilteredOrders(selectedStatus);

  const getStatusDisplayText = (status: OrderStatus | 'all'): string => {
    if (status === 'all') {
      return language === 'en' ? 'All Orders' : 'جميع الطلبات';
    }
    
    switch (status) {
      case 'Order Received':
        return language === 'en' ? 'Order Received' : 'تم استلام الطلب';
      case 'Store Received':
        return language === 'en' ? 'Store Received' : 'تم استلام المتجر';
      case 'Order Started':
        return language === 'en' ? 'Order Started' : 'بدأ الطلب';
      case 'Delivery Boy Selected':
        return language === 'en' ? 'Delivery Boy Selected' : 'تم اختيار عامل التوصيل';
      case 'Invoice Printed':
        return language === 'en' ? 'Invoice Printed' : 'تمت طباعة الفاتورة';
      case 'Order Delivered':
        return language === 'en' ? 'Order Delivered' : 'تم توصيل الطلب';
      default:
        return language === 'en' ? 'Unknown Status' : 'حالة غير معروفة';
    }
  };

  const getNoOrdersText = () => {
    return language === 'en' ? 'No orders found' : 'لا توجد طلبات';
  };

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedStatus(value as OrderStatus | 'all')}>
      <div className="mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <TabsList className="bg-secondary/80 dark:bg-gray-800/80 p-1 rounded-full w-max min-w-full">
          <TabsTrigger 
            value="all" 
            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            {getStatusDisplayText('all')}
          </TabsTrigger>
          {ALL_STATUSES.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
            >
              {ORDER_STATUS_ICONS[status]}
              <span className="hidden md:inline">
                {getStatusDisplayText(status)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="all" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500 dark:text-gray-400">
              {getNoOrdersText()}
            </div>
          )}
        </div>
      </TabsContent>

      {ALL_STATUSES.map((status) => (
        <TabsContent key={status} value={status} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredOrders(status).length > 0 ? (
              getFilteredOrders(status).map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500 dark:text-gray-400">
                {getNoOrdersText()}
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default OrderTabs;
