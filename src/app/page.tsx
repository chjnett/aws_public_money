'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import RestaurantCard from '@/components/RestaurantCard';
import { RESTAURANTS, MOCK_TRANSACTIONS, DEFAULT_USERS } from '@/lib/constants';
import { RefreshCw, User, ChevronRight, Search, X } from 'lucide-react';

interface RestaurantWithStats {
  id: number;
  name: string;
  memberCount: number;
  poolAmount: number;
  category: string;
  hours: string;
}

// 환경변수가 설정되어 있는지 확인
const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [showUserSelect, setShowUserSelect] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(!isSupabaseConfigured);

  // 검색 필터링된 사용자 목록
  const filteredUsers = DEFAULT_USERS.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Mock 데이터 사용 (Supabase 연결 전)
    if (useMockData) {
      const restaurantsWithStats: RestaurantWithStats[] = RESTAURANTS.map((restaurant) => {
        const restaurantTransactions = MOCK_TRANSACTIONS.filter(
          (t) => t.restaurant_id === restaurant.id
        );

        const uniqueUsers = new Set(
          restaurantTransactions
            .filter((t) => t.type === 'DEPOSIT')
            .map((t) => t.user_name)
        );

        const poolAmount = restaurantTransactions.reduce(
          (sum, t) => sum + t.contribution,
          0
        );

        return {
          id: restaurant.id,
          name: restaurant.name,
          memberCount: uniqueUsers.size,
          poolAmount,
          category: restaurant.category,
          hours: restaurant.hours,
        };
      });

      setRestaurants(restaurantsWithStats);
      setLoading(false);
      return;
    }

    // Supabase 연결 시
    try {
      const { supabase } = await import('@/lib/supabase');

      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .order('id');

      if (restaurantError) throw restaurantError;

      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*');

      if (transactionError) throw transactionError;

      const restaurantsWithStats: RestaurantWithStats[] = (restaurantData || []).map(
        (restaurant) => {
          const restaurantTransactions = (transactionData || []).filter(
            (t) => t.restaurant_id === restaurant.id
          );

          const uniqueUsers = new Set(
            restaurantTransactions
              .filter((t) => t.type === 'DEPOSIT')
              .map((t) => t.user_name)
          );

          const poolAmount = restaurantTransactions.reduce(
            (sum, t) => sum + t.contribution,
            0
          );

          const restaurantInfo = RESTAURANTS.find((r) => r.id === restaurant.id);

          return {
            id: restaurant.id,
            name: restaurant.name,
            memberCount: uniqueUsers.size,
            poolAmount,
            category: restaurantInfo?.category || '',
            hours: restaurantInfo?.hours || '',
          };
        }
      );

      setRestaurants(restaurantsWithStats);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  useEffect(() => {
    // localStorage에서 저장된 사용자 확인
    const savedUser = localStorage.getItem('bobpool_user');
    if (savedUser) {
      setSelectedUser(savedUser);
      setShowUserSelect(false);
      fetchData();
    }
  }, [fetchData]);

  const handleUserSelect = (userName: string) => {
    setSelectedUser(userName);
    localStorage.setItem('bobpool_user', userName);
    setShowUserSelect(false);
    fetchData();
  };

  const handleChangeUser = () => {
    setShowUserSelect(true);
    setSelectedUser('');
    localStorage.removeItem('bobpool_user');
  };

  const handleRefresh = () => {
    fetchData();
  };

  // 사용자 선택 화면
  if (showUserSelect) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="🍚 밥풀" />

        <main className="flex-1 p-4">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              안녕하세요!
            </h2>
            <p className="text-slate-500 text-sm">
              본인의 이름을 선택해주세요
            </p>
          </div>

          {/* 검색창 */}
          <div className="mb-4 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름 검색..."
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* 검색 결과 수 */}
          {searchQuery && (
            <p className="text-sm text-slate-500 mb-2">
              검색 결과: {filteredUsers.length}명
            </p>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-[55vh] overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((name) => {
                const originalIndex = DEFAULT_USERS.indexOf(name) + 1;
                return (
                  <button
                    key={name}
                    onClick={() => handleUserSelect(name)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500">
                        {originalIndex}
                      </span>
                      <span className="font-medium text-slate-700">{name}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-400" />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-400">검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // 식당 선택 화면
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="🍚 밥풀"
        rightElement={
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            disabled={loading}
          >
            <RefreshCw
              size={20}
              className={`text-slate-600 ${loading ? 'animate-spin' : ''}`}
            />
          </button>
        }
      />

      <main className="flex-1 p-4">
        {/* 사용자 정보 */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-100">안녕하세요</p>
                <p className="font-bold text-lg">{selectedUser}님</p>
              </div>
            </div>
            <button
              onClick={handleChangeUser}
              className="text-sm text-blue-100 hover:text-white underline"
            >
              변경
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800 mb-1">
            어디서 식사하시나요?
          </h2>
          <p className="text-slate-500 text-sm">
            식당을 선택하면 식대를 등록할 수 있어요
          </p>
          {useMockData && (
            <p className="text-xs text-amber-500 mt-1">
              * 테스트 데이터로 표시 중입니다
            </p>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                memberCount={restaurant.memberCount}
                poolAmount={restaurant.poolAmount}
                category={restaurant.category}
                hours={restaurant.hours}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-100">
        <p>팀 예산 공유 서비스 | 1인당 10,000원 기준</p>
      </footer>
    </div>
  );
}
