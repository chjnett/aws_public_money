import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 빌드 시 또는 환경변수가 없을 때 더미 클라이언트 반환
let supabase: SupabaseClient<Database>;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  // 환경 변수가 없을 때 처리 로직
  if (typeof window === 'undefined') {
    // 1. 서버 사이드(빌드 타임 포함)에서는 에러를 던지지 않고 더미 클라이언트를 반환하여
    //    Next.js의 정적 생성(Static Generation)이 실패하지 않도록 함.
    console.warn('⚠️ Supabase env vars missing during server rendering/build. Using placeholder client.');
    supabase = createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  } else {
    // 2. 클라이언트 사이드(브라우저)에서는 실제 기능이 동작해야 하므로
    //    환경 변수가 없으면 명확한 에러를 발생시켜 개발자/사용자에게 알림.
    console.error('⚠️ Supabase environment variables are missing! Check Vercel settings.');
    throw new Error('Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings.');
  }
}

export { supabase };
