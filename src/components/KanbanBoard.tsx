
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { OrderStatus, Order } from '@/lib/types';
import { Card } from '@/components/ui/card';
import OrderStatusBadge from './OrderStatusBadge';
import OrderStatusEditor from './OrderStatusEditor';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useStore } from '@/context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const ALL_STATUSES: OrderStatus[] = [
  'Order Received',
  'Store Received',
  'Order Started',
  'Delivery Boy Selected',
  'Invoice Printed',
  'Order Delivered'
];

const KanbanBoard = () => {
  const { orders, updateOrderStatus, customers, stores } = useStore();
  const [boardData, setBoardData] = useState<{ [key in OrderStatus]: Order[] }>({} as any);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  useEffect(() => {
    // Initialize board data from orders
    const newBoardData: { [key in OrderStatus]: Order[] } = {} as any;
    
    ALL_STATUSES.forEach(status => {
      newBoardData[status] = orders.filter(order => order.status === status);
    });
    
    setBoardData(newBoardData);
  }, [orders]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const sourceStatus = source.droppableId as OrderStatus;
    const destinationStatus = destination.droppableId as OrderStatus;

    // Create a copy of the current board data
    const newBoardData = { ...boardData };
    
    // Find the moved order
    const movedOrder = { ...newBoardData[sourceStatus][source.index] };
    
    // Update the order status in the global store
    updateOrderStatus(movedOrder.id, destinationStatus);
    
    // Update the order status locally
    movedOrder.status = destinationStatus;
    
    // Remove from source column
    newBoardData[sourceStatus] = newBoardData[sourceStatus].filter(
      (_, index) => index !== source.index
    );
    
    // Add to destination column
    newBoardData[destinationStatus] = [
      ...newBoardData[destinationStatus].slice(0, destination.index),
      movedOrder,
      ...newBoardData[destinationStatus].slice(destination.index)
    ];
    
    setBoardData(newBoardData);
    
    // Show notification
    toast.success(`Order #${movedOrder.id.substring(movedOrder.id.length - 4)} moved to ${destinationStatus}`);
  };

  const handleEditOrder = (order: Order) => {
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

  return (
    <div className="w-full overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 sm:gap-4 min-w-max pb-2">
          {ALL_STATUSES.map((status, columnIndex) => (
            <div 
              key={status} 
              className="w-72 sm:w-80 shrink-0 flex flex-col"
            >
              <div className="flex items-center justify-between mb-2 bg-secondary/80 dark:bg-gray-800 p-2 rounded-lg text-xs sm:text-sm">
                <h3 className="font-medium text-xs sm:text-sm flex items-center gap-1.5">
                  <OrderStatusBadge status={status} />
                </h3>
                <span className="text-xs font-semibold bg-secondary dark:bg-gray-700 text-muted-foreground dark:text-gray-300 rounded-full px-1.5 sm:px-2 py-0.5">
                  {boardData[status]?.length || 0}
                </span>
              </div>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`h-full min-h-[200px] rounded-lg flex flex-col gap-2 p-2 transition-colors ${
                      snapshot.isDraggingOver 
                        ? "bg-secondary/50 dark:bg-gray-700/50" 
                        : "bg-secondary/20 dark:bg-gray-800/40"
                    }`}
                  >
                    {boardData[status] && boardData[status].length > 0 ? (
                      boardData[status].map((order, index) => (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? "0.8" : "1",
                              }}
                            >
                              <Card className={`p-3 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 ${
                                snapshot.isDragging ? "shadow-lg" : "shadow-sm hover:shadow-md"
                              }`}>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <h4 
                                      className="font-medium text-sm cursor-pointer hover:text-primary hover:underline"
                                      onClick={() => handleEditOrder(order)}
                                    >
                                      {t('customer.orderNum')} #{order.id.substring(order.id.length - 4)}
                                    </h4>
                                    <div className="hidden">
                                      <OrderStatusEditor orderId={order.id} currentStatus={order.status} />
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(order.createdAt).toLocaleString()}
                                  </div>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-300">{t('customer.name')}:</span>
                                      <span className="font-medium">{order.customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-300">{t('customer.total')}:</span>
                                      <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-300">{t('customer.payment')}:</span>
                                      <span className="font-medium capitalize">{order.paymentMethod}</span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-20 text-gray-400 dark:text-gray-500 text-sm">
                        {t('index.noOrders')}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
