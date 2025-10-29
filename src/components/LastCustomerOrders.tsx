
import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import { toast } from 'sonner';

interface LastCustomerOrdersProps {
  customerId: string;
  onEditOrder: (orderId: string) => void;
}

const LastCustomerOrders: React.FC<LastCustomerOrdersProps> = ({ 
  customerId, 
  onEditOrder 
}) => {
  const { orders } = useStore();
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Filter orders for this customer
    const filteredOrders = orders
      .filter(order => order.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setCustomerOrders(filteredOrders);
  }, [customerId, orders]);

  const handleEditOrder = (order: Order) => {
    // Check if order is in a status that allows editing
    const editableStatuses = ['Order Received', 'Store Received'];
    if (!editableStatuses.includes(order.status)) {
      toast.error(`Cannot edit order with status: ${order.status}`);
      return;
    }
    
    onEditOrder(order.id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Customer's Order History</h2>
      
      {customerOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No previous orders found for this customer
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {customerOrders.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Order #{order.id.substring(order.id.length - 4)}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              
              <div className="mt-3 border-t pt-2">
                <div className="text-sm">
                  <div className="flex justify-between my-1">
                    <span className="text-gray-500">Items:</span>
                    <span>{order.items.length}</span>
                  </div>
                  <div className="flex justify-between my-1">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between my-1">
                    <span className="text-gray-500">Payment:</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-2">
                <Button 
                  onClick={() => handleEditOrder(order)} 
                  variant="secondary" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!['Order Received', 'Store Received'].includes(order.status)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Order
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LastCustomerOrders;
