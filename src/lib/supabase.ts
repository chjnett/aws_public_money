import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 빌드 시 또는 환경변수가 없을 때 더미 클라이언트 반환
let supabase: SupabaseClient<Database>;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  // 환경 변수 누락 시 명시적 에러 발생 (console에 로그 남김)
  // 클라이언트 생성 자체가 실패하면 앱이 멈출 수 있으므로, 제한적 기능을 가진 더미 객체를 만들거나
  // 여기서는 단순히 경고를 띄우고 null 처리를 할 수 없으므로, 에러를 던져서 상위에서 잡게 유도
  console.error('⚠️ Supabase environment variables are missing! Check Vercel settings.');
  throw new Error('Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings.');
}

export { supabase };
