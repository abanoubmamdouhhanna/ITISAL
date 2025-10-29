
export type OrderStatus = 
  | 'Order Received' 
  | 'Store Received' 
  | 'Order Started' 
  | 'Delivery Boy Selected' 
  | 'Invoice Printed' 
  | 'Order Delivered';

export interface Address {
  id: string;
  street: string;
  city: string;
  zipCode: string;
  gisLocation?: {
    lat: number;
    lng: number;
  };
  storeId: string;
}

export interface Customer {
  id: string;
  phoneNumber: string;
  name: string;
  addresses: Address[];
  paymentMethods: {
    cash: boolean;
    visa: boolean;
    credit: boolean;
  };
}

export interface Store {
  id: string;
  name: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  parentId?: string;
  children?: ProductCategory[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  notes?: string;
  discount?: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  addressId: string;
  deliveryAddress: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  totalAmount: number;
  vatAmount?: number;
  deliveryFee?: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'visa' | 'credit';
  createdAt: string;
  updatedAt: string;
}

export interface OrdersFilter {
  status?: OrderStatus;
  date?: string;
  storeId?: string;
}
