import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 빌드 시 또는 환경변수가 없을 때 더미 클라이언트 반환
let supabase: SupabaseClient<Database>;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  // 빌드 시 더미 클라이언트 (실제로 사용되지 않음)
  supabase = createClient<Database>(
    'https://placeholder.supabase.co',
    'placeholder-key'
  );
}

export { supabase };
