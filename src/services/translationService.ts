import { supabase } from "@/integrations/supabase/client";

export interface Translation {
  id: string;
  key_name: string;
  language_code: string;
  translated_text: string;
  group_category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  native_name: string;
  isRTL: boolean;
  isActive: boolean;
}

/**
 * Fetch all available languages from translations
 */
export const fetchAvailableLanguages = async (): Promise<LanguageConfig[]> => {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching available languages:', error);
    return [
      { code: 'en', name: 'English', native_name: 'English', isRTL: false, isActive: true },
      { code: 'ar', name: 'Arabic', native_name: 'العربية', isRTL: true, isActive: true }
    ];
  }
  
  return data.map(lang => ({
    code: lang.code,
    name: lang.name,
    native_name: lang.native_name,
    isRTL: lang.is_rtl,
    isActive: lang.is_active
  }));
};

/**
 * Fetch all translations for a specific language
 */
export const fetchTranslationsByLanguage = async (languageCode: string): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('language_setup')
    .select('key_name, translated_text')
    .eq('language_code', languageCode);
  
  if (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
  
  // Convert array to key-value object
  const translations: Record<string, string> = {};
  data.forEach(item => {
    translations[item.key_name] = item.translated_text;
  });
  
  return translations;
};

/**
 * Fetch all translations (for admin management)
 */
export const fetchAllTranslations = async (): Promise<Translation[]> => {
  const { data, error } = await supabase
    .from('language_setup')
    .select('*')
    .order('key_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching all translations:', error);
    throw error;
  }
  
  return data;
};

/**
 * Add a new translation
 */
export const addTranslation = async (translation: Omit<Translation, 'id' | 'created_at' | 'updated_at'>): Promise<Translation> => {
  const { data, error } = await supabase
    .from('language_setup')
    .insert(translation)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding translation:', error);
    throw error;
  }
  
  return data;
};

/**
 * Update an existing translation
 */
export const updateTranslation = async (id: string, updates: Partial<Translation>): Promise<Translation> => {
  const { data, error} = await supabase
    .from('language_setup')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating translation:', error);
    throw error;
  }
  
  return data;
};

/**
 * Delete a translation
 */
export const deleteTranslation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('language_setup')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting translation:', error);
    throw error;
  }
};

/**
 * Bulk import translations from JSON
 */
export const bulkImportTranslations = async (translations: Omit<Translation, 'id' | 'created_at' | 'updated_at'>[]): Promise<void> => {
  const { error } = await supabase
    .from('language_setup')
    .insert(translations);
  
  if (error) {
    console.error('Error bulk importing translations:', error);
    throw error;
  }
};

/**
 * Get translations grouped by key prefix (e.g., "auth.", "dashboard.")
 */
export const fetchTranslationsByCategory = async (languageCode: string): Promise<Record<string, Record<string, string>>> => {
  const { data, error } = await supabase
    .from('language_setup')
    .select('key_name, translated_text')
    .eq('language_code', languageCode);
  
  if (error) {
    console.error('Error fetching translations by category:', error);
    throw error;
  }
  
  // Group by key prefix (category)
  const grouped: Record<string, Record<string, string>> = {};
  data.forEach(item => {
    const parts = item.key_name.split('.');
    const category = parts.length > 1 ? parts[0] : 'general';
    if (!grouped[category]) {
      grouped[category] = {};
    }
    grouped[category][item.key_name] = item.translated_text;
  });
  
  return grouped;
};
