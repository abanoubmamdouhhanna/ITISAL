
// Re-export the service functions for backward compatibility
import { findStoreById } from '@/services/storeService';
import { findCustomerByPhone } from '@/services/customerService';
import { getProductsByCategory } from '@/services/productService';
import { getOrdersByStatus } from '@/services/orderService';

// Export these functions to maintain compatibility with existing code
export { 
  findStoreById,
  findCustomerByPhone,
  getProductsByCategory,
  getOrdersByStatus
};

// The data below is kept for reference but will no longer be used
// Data will now be fetched from Supabase

export const stores = [];
export const customers = [];
export const productCategories = [];
export const products = [];
export const orders = [];
