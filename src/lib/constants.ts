// 실제 식당 정보 (스크린샷 기반)
export interface RestaurantInfo {
  id: number;
  name: string;
  fullName: string;
  phone: string;
  mapUrl: string;
  category: string;
  hours: string;
  note?: string;
  menus: { name: string; price: number }[];
}

export const RESTAURANTS: RestaurantInfo[] = [
  {
    id: 1,
    name: '돈까스가 있는 풍경',
    fullName: '돈까스가 있는 풍경',
    phone: '064-713-0524',
    mapUrl: 'https://naver.me/GtUyN2Sj',
    category: '돈까스, 스파게티',
    hours: '11:00 ~ 20:00',
    menus: [
      { name: '수제돈까스', price: 8000 },
      { name: '매운돈까스', price: 8000 },
      { name: '돈스파게티', price: 9000 },
      { name: '치즈돈까스', price: 9000 },
      { name: '라면떡볶이', price: 6000 },
      { name: '치즈떡볶이', price: 7000 },
      { name: '냄비우동', price: 6000 },
      { name: '육개장', price: 8000 },
      { name: '쫄면떡볶이', price: 6000 },
      { name: '오므라이스', price: 7000 },
      { name: '김치찌개', price: 8000 },
      { name: '치즈스파게티', price: 7000 },
      { name: '라면', price: 4000 },
      { name: '새우튀김 2개', price: 2000 },
    ],
  },
  {
    id: 2,
    name: '석봉이네 밥집',
    fullName: '석봉이네 밥집',
    phone: '064-747-3040',
    mapUrl: 'https://naver.me/xTTVBEVs',
    category: '찌개, 한정식',
    hours: '09:00 ~ 21:00',
    menus: [
      { name: '김치찌개', price: 8000 },
      { name: '된장찌개', price: 8000 },
      { name: '순두부', price: 8000 },
      { name: '청국장', price: 9000 },
      { name: '제육덮밥', price: 10000 },
      { name: '불고기덮밥', price: 10000 },
      { name: '갈비찜백반', price: 11000 },
      { name: '돼지갈비탕', price: 11000 },
      { name: '김치전골 (2~3인)', price: 25000 },
      { name: '석봉갈비찜 (2~3인)', price: 30000 },
      { name: '낙지소면 (2~3인)', price: 26000 },
      { name: '김치짜글이 (2~3인)', price: 20000 },
      { name: '소주', price: 5000 },
      { name: '맥주', price: 5000 },
      { name: '콜라', price: 2000 },
      { name: '사이다', price: 2000 },
    ],
  },
  {
    id: 3,
    name: '모닥치기 한라대점',
    fullName: '모닥치기 한라대점',
    phone: '0507-1396-2632',
    mapUrl: 'https://naver.me/FxCXLkeQ',
    category: '분식, 김밥, 면류',
    hours: '11:00 ~ 21:00',
    note: '금 휴무',
    menus: [
      { name: '튀김모닥치기', price: 18000 },
      { name: '모닥치기', price: 15000 },
      { name: '떡볶이', price: 4500 },
      { name: '치즈떡볶이', price: 6000 },
      { name: '라볶이', price: 5500 },
      { name: '치즈라볶이', price: 7000 },
      { name: '로제떡볶이', price: 6500 },
      { name: '로제라볶이', price: 7500 },
      { name: '수제 모둠튀김', price: 6500 },
      { name: '순대', price: 4500 },
      { name: '오징어튀김 1줄', price: 2000 },
      { name: '김말이 3줄', price: 3000 },
      { name: '새우튀김 (4마리)', price: 3000 },
      { name: '수제돈가스', price: 9000 },
      { name: '쫄면', price: 8000 },
      { name: '라면', price: 4000 },
      { name: '원조김밥', price: 3500 },
      { name: '치즈김밥', price: 4500 },
      { name: '참치김밥', price: 5000 },
      { name: '치즈 추가', price: 3000 },
      { name: '로제맛 변경', price: 3000 },
    ],
  },
  {
    id: 4,
    name: '귀빈반점',
    fullName: '귀빈반점',
    phone: '064-749-3080',
    mapUrl: 'https://naver.me/xVBqQJwy',
    category: '중국집',
    hours: '10:00 ~ 19:00',
    menus: [
      { name: '짜장면', price: 5000 },
      { name: '짬뽕', price: 6000 },
      { name: '고기짬뽕', price: 8000 },
      { name: '볶음밥', price: 8000 },
      { name: '잡채밥', price: 8000 },
      { name: '탕수육 (소)', price: 15000 },
      { name: '탕수육 (중)', price: 20000 },
      { name: '탕수육 (대)', price: 25000 },
    ],
  },
];

// 식당별 테마 색상
export const RESTAURANT_THEMES: Record<string, {
  bg: string;
  border: string;
  text: string;
  icon: string;
  gradient: string;
}> = {
  '돈까스가 있는 풍경': {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-600',
    icon: '🍛',
    gradient: 'from-amber-400 to-amber-600',
  },
  '석봉이네 밥집': {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-600',
    icon: '🍚',
    gradient: 'from-orange-400 to-orange-600',
  },
  '모닥치기 한라대점': {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-600',
    icon: '🍜',
    gradient: 'from-green-400 to-green-600',
  },
  '귀빈반점': {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-600',
    icon: '🥡',
    gradient: 'from-red-400 to-red-600',
  },
  // 기본값 (이전 호환)
  '한식': {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-600',
    icon: '🍚',
    gradient: 'from-orange-400 to-orange-600',
  },
  '중식': {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-600',
    icon: '🥡',
    gradient: 'from-red-400 to-red-600',
  },
  '일식': {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-600',
    icon: '🍣',
    gradient: 'from-blue-400 to-blue-600',
  },
  '분식': {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-600',
    icon: '🍜',
    gradient: 'from-green-400 to-green-600',
  },
};

// 1인당 식대 기준
export const BASE_ALLOWANCE = 10000;

// 50명 사용자 목록 (실제 데이터)
export const DEFAULT_USERS = [
  '배소혜', '하민세', '이예진', '김재우', '허승준',
  'Seunghyun Ryu', '황아름', '김도현', '이상호', '최지은',
  '민승규', '강서영', '홍지윤', '이재후', '유채윤',
  '이지원', '송채림', '양성수', '양수찬', '이현민',
  '박서연', 'Suhyun Kim', '이서정', '방지희', '천현준',
  '양은영', '김웅빈', '오승현', '유승준', '고가민',
  '김준서', '김현우', '김호준', '유승진', '윤상혁',
  '김예지', '전예빈', '이진성', '김민지', '현지훈',
  'Munir Jawaria', 'YUPAR AUNG', 'FATIMA YOUMAN', 'Azizbek Alijonov',
  'Ho Thi Kim Hang', 'Tanzzila', 'Alland Dharmawan',
  'Baroreraho Don Allègre', 'ERLYNA JUANY', 'Chevrel Naomi Bamboo Lanqiu Maria',
];

// 임시 데이터 (Supabase 연결 전 테스트용)
export const MOCK_TRANSACTIONS = [];
