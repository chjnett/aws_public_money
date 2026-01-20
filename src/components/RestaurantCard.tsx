'use client';

import Link from 'next/link';
import { Users, Coins, Clock } from 'lucide-react';
import { RESTAURANT_THEMES } from '@/lib/constants';

interface RestaurantCardProps {
  id: number;
  name: string;
  memberCount: number;
  poolAmount: number;
  category?: string;
  hours?: string;
}

export default function RestaurantCard({
  id,
  name,
  memberCount,
  poolAmount,
  category,
  hours,
}: RestaurantCardProps) {
  const theme = RESTAURANT_THEMES[name] || RESTAURANT_THEMES['한식'];

  return (
    <Link href={`/restaurant/${id}`}>
      <div
        className={`${theme.bg} ${theme.border} border-2 rounded-2xl p-5 transition-all duration-200 active:scale-[0.98] hover:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{theme.icon}</span>
            <div>
              <h2 className={`text-lg font-bold ${theme.text}`}>{name}</h2>
              {category && (
                <p className="text-xs text-slate-500">{category}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Users size={18} />
            <span className="text-sm font-medium">{memberCount}명</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className={theme.text} size={22} />
            <div>
              <p className="text-xs text-slate-500">현재 공금</p>
              <p className={`text-xl font-bold ${poolAmount >= 0 ? theme.text : 'text-red-600'}`}>
                {poolAmount.toLocaleString()}원
              </p>
            </div>
          </div>

          {hours && (
            <div className="flex items-center gap-1 text-slate-400">
              <Clock size={14} />
              <span className="text-xs">{hours}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
