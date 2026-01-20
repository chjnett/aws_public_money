-- =====================================================
-- 밥풀 (Bob-Pool) 데이터베이스 설정 스크립트
-- Supabase SQL 에디터에서 실행하세요
-- =====================================================

-- 1. 식당 테이블 생성
CREATE TABLE IF NOT EXISTS restaurants (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 식당 초기 데이터 삽입
INSERT INTO restaurants (name) VALUES
  ('한식'),
  ('중식'),
  ('일식'),
  ('분식')
ON CONFLICT DO NOTHING;

-- 3. 사용자 테이블 생성 (참고용, 실제로는 프론트에서 상수로 관리)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);

-- 4. 사용자 초기 데이터 (40명)
INSERT INTO users (name) VALUES
  ('김민수'), ('이영희'), ('박철수'), ('정수진'), ('최동욱'),
  ('한지민'), ('윤서준'), ('장미영'), ('송태희'), ('조현우'),
  ('신예린'), ('임재현'), ('오수빈'), ('강도윤'), ('배지훈'),
  ('류하은'), ('문성민'), ('권나연'), ('서진호'), ('안소희'),
  ('홍길동'), ('전우치'), ('이순신'), ('강감찬'), ('을지문덕'),
  ('김유신'), ('계백'), ('연개소문'), ('광개토'), ('세종대왕'),
  ('정약용'), ('이황'), ('이이'), ('신사임당'), ('허난설헌'),
  ('김정호'), ('장보고'), ('최무선'), ('박혁거세'), ('김춘추')
ON CONFLICT (name) DO NOTHING;

-- 5. 트랜잭션(장부) 테이블 생성
CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  restaurant_id BIGINT REFERENCES restaurants(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  amount INT NOT NULL,
  contribution INT NOT NULL,
  type TEXT CHECK (type IN ('DEPOSIT', 'WITHDRAW')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_transactions_restaurant_id ON transactions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- 7. 실시간 공금 합계 뷰 생성
CREATE OR REPLACE VIEW pool_stats AS
SELECT
  restaurant_id,
  COALESCE(SUM(contribution), 0) AS current_pool
FROM transactions
GROUP BY restaurant_id;

-- =====================================================
-- RLS (Row Level Security) 설정
-- 공개 앱이므로 모든 접근 허용
-- =====================================================

-- RLS 비활성화 (모든 사용자 접근 허용)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 읽기/쓰기 권한 부여
CREATE POLICY "Allow all access to restaurants" ON restaurants FOR ALL USING (true);
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all access to transactions" ON transactions FOR ALL USING (true);

-- =====================================================
-- Realtime 구독 활성화
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;

-- =====================================================
-- 완료 메시지
-- =====================================================
SELECT '밥풀 데이터베이스 설정이 완료되었습니다!' AS message;
