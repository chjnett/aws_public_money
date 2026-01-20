'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import PoolStatus from '@/components/PoolStatus';
import DepositForm from '@/components/DepositForm';
import WithdrawForm from '@/components/WithdrawForm';
import TransactionLog from '@/components/TransactionLog';
import { Transaction } from '@/types/database';
import { RESTAURANT_THEMES, RESTAURANTS, MOCK_TRANSACTIONS } from '@/lib/constants';
import { Phone, MapPin, Clock } from 'lucide-react';

// 환경변수가 설정되어 있는지 확인
const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http');

interface RestaurantData {
  id: number;
  name: string;
  phone?: string;
  mapUrl?: string;
  hours?: string;
  category?: string;
  note?: string;
  menus?: { name: string; price: number }[];
}

export default function RestaurantDetail() {
  const params = useParams();
  const restaurantId = parseInt(params.id as string);

  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(!isSupabaseConfigured);
  const [selectedUser, setSelectedUser] = useState<string>(''); // 하위 호환
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // 다중 선택

  // localStorage에서 선택된 사용자 불러오기
  useEffect(() => {
    // 1. 다중 사용자 확인
    const savedUsersStr = localStorage.getItem('bobpool_users');
    if (savedUsersStr) {
      try {
        const parsed = JSON.parse(savedUsersStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedUsers(parsed);
          setSelectedUser(parsed[0]); // 첫 번째 사용자를 대표로 설정 (withdaw 등에서 사용 가능성)
          return;
        }
      } catch (e) { /* ignore */ }
    }

    // 2. 단일 사용자 확인 (fallback)
    const savedUser = localStorage.getItem('bobpool_user');
    if (savedUser) {
      setSelectedUser(savedUser);
      setSelectedUsers([savedUser]);
    }
  }, []);

  const fetchData = useCallback(async () => {
    // Mock 데이터 사용
    if (useMockData) {
      const restaurantInfo = RESTAURANTS.find(r => r.id === restaurantId);
      if (restaurantInfo) {
        setRestaurant({
          id: restaurantInfo.id,
          name: restaurantInfo.name,
          phone: restaurantInfo.phone,
          mapUrl: restaurantInfo.mapUrl,
          hours: restaurantInfo.hours,
          category: restaurantInfo.category,
          note: restaurantInfo.note,
          menus: restaurantInfo.menus,
        });

        const mockTxs = MOCK_TRANSACTIONS
          .filter(t => t.restaurant_id === restaurantId)
          .map(t => ({
            ...t,
            created_at: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          }));
        setTransactions(mockTxs);
      }
      setLoading(false);
      return;
    }

    // Supabase 연결 시
    try {
      const { supabase } = await import('@/lib/supabase');

      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (restaurantError) throw restaurantError;

      const restaurantInfo = RESTAURANTS.find(r => r.id === restaurantId);
      setRestaurant({
        ...(restaurantData as Restaurant),
        phone: restaurantInfo?.phone,
        mapUrl: restaurantInfo?.mapUrl,
        hours: restaurantInfo?.hours,
        category: restaurantInfo?.category,
        note: restaurantInfo?.note,
        menus: restaurantInfo?.menus,
      });

      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (transactionError) throw transactionError;
      setTransactions((transactionData || []) as Transaction[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, useMockData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 통계 계산
  const totalDeposit = transactions
    .filter((t) => t.type === 'DEPOSIT' && t.contribution > 0)
    .reduce((sum, t) => sum + t.contribution, 0);

  const totalWithdraw = transactions
    .filter((t) => t.type === 'WITHDRAW')
    .reduce((sum, t) => sum + Math.abs(t.contribution), 0);

  const currentPool = transactions.reduce((sum, t) => sum + t.contribution, 0);

  const theme = restaurant
    ? RESTAURANT_THEMES[restaurant.name] || RESTAURANT_THEMES['한식']
    : RESTAURANT_THEMES['한식'];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="로딩 중..." showBack />
        <main className="flex-1 p-4 space-y-4">
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
        </main>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="오류" showBack />
        <main className="flex-1 p-4 flex items-center justify-center">
          <p className="text-slate-500">식당을 찾을 수 없습니다</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={`${theme.icon} ${restaurant.name}`}
        showBack
      />

      <main className="flex-1 p-4 space-y-4 pb-8">
        {/* 식당 정보 */}
        <div className={`${theme.bg} rounded-xl p-4 space-y-2 animate-fade-in-up opacity-0`}>
          {restaurant.category && (
            <p className="text-sm text-slate-600">{restaurant.category}</p>
          )}
          <div className="flex flex-wrap gap-3 text-sm">
            {restaurant.hours && (
              <div className="flex items-center gap-1 text-slate-500">
                <Clock size={14} />
                <span>{restaurant.hours}</span>
                {restaurant.note && (
                  <span className="text-red-500 text-xs ml-1">({restaurant.note})</span>
                )}
              </div>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Phone size={14} />
                <span>{restaurant.phone}</span>
              </a>
            )}
            {restaurant.mapUrl && (
              <a
                href={restaurant.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-green-600 hover:underline"
              >
                <MapPin size={14} />
                <span>지도 보기</span>
              </a>
            )}
          </div>
        </div>

        {/* 공금 현황판 */}
        <div className="animate-fade-in-up opacity-0 delay-100">
          <PoolStatus
            restaurantName={restaurant.name}
            poolAmount={currentPool}
            totalDeposit={totalDeposit}
            totalWithdraw={totalWithdraw}
          />
        </div>

        {/* 식대 등록 폼 */}
        <div className="animate-fade-in-up opacity-0 delay-200">
          <DepositForm
            restaurantId={restaurantId}
            onSuccess={fetchData}
            menus={restaurant.menus}
            useMockData={useMockData}
            defaultUserName={selectedUser}
            defaultUserNames={selectedUsers} // 배열 전달
          />
        </div>

        {/* 공금 사용 버튼/폼 */}
        <div className="animate-fade-in-up opacity-0 delay-300">
          <WithdrawForm
            restaurantId={restaurantId}
            currentPool={currentPool}
            onSuccess={fetchData}
            useMockData={useMockData}
            defaultUserName={selectedUser} // 공금 사용은 보통 대표 1명이 하므로 유지 (또는 추후 다중 선택)
          />
        </div>

        {/* 실시간 장부 */}
        <div className="animate-fade-in-up opacity-0 delay-400">
          <TransactionLog
            transactions={transactions}
            onUpdate={fetchData}
            useMockData={useMockData}
          />
        </div>

        {useMockData && (
          <p className="text-xs text-amber-500 text-center animate-fade-in-up opacity-0 delay-500">
            * 테스트 데이터로 표시 중입니다 (저장되지 않음)
          </p>
        )}
      </main>
    </div>
  );
}
