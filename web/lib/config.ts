export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** بدون بيانات Supabase يعمل التطبيق في الوضع التجريبي ببيانات محلية. */
export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
