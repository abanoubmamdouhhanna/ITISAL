
import { supabase } from "@/integrations/supabase/client";
import { Store } from "@/lib/types";

export const fetchStores = async (): Promise<Store[]> => {
  const { data, error } = await supabase
    .from('stores')
    .select('*');
  
  if (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
  
  return data as Store[];
};

export const findStoreById = async (id: string): Promise<Store | null> => {
  // First try to find in stores table
  const { data: storeData, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (storeData) {
    return storeData as Store;
  }
  
  // If not found in stores, try store_setup table
  const { data: setupData, error: setupError } = await supabase
    .from('store_setup')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (setupError && setupError.code !== 'PGRST116') {
    console.error('Error finding store by id:', setupError);
    throw setupError;
  }
  
  if (setupData) {
    // Convert store_setup format to Store format
    return {
      id: setupData.id,
      name: setupData.store_eng_name,
      address: setupData.store_ar_name, // Using Arabic name as address placeholder
      created_at: setupData.created_at
    } as Store;
  }
  
  return null;
};
