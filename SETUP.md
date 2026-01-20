# 밥풀 (Bob-Pool) 설정 가이드

## 1. Supabase 프로젝트 설정

### 1.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 접속하여 로그인
2. "New Project" 클릭
3. 프로젝트 이름 입력 (예: bob-pool)
4. 데이터베이스 비밀번호 설정
5. 리전 선택 (Northeast Asia - ap-northeast-1 권장)

### 1.2 데이터베이스 테이블 생성
1. Supabase 대시보드에서 **SQL Editor** 클릭
2. `supabase-setup.sql` 파일 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭

### 1.3 API 키 확인
1. **Settings** > **API** 메뉴 이동
2. `Project URL`과 `anon public` 키 복사

## 2. 프로젝트 환경 설정

### 2.1 환경변수 설정
`.env.local` 파일을 수정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2.2 로컬 실행
```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 3. Vercel 배포

### 3.1 GitHub 연동
1. 프로젝트를 GitHub에 푸시
2. [Vercel](https://vercel.com)에 로그인
3. "Import Project" > GitHub 저장소 선택

### 3.2 환경변수 설정
Vercel 프로젝트 Settings > Environment Variables에서:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key

### 3.3 배포
"Deploy" 버튼 클릭

## 4. 자동 초기화 설정 (선택)

### 방법 1: Supabase pg_cron (유료 플랜)
1. Database > Extensions에서 `pg_cron` 활성화
2. SQL Editor에서 `supabase-cron.sql` 실행

### 방법 2: 수동 초기화
- 관리자가 직접 트랜잭션 테이블 초기화
- SQL: `DELETE FROM transactions;`

### 방법 3: Vercel Cron Jobs
`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/reset",
      "schedule": "30 4 * * *"
    },
    {
      "path": "/api/reset",
      "schedule": "0 11 * * *"
    }
  ]
}
```

## 5. 사용자 목록 커스터마이징

`src/lib/constants.ts` 파일에서 `DEFAULT_USERS` 배열 수정:

```typescript
export const DEFAULT_USERS = [
  '홍길동',
  '김철수',
  // ... 40명의 실제 팀원 이름
];
```

## 6. Realtime 활성화

Supabase 대시보드에서:
1. Database > Replication 이동
2. `transactions` 테이블 Realtime 활성화

또는 SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
```

## 문제 해결

### 데이터가 안 보여요
- Supabase URL과 키가 올바른지 확인
- RLS 정책이 설정되어 있는지 확인
- 브라우저 콘솔에서 에러 확인

### 실시간 업데이트가 안 돼요
- Realtime이 활성화되어 있는지 확인
- 브라우저 새로고침 시도

### 빌드 에러
- `npm install` 재실행
- `.next` 폴더 삭제 후 재빌드
