-- =====================================================
-- 밥풀 (Bob-Pool) 자동 초기화 스케줄 설정
-- Supabase Extensions에서 pg_cron 활성화 후 실행하세요
-- =====================================================

-- pg_cron 익스텐션 활성화 (Supabase 대시보드에서 먼저 활성화 필요)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 기존 스케줄 삭제 (재설정 시)
SELECT cron.unschedule('reset-lunch');
SELECT cron.unschedule('reset-dinner');

-- 점심 초기화 (매일 13:30 KST = 04:30 UTC)
SELECT cron.schedule(
  'reset-lunch',
  '30 4 * * *',
  $$ DELETE FROM transactions $$
);

-- 저녁 초기화 (매일 20:00 KST = 11:00 UTC)
SELECT cron.schedule(
  'reset-dinner',
  '0 11 * * *',
  $$ DELETE FROM transactions $$
);

-- 스케줄 확인
SELECT * FROM cron.job;
