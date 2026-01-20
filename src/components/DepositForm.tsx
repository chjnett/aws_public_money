'use client';

import { useState, useEffect } from 'react';
import { Plus, User, Receipt, X, Trash2, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_USERS, BASE_ALLOWANCE } from '@/lib/constants';
import { TransactionInsert } from '@/types/database';

interface DepositFormProps {
  restaurantId: number;
  onSuccess: () => void;
  menus?: { name: string; price: number }[];
  useMockData?: boolean;
  defaultUserName?: string;
  defaultUserNames?: string[];
}

export default function DepositForm({
  restaurantId,
  onSuccess,
  menus,
  useMockData = false,
  defaultUserName = '',
  defaultUserNames = [],
}: DepositFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // 개별 메뉴/가격 입력을 위한 상태 (사용자 수와 동기화됨)
  const [items, setItems] = useState<{ menuName: string; price: string }[]>([
    { menuName: '', price: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 초기 사용자 설정 및 아이템 동기화
  useEffect(() => {
    // 이미 사용자가 선택되어 있다면 스킵 (초기 마운트 시에만 동작하도록)
    if (selectedUsers.length > 0) return;

    let initialUsers: string[] = [];

    if (defaultUserNames && defaultUserNames.length > 0) {
      initialUsers = defaultUserNames;
    } else if (defaultUserName) {
      initialUsers = [defaultUserName];
    }

    if (initialUsers.length > 0) {
      setSelectedUsers(initialUsers);
      // 사용자 수만큼 아이템 입력창 생성
      setItems(initialUsers.map(() => ({ menuName: '', price: '' })));
    }
  }, [defaultUserName, defaultUserNames, selectedUsers.length]);

  // 총액 계산
  const totalAmount = items.reduce((sum, item) => {
    const price = parseInt(item.price) || 0;
    return sum + price;
  }, 0);

  // 선택된 인원 수에 따른 총 식대 지원금 계산
  const userCount = selectedUsers.length;
  const totalAllowance = userCount * BASE_ALLOWANCE;
  const contribution = totalAmount ? totalAllowance - totalAmount : 0;

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    if (name) {
      setSelectedUsers((prev) => [...prev, name]);
      // 사용자 추가 시 메뉴 입력칸도 추가
      setItems((prev) => [...prev, { menuName: '', price: '' }]);
    }
    e.target.value = '';
  };

  const removeUser = (indexToRemove: number) => {
    setSelectedUsers((prev) => prev.filter((_, index) => index !== indexToRemove));
    // 사용자 제거 시 해당 인덱스의 메뉴 입력칸도 제거 (선택적: 유지하고 싶으면 이 줄 삭제)
    setItems((prev) => {
      // 아이템이 사용자와 1:1로 매핑되어 있다고 가정하고 제거
      // 단, 아이템 수가 사용자 수보다 많거나 적을 수 있는 상황(수동 추가 등)을 고려해야 함
      // 여기서는 "사용자와 함께 메뉴 행도 삭제"하는 UX를 따름
      if (prev.length > indexToRemove) {
        return prev.filter((_, index) => index !== indexToRemove);
      }
      return prev;
    });
  };

  const handleItemChange = (index: number, field: 'menuName' | 'price', value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // 메뉴 이름 선택 시 가격 자동 채우기
    if (field === 'menuName' && menus) {
      const selectedMenu = menus.find((m) => m.name === value);
      if (selectedMenu) {
        newItems[index].price = selectedMenu.price.toString();
      }
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { menuName: '', price: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedUsers.length === 0) {
      setError('최소 1명 이상의 사용자를 선택해주세요');
      return;
    }

    if (totalAmount <= 0) {
      setError('올바른 금액을 입력해주세요');
      return;
    }

    setLoading(true);

    const joinedUserNames = selectedUsers.join(', ');

    // Mock 데이터 모드
    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSelectedUsers([]);
      setItems([{ menuName: '', price: '' }]);
      setLoading(false);
      onSuccess();
      return;
    }

    try {
      const insertData: TransactionInsert = {
        restaurant_id: restaurantId,
        user_name: joinedUserNames,
        amount: totalAmount,
        contribution: contribution,
        type: 'DEPOSIT',
      };
      const { error: insertError } = await supabase
        .from('transactions')
        .insert(insertData as never);

      if (insertError) throw insertError;

      setSelectedUsers([]);
      setItems([{ menuName: '', price: '' }]);
      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      setError('등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Receipt size={20} className="text-orange-500" />
        <h3 className="font-semibold text-brown-700">식대 등록</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 사용자 선택 영역 */}
        <div>
          <label className="flex items-center gap-2 text-sm text-brown-500 mb-2">
            <User size={16} />
            이름 선택 ({userCount}명)
          </label>

          {/* 선택된 사용자 태그 목록 */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-cream-50 rounded-xl border border-cream-100">
              {selectedUsers.map((user, index) => (
                <span
                  key={`${user}-${index}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium animate-in fade-in zoom-in duration-200"
                >
                  {user}
                  <button
                    type="button"
                    onClick={() => removeUser(index)}
                    className="p-0.5 hover:bg-orange-200 rounded-full transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <select
            onChange={handleUserSelect}
            className="w-full h-12 px-4 rounded-xl border border-cream-200 bg-cream-50 text-brown-700 focus:border-orange-400 focus:outline-none"
            value=""
          >
            <option value="">+ 사용자 추가</option>
            {DEFAULT_USERS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 메뉴 입력 영역 (동적 리스트) */}
        <div>
          <label className="text-sm text-brown-500 mb-2 block">
            메뉴 및 가격 ({items.length}개)
          </label>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex-1 space-y-2">
                  {/* 메뉴 선택/입력 */}
                  {menus && menus.length > 0 ? (
                    <div className="relative">
                      <select
                        value={item.menuName}
                        onChange={(e) => handleItemChange(index, 'menuName', e.target.value)}
                        className="w-full h-12 pl-4 pr-10 rounded-xl border border-cream-200 bg-white text-sm text-brown-700 focus:border-orange-400 focus:outline-none transition-shadow appearance-none cursor-pointer"
                      >
                        <option value="">메뉴 선택 (혹은 직접 입력)</option>
                        {menus.map((menu) => (
                          <option key={menu.name} value={menu.name}>
                            {menu.name} - {menu.price.toLocaleString()}원
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none" size={16} />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={item.menuName}
                      onChange={(e) => handleItemChange(index, 'menuName', e.target.value)}
                      placeholder="메뉴명"
                      className="w-full h-12 px-4 rounded-xl border border-cream-200 bg-white text-sm text-brown-700 focus:border-orange-400 focus:outline-none transition-shadow"
                    />
                  )}

                  {/* 가격 입력 */}
                  <div className="relative">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      placeholder="가격 (원)"
                      className="w-full h-12 pl-4 pr-10 rounded-xl border border-cream-200 bg-white text-sm focus:border-orange-400 focus:outline-none transition-shadow"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 text-sm">원</span>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={items.length === 1 && index === 0}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-3 text-sm text-orange-600 font-medium flex items-center gap-1 hover:underline"
          >
            <Plus size={14} />
            메뉴 추가하기
          </button>
        </div>

        {/* 요약 컨테이너 */}
        <div className={`p-4 rounded-xl space-y-3 ${contribution >= 0 ? 'bg-brown-50' : 'bg-red-50'}`}>
          <div className="flex justify-between items-center text-sm">
            <span className="text-brown-500">총 지원금 ({userCount}인)</span>
            <span className="font-semibold text-brown-800">{totalAllowance.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-brown-500">총 사용 금액</span>
            <span className="font-semibold text-brown-800">{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="border-t border-brown-200/50 pt-2 flex justify-between items-center">
            <span className="font-bold text-brown-700">공금 기여금</span>
            <span
              className={`text-lg font-bold ${contribution >= 0 ? 'text-brown-700' : 'text-red-600'}`}
            >
              {contribution >= 0 ? '+' : ''}
              {contribution.toLocaleString()}원
            </span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center animate-pulse">{error}</p>}

        <button
          type="submit"
          disabled={loading || selectedUsers.length === 0 || totalAmount <= 0}
          className="w-full h-12 bg-brown-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-brown-700 active:bg-brown-800 disabled:bg-cream-300 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <>
              <Plus size={20} />
              등록하기
            </>
          )}
        </button>
      </form>
    </div>
  );
}
