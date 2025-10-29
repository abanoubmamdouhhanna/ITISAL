
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductCategory } from "@/lib/types";

export const fetchProductCategories = async (): Promise<ProductCategory[]> => {
  const { data, error } = await supabase
    .from('item_groups')
    .select('*')
    .is('parent_group_id', null); // Only fetch root level groups
  
  if (error) {
    console.error('Error fetching item groups:', error);
    throw error;
  }
  
  return data.map(group => ({
    id: group.id,
    name: group.group_eng_name,
    icon: 'utensils' // Default icon, can be customized later
  }));
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*');
  
  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.item_eng_name,
    description: item.item_ar_name || '',
    price: Number(item.price),
    categoryId: item.group_id,
    image: undefined
  }));
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('group_id', categoryId);
  
  if (error) {
    console.error('Error fetching items by group:', error);
    throw error;
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.item_eng_name,
    description: item.item_ar_name || '',
    price: Number(item.price),
    categoryId: item.group_id,
    image: undefined
  }));
};
