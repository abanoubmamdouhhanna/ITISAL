
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Package, Clock, Truck, FileText } from 'lucide-react';
import { OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const { language, isRTL } = useLanguage();
  
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'Order Received':
        return {
          icon: <Check className="h-3 w-3" />,
          color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-800/40',
          displayText: language === 'en' ? 'Order Received' : 'تم استلام الطلب'
        };
      case 'Store Received':
        return {
          icon: <Package className="h-3 w-3" />,
          color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-800/40',
          displayText: language === 'en' ? 'Store Received' : 'تم استلام المتجر'
        };
      case 'Order Started':
        return {
          icon: <Clock className="h-3 w-3" />,
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-800/40',
          displayText: language === 'en' ? 'Order Started' : 'بدأ الطلب'
        };
      case 'Delivery Boy Selected':
        return {
          icon: <Truck className="h-3 w-3" />,
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-800/40',
          displayText: language === 'en' ? 'Delivery Boy Selected' : 'تم اختيار عامل التوصيل'
        };
      case 'Invoice Printed':
        return {
          icon: <FileText className="h-3 w-3" />,
          color: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800 dark:hover:bg-pink-800/40',
          displayText: language === 'en' ? 'Invoice Printed' : 'تمت طباعة الفاتورة'
        };
      case 'Order Delivered':
        return {
          icon: <Check className="h-3 w-3" />,
          color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-800/40',
          displayText: language === 'en' ? 'Order Delivered' : 'تم توصيل الطلب'
        };
      default:
        // For any unknown status, use a safe fallback
        return {
          icon: <Check className="h-3 w-3" />,
          color: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700',
          displayText: language === 'en' ? 'Unknown Status' : 'حالة غير معروفة'
        };
    }
  };

  const { icon, color, displayText } = getStatusConfig(status);

  // When RTL, flip the icon position
  const iconClass = isRTL ? "ml-1 mr-0 badge-icon" : "mr-1 ml-0 badge-icon";

  return (
    <Badge variant="outline" className={cn("flex items-center gap-0.5 px-2.5 py-0.5 rounded-full font-medium", color, className)}>
      {!isRTL && icon && React.cloneElement(icon, { className: iconClass })}
      <span>{displayText}</span>
      {isRTL && icon && React.cloneElement(icon, { className: iconClass })}
    </Badge>
  );
};

export default OrderStatusBadge;
