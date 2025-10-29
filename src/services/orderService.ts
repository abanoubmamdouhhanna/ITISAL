
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, OrderStatus } from "@/lib/types";

export const fetchOrders = async (): Promise<Order[]> => {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw ordersError;
  }

  const orders = await Promise.all(
    ordersData.map(async (order) => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        throw itemsError;
      }

      const items = itemsData.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: Number(item.price),
        notes: item.notes
      }));

      return {
        id: order.id,
        customerId: order.customer_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        addressId: order.address_id,
        deliveryAddress: order.delivery_address,
        storeId: order.store_id,
        storeName: order.store_name,
        items: items,
        totalAmount: Number(order.total_amount),
        vatAmount: order.vat_amount ? Number(order.vat_amount) : undefined,
        deliveryFee: order.delivery_fee ? Number(order.delivery_fee) : undefined,
        status: order.status as OrderStatus,
        paymentMethod: order.payment_method as 'cash' | 'visa' | 'credit',
        createdAt: order.created_at,
        updatedAt: order.updated_at
      };
    })
  );

  return orders;
};

export const addOrder = async (order: Order): Promise<Order> => {
  // Check if the order already exists
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('id', order.id)
    .single();
  
  if (existingOrder) {
    // Update existing order
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        customer_id: order.customerId,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        address_id: order.addressId,
        delivery_address: order.deliveryAddress,
        store_id: order.storeId,
        store_name: order.storeName,
        total_amount: order.totalAmount,
        vat_amount: order.vatAmount,
        delivery_fee: order.deliveryFee,
        status: order.status,
        payment_method: order.paymentMethod,
        updated_at: order.updatedAt
      })
      .eq('id', order.id);
    
    if (orderError) {
      console.error('Error updating order:', orderError);
      throw orderError;
    }

    // Delete existing order items
    const { error: deleteItemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', order.id);
    
    if (deleteItemsError) {
      console.error('Error deleting order items:', deleteItemsError);
      throw deleteItemsError;
    }
  } else {
    // Insert new order
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        id: order.id,
        customer_id: order.customerId,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        address_id: order.addressId,
        delivery_address: order.deliveryAddress,
        store_id: order.storeId,
        store_name: order.storeName,
        total_amount: order.totalAmount,
        vat_amount: order.vatAmount,
        delivery_fee: order.deliveryFee,
        status: order.status,
        payment_method: order.paymentMethod,
        created_at: order.createdAt,
        updated_at: order.updatedAt
      }]);
    
    if (orderError) {
      console.error('Error adding order:', orderError);
      throw orderError;
    }
  }

  // Insert order items (for both new and updated orders)
  const orderItems = order.items.map(item => ({
    id: item.id,
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    price: item.price,
    notes: item.notes
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    console.error('Error adding order items:', itemsError);
    throw itemsError;
  }

  return order;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);
  
  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (ordersError) {
    console.error('Error fetching orders by status:', ordersError);
    throw ordersError;
  }

  const orders = await Promise.all(
    ordersData.map(async (order) => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        throw itemsError;
      }

      const items = itemsData.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: Number(item.price),
        notes: item.notes
      }));

      return {
        id: order.id,
        customerId: order.customer_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        addressId: order.address_id,
        deliveryAddress: order.delivery_address,
        storeId: order.store_id,
        storeName: order.store_name,
        items: items,
        totalAmount: Number(order.total_amount),
        vatAmount: order.vat_amount ? Number(order.vat_amount) : undefined,
        deliveryFee: order.delivery_fee ? Number(order.delivery_fee) : undefined,
        status: order.status as OrderStatus,
        paymentMethod: order.payment_method as 'cash' | 'visa' | 'credit',
        createdAt: order.created_at,
        updatedAt: order.updated_at
      };
    })
  );

  return orders;
};
