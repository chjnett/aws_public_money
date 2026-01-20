'use client';

import { useState, useEffect } from 'react';
import { Plus, User, Receipt } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_USERS, BASE_ALLOWANCE } from '@/lib/constants';
import { TransactionInsert } from '@/types/database';

interface DepositFormProps {
  restaurantId: number;
  onSuccess: () => void;
  menus?: { name: string; price: number }[];
  useMockData?: boolean;
  defaultUserName?: string;
}

export default function DepositForm({
  restaurantId,
  onSuccess,
  menus,
  useMockData = false,
  defaultUserName = '',
}: DepositFormProps) {
  const [userName, setUserName] = useState(defaultUserName);
  const [amount, setAmount] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // defaultUserName이 변경되면 userName 업데이트
  useEffect(() => {
    if (defaultUserName) {
      setUserName(defaultUserName);
    }
  }, [defaultUserName]);

  const contribution = amount ? BASE_ALLOWANCE - parseInt(amount) : 0;

  const handleMenuSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const menuName = e.target.value;
    setSelectedMenu(menuName);
    if (menuName && menus) {
      const menu = menus.find((m) => m.name === menuName);
      if (menu) {
        setAmount(menu.price.toString());
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userName) {
      setError('이름을 선택해주세요');
      return;
    }

    const amountNum = parseInt(amount);
    if (!amount || isNaN(amountNum) || amountNum < 0) {
      setError('올바른 금액을 입력해주세요');
      return;
    }

    setLoading(true);

    // Mock 데이터 모드
    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserName('');
      setAmount('');
      setSelectedMenu('');
      setLoading(false);
      onSuccess();
      return;
    }

    try {
      const insertData: TransactionInsert = {
        restaurant_id: restaurantId,
        user_name: userName,
        amount: amountNum,
        contribution: BASE_ALLOWANCE - amountNum,
        type: 'DEPOSIT',
      };
      const { error: insertError } = await supabase
        .from('transactions')
        .insert(insertData as never);

      if (insertError) throw insertError;

      setUserName('');
      setAmount('');
      setSelectedMenu('');
      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      setError('등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Receipt size={20} className="text-blue-500" />
        <h3 className="font-semibold text-slate-700">식대 등록</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <User size={16} />
            이름 선택
          </label>
          <select
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400"
          >
            <option value="">이름을 선택하세요</option>
            {DEFAULT_USERS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {menus && menus.length > 0 && (
          <div>
            <label className="text-sm text-slate-500 mb-2 block">
              메뉴 선택 (선택사항)
            </label>
            <select
              value={selectedMenu}
              onChange={handleMenuSelect}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400"
            >
              <option value="">직접 입력</option>
              {menus.map((menu) => (
                <option key={menu.name} value={menu.name}>
                  {menu.name} - {menu.price.toLocaleString()}원
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-sm text-slate-500 mb-2 block">
            메뉴 가격 (원)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelectedMenu('');
            }}
            placeholder="예: 9000"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400"
          />
        </div>

        {amount && (
          <div
            className={`p-3 rounded-xl ${contribution >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}
          >
            <p className="text-sm text-slate-500">공금 기여금</p>
            <p
              className={`text-xl font-bold ${contribution >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            >
              {contribution >= 0 ? '+' : ''}
              {contribution.toLocaleString()}원
            </p>
            <p className="text-xs text-slate-400 mt-1">
              (10,000원 - {parseInt(amount).toLocaleString()}원)
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading || !userName || !amount}
          className="w-full h-12 bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 active:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
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
