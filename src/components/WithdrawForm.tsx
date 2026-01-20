'use client';

import { useState, useEffect } from 'react';
import { Minus, User, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_USERS } from '@/lib/constants';
import { TransactionInsert } from '@/types/database';

interface WithdrawFormProps {
  restaurantId: number;
  currentPool: number;
  onSuccess: () => void;
  useMockData?: boolean;
  defaultUserName?: string;
}

export default function WithdrawForm({
  restaurantId,
  currentPool,
  onSuccess,
  useMockData = false,
  defaultUserName = '',
}: WithdrawFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(defaultUserName);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // defaultUserName이 변경되면 userName 업데이트
  useEffect(() => {
    if (defaultUserName) {
      setUserName(defaultUserName);
    }
  }, [defaultUserName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userName) {
      setError('사용자를 선택해주세요');
      return;
    }

    const amountNum = parseInt(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('올바른 금액을 입력해주세요');
      return;
    }

    setLoading(true);

    // Mock 데이터 모드
    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserName('');
      setAmount('');
      setIsOpen(false);
      setLoading(false);
      onSuccess();
      return;
    }

    try {
      const insertData: TransactionInsert = {
        restaurant_id: restaurantId,
        user_name: userName,
        amount: amountNum,
        contribution: -amountNum,
        type: 'WITHDRAW',
      };
      const { error: insertError } = await supabase
        .from('transactions')
        .insert(insertData as never);

      if (insertError) throw insertError;

      setUserName('');
      setAmount('');
      setIsOpen(false);
      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      setError('등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-14 bg-white border border-rose-200 text-rose-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-50 active:bg-rose-100 transition-colors shadow-sm"
      >
        <ShoppingBag size={22} />
        공금 쓰기 (사이드 메뉴)
      </button>
    );
  }

  return (
    <div className="bg-rose-50 rounded-2xl border-2 border-rose-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-rose-500" />
          <h3 className="font-semibold text-rose-700">공금 사용</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          취소
        </button>
      </div>

      <div className="mb-4 p-3 bg-white rounded-xl">
        <p className="text-xs text-slate-400">현재 공금 잔액</p>
        <p
          className={`text-lg font-bold ${currentPool >= 0 ? 'text-rose-600' : 'text-red-600'}`}
        >
          {currentPool.toLocaleString()}원
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <User size={16} />
            사용자 선택
          </label>
          <select
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-rose-200 bg-white text-slate-700 focus:border-rose-400"
          >
            <option value="">누가 사용하나요?</option>
            {DEFAULT_USERS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-500 mb-2 block">
            사용 금액 (원)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="예: 5000"
            className="w-full h-12 px-4 rounded-xl border border-rose-200 bg-white text-slate-700 focus:border-rose-400"
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading || !userName || !amount}
          className="w-full h-12 bg-rose-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-600 active:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <>
              <Minus size={20} />
              사용하기
            </>
          )}
        </button>
      </form>
    </div>
  );
}
