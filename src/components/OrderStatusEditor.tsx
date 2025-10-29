
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { OrderStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from '@/context/StoreContext';
import OrderStatusBadge from './OrderStatusBadge';
import { useLanguage } from '@/context/LanguageContext';

interface OrderStatusEditorProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const ALL_STATUSES: OrderStatus[] = [
  'Order Received',
  'Store Received',
  'Order Started',
  'Delivery Boy Selected',
  'Invoice Printed',
  'Order Delivered'
];

const OrderStatusEditor: React.FC<OrderStatusEditorProps> = ({ orderId, currentStatus }) => {
  const { updateOrderStatus } = useStore();
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (value: OrderStatus) => {
    setStatus(value);
    setIsSubmitting(true);
    
    try {
      await updateOrderStatus(orderId, value);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusDisplayText = (status: OrderStatus): string => {
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

  if (isEditing) {
    return (
      <div className="w-full">
        <Select
          value={status}
          onValueChange={(value) => handleStatusChange(value as OrderStatus)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={language === 'en' ? 'Select status' : 'اختر الحالة'} />
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {getStatusDisplayText(statusOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <OrderStatusBadge status={currentStatus} />
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => setIsEditing(true)}
        title={language === 'en' ? 'Edit' : 'تعديل'}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default OrderStatusEditor;
