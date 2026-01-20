'use client';

import { Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { RESTAURANT_THEMES } from '@/lib/constants';

interface PoolStatusProps {
  restaurantName: string;
  poolAmount: number;
  totalDeposit: number;
  totalWithdraw: number;
}

export default function PoolStatus({
  restaurantName,
  poolAmount,
  totalDeposit,
  totalWithdraw,
}: PoolStatusProps) {
  const theme = RESTAURANT_THEMES[restaurantName] || RESTAURANT_THEMES['한식'];

  return (
    <div className={`${theme.bg} rounded-2xl p-6 border-2 ${theme.border}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${theme.gradient}`}>
          <Coins size={28} className="text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">현재 공금</p>
          <p className={`text-3xl font-bold ${poolAmount >= 0 ? theme.text : 'text-red-600'}`}>
            {poolAmount.toLocaleString()}원
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/50">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-500" />
          <div>
            <p className="text-xs text-slate-400">총 적립</p>
            <p className="text-sm font-semibold text-blue-600">
              +{totalDeposit.toLocaleString()}원
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown size={18} className="text-red-500" />
          <div>
            <p className="text-xs text-slate-400">총 사용</p>
            <p className="text-sm font-semibold text-red-600">
              -{totalWithdraw.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
