'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import RestaurantCard from '@/components/RestaurantCard';
import { RESTAURANTS, MOCK_TRANSACTIONS, DEFAULT_USERS } from '@/lib/constants';
import { RefreshCw, User, Search, X, Home as HomeIcon } from 'lucide-react';
import { Transaction, Restaurant } from '@/types/database';

import SplashScreen from '@/components/splash/SplashScreen';
import MiniGame from '@/components/game/MiniGame';

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
  const [showSplash, setShowSplash] = useState(true); // 랜딩 페이지 상태
  const [showGame, setShowGame] = useState(false); // 미니게임 팝업 상태
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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

      const restaurantsData = (restaurantData || []) as Restaurant[];
      const transactionsData = (transactionData || []) as Transaction[];

      const restaurantsWithStats: RestaurantWithStats[] = restaurantsData.map(
        (restaurant) => {
          const restaurantTransactions = transactionsData.filter(
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
    const savedUsersStr = localStorage.getItem('bobpool_users');
    // 하위 호환성 (단일 사용자 저장된 경우)
    const savedUserStr = localStorage.getItem('bobpool_user');

    if (savedUsersStr) {
      try {
        const parsed = JSON.parse(savedUsersStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedUsers(parsed);
          setShowUserSelect(false);
          setShowSplash(false); // 이미 사용자가 있으면 스플래시 스킵
          fetchData();
          return;
        }
      } catch (e) {
        // ignore error
      }
    }

    if (savedUserStr) {
      setSelectedUsers([savedUserStr]);
      setShowUserSelect(false);
      setShowSplash(false); // 이미 사용자가 있으면 스플래시 스킵
      fetchData();
    }
  }, [fetchData]);

  const handleUserSelect = (userName: string) => {
    // 중복 선택 허용: 단순히 배열에 추가
    setSelectedUsers(prev => [...prev, userName]);
  };

  const handleUserRemove = (indexToRemove: number) => {
    setSelectedUsers(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleConfirmSelection = () => {
    localStorage.setItem('bobpool_users', JSON.stringify(selectedUsers));
    // 단일 사용자 호환성 유지 (첫 번째 선택된 사용자)
    if (selectedUsers.length > 0) {
      localStorage.setItem('bobpool_user', selectedUsers[0]);
    }
    setShowUserSelect(false);
    fetchData();
  };

  const handleChangeUser = () => {
    setShowUserSelect(true);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleHardReset = () => {
    if (confirm('처음 화면으로 돌아가시겠습니까? 선택한 정보가 초기화됩니다.')) {
      localStorage.removeItem('bobpool_users');
      localStorage.removeItem('bobpool_user');
      setSelectedUsers([]);
      setShowUserSelect(true);
      setShowSplash(true);
      setShowGame(false);
    }
  };

  const handleStart = () => {
    setShowSplash(false);
  };

  // 랜딩 페이지(스플래시) 화면
  if (showSplash) {
    return <SplashScreen onStart={handleStart} />;
  }

  return (
    <>
      {/* 2. MiniGame Popup (Global) */}
      {showGame && <MiniGame onClose={() => setShowGame(false)} />}

      {/* 3. Main Logic: User Select vs Restaurant List */}
      {showUserSelect ? (
        <main className="min-h-screen bg-cream-50 flex flex-col p-6 items-center justify-center relative">

          {/* Hard Reset Button (Fixed Top-Left) */}
          <button
            onClick={handleHardReset}
            className="fixed top-4 left-4 p-2 text-brown-300 hover:text-brown-500 transition-colors z-50"
            aria-label="Reset to Splash"
          >
            <RefreshCw size={16} />
          </button>

          <div className="w-full max-w-sm mb-20 text-center relative">

            <div className="mb-8">
              <div className="w-16 h-16 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-brown-800">누가 식사하나요?</h1>
              <p className="text-brown-500 mt-2">오늘 식사에 참여하는 모든 분을 선택해주세요.</p>
            </div>

            {/* 검색창 */}
            <div className="mb-4 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이름 검색..."
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-cream-300 bg-white text-brown-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* 검색 결과 수 */}
            {searchQuery && (
              <p className="text-sm text-brown-500 mb-2">
                검색 결과: {filteredUsers.length}명
              </p>
            )}

            <div className="bg-white rounded-2xl border border-cream-200 divide-y divide-cream-100 max-h-[50vh] overflow-y-auto w-full">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((name) => {
                  const originalIndex = DEFAULT_USERS.indexOf(name) + 1;
                  return (
                    <button
                      key={name}
                      onClick={() => handleUserSelect(name)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-cream-50 active:bg-cream-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-sm font-medium text-brown-500">
                          {originalIndex}
                        </span>
                        <span className="font-medium text-brown-700">{name}</span>
                      </div>
                      {/* 선택된 횟수 표시 */}
                      {selectedUsers.filter(u => u === name).length > 0 && (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                          {selectedUsers.filter(u => u === name).length}명
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <p className="text-brown-400">검색 결과가 없습니다</p>
                </div>
              )}
            </div>

            {/* 하단 고정 선택 바 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 p-4 shadow-lg safe-area-pb">
              <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {selectedUsers.length > 0 ? (
                    <div className="flex gap-2">
                      {selectedUsers.map((user, idx) => (
                        <span key={`${user}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 bg-cream-100 rounded-lg text-sm text-brown-700">
                          {user}
                          <button
                            onClick={() => handleUserRemove(idx)}
                            className="text-brown-400 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">선택된 인원이 없습니다</span>
                  )}
                </div>
                <button
                  onClick={handleConfirmSelection}
                  disabled={selectedUsers.length === 0}
                  className="bg-brown-600 text-white font-bold py-3 px-6 rounded-xl disabled:bg-cream-300 disabled:cursor-not-allowed transition-colors min-w-[100px] hover:bg-brown-700"
                >
                  다음 ({selectedUsers.length})
                </button>
              </div>
            </div>
          </div>


        </main>
      ) : (
        <div className="flex flex-col min-h-screen bg-cream-50">
          <Header
            title="🍚 밥풀"
            rightElement={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHardReset}
                  className="p-2 rounded-full hover:bg-cream-200 active:bg-cream-300 transition-colors text-brown-400"
                  aria-label="Go Home"
                >
                  <HomeIcon size={20} />
                </button>
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-full hover:bg-cream-200 active:bg-cream-300 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw
                    size={20}
                    className={`text-brown-600 ${loading ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
            }
          />

          <main className="flex-1 p-4">
            {/* 사용자 정보 */}
            <div className="mb-4 p-4 bg-gradient-to-r from-brown-500 to-brown-600 rounded-2xl text-white shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-brown-100">안녕하세요</p>
                    <div className="font-bold text-lg leading-tight">
                      {selectedUsers.length}명 식사 중
                      <p className="text-xs font-normal opacity-80 truncate max-w-[200px]">
                        {selectedUsers.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleChangeUser}
                  className="text-sm text-brown-100 hover:text-white underline whitespace-nowrap"
                >
                  변경
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-brown-800 mb-1">
                어디서 식사하시나요?
              </h2>
              <p className="text-brown-500 text-sm">
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
                    className="h-32 bg-cream-200 rounded-2xl animate-pulse"
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

          <footer className="py-4 px-6 text-center text-xs text-brown-400 border-t border-cream-200">
            <div className="max-w-sm mx-auto relative">
              <p>팀 예산 공유 서비스 | 1인당 10,000원 기준</p>
              {/* Mini Game Floating Button (Inside UI Box) */}
              <button
                onClick={() => setShowGame(true)}
                className="absolute bottom-24 right-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-orange-100 animate-bounce active:scale-90 transition-transform z-40 hover:bg-orange-50"
                aria-label="Play Game"
              >
                <span className="text-2xl">🍊</span>
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
