import { createClient } from '@supabase/supabase-js';

// Supabase connection (use env vars when possible)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rnkexgmcteqeeztkjanc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJua2V4Z21jdGVxZWV6dGtqYW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDA5NTMsImV4cCI6MjA3NzExNjk1M30.gnx7lPwvj09Fih6rQfKriwi8MF-tz1ULWNCnyksvOXU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Management translation keys and their fallback values
const managementTranslations = {
  'management.title': { en: 'Management Dashboard', ar: 'لوحة الإدارة' },
  'management.realtimeAnalytics': { en: 'Real-time analytics', ar: 'التحليلات في الوقت الحقيقي' },
  'management.refresh': { en: 'Refresh', ar: 'تحديث' },
  'management.last24Hours': { en: 'Last 24 hours', ar: 'آخر 24 ساعة' },
  'management.last7Days': { en: 'Last 7 days', ar: 'آخر 7 أيام' },
  'management.last30Days': { en: 'Last 30 days', ar: 'آخر 30 يوماً' },
  'management.last90Days': { en: 'Last 90 days', ar: 'آخر 90 يوماً' },
  'management.filterStore': { en: 'Filter by store', ar: 'تصفية حسب المتجر' },
  'management.allStores': { en: 'All stores', ar: 'جميع المتاجر' },
  'management.totalOrders': { en: 'Total Orders', ar: 'إجمالي الطلبات' },
  'management.openOrders': { en: 'Open Orders', ar: 'الطلبات المفتوحة' },
  'management.deliveredOrders': { en: 'Delivered Orders', ar: 'الطلبات التي تم توصيلها' },
  'management.totalRevenue': { en: 'Total Revenue', ar: 'إجمالي الإيرادات' },
  'management.byStore': { en: 'Orders by store', ar: 'الطلبات حسب المتجر' },
  'management.avg': { en: 'Avg', ar: 'المتوسط' },
  'management.ofTotal': { en: 'of total', ar: 'من الإجمالي' },
  'management.completion': { en: 'Completion', ar: 'نسبة الإكمال' },
  'management.orderTrend': { en: 'Order Trend', ar: 'اتجاه الطلبات' },
  'management.dailyOrdersRevenue': { en: 'Daily orders & revenue', ar: 'الطلبات والإيرادات اليومية' },
  'management.orders': { en: 'Orders', ar: 'الطلبات' },
  'management.revenue': { en: 'Revenue', ar: 'الإيرادات' },
  'management.orderStatusDistribution': { en: 'Order Status Distribution', ar: 'توزيع حالات الطلب' },
  'management.breakdownByStatus': { en: 'Breakdown by status', ar: 'التفصيل حسب الحالة' },
  'management.orderManagement': { en: 'Order Management', ar: 'إدارة الطلبات' },
  'management.viewManageOrders': { en: 'View and manage orders', ar: 'عرض وإدارة الطلبات' },
  // Order status keys
  'status.orderReceived': { en: 'Order Received', ar: 'تم استلام الطلب' },
  'status.storeReceived': { en: 'Store Received', ar: 'تم استلام المتجر' }
};

async function main() {
  try {
    console.log('Fetching active languages from database...');
    const { data: languages, error: langError } = await supabase
      .from('languages')
      .select('code')
      .eq('is_active', true);

    if (langError) {
      console.error('Error fetching languages:', langError);
      process.exit(1);
    }

    const languageCodes = (languages && languages.length > 0)
      ? languages.map(l => l.code)
      : ['en', 'ar'];

    console.log('Active languages:', languageCodes.join(', '));

    // Build upsert payload
    const rows = [];
    for (const [key, translations] of Object.entries(managementTranslations)) {
      for (const lang of languageCodes) {
        const text = translations[lang] || translations['en'] || key;
        rows.push({
          key_name: key,
          language_code: lang,
          translated_text: text,
          group_category: 'management'
        });
      }
    }

    if (rows.length === 0) {
      console.log('No translations to import.');
      return;
    }

    console.log(`Upserting ${rows.length} translations...`);

    const { data, error } = await supabase
      .from('language_setup')
      .upsert(rows, { onConflict: ['key_name', 'language_code'] });

    if (error) {
      console.error('Error upserting translations:', error);
      process.exit(1);
    }

    console.log('Translations upserted successfully.');
    if (data) console.log(data.slice(0, 10));
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

main();
