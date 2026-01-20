'use client';

import { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Edit2, X, Check } from 'lucide-react';
import { Transaction, TransactionUpdate } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { BASE_ALLOWANCE } from '@/lib/constants';

interface TransactionLogProps {
  transactions: Transaction[];
  onUpdate: () => void;
  useMockData?: boolean;
}

export default function TransactionLog({
  transactions,
  onUpdate,
  useMockData = false,
}: TransactionLogProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditAmount(transaction.amount.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditAmount('');
  };

  const handleSave = async (transaction: Transaction) => {
    const amountNum = parseInt(editAmount);
    if (isNaN(amountNum) || amountNum < 0) return;

    setLoading(true);

    // Mock 데이터 모드
    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEditingId(null);
      setEditAmount('');
      setLoading(false);
      onUpdate();
      return;
    }

    try {
      let newContribution: number;
      if (transaction.type === 'DEPOSIT') {
        newContribution = BASE_ALLOWANCE - amountNum;
      } else {
        newContribution = -amountNum;
      }

      const updateData: TransactionUpdate = {
        amount: amountNum,
        contribution: newContribution,
      };
      const { error } = await supabase
        .from('transactions')
        .update(updateData as never)
        .eq('id', transaction.id);

      if (error) throw error;

      setEditingId(null);
      setEditAmount('');
      onUpdate();
    } catch (err) {
      console.error('Error updating:', err);
    } finally {
      setLoading(false);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 text-center">
        <Clock size={40} className="text-slate-300 mx-auto mb-3" />
        <p className="text-slate-400">아직 등록된 내역이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <div className="flex items-center gap-2 p-4 border-b border-slate-100">
        <Clock size={20} className="text-slate-500" />
        <h3 className="font-semibold text-slate-700">실시간 장부</h3>
        <span className="ml-auto text-sm text-slate-400">
          {transactions.length}건
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-slate-50 transition-colors"
          >
            {editingId === transaction.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleSave(transaction)}
                  disabled={loading}
                  className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === 'DEPOSIT'
                        ? 'bg-blue-100'
                        : 'bg-rose-100'
                    }`}
                  >
                    {transaction.type === 'DEPOSIT' ? (
                      <TrendingUp size={18} className="text-blue-500" />
                    ) : (
                      <TrendingDown size={18} className="text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">
                      {transaction.user_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {transaction.type === 'DEPOSIT' ? '식대' : '공금 사용'}{' '}
                      {transaction.amount.toLocaleString()}원
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.contribution >= 0
                          ? 'text-blue-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {transaction.contribution >= 0 ? '+' : ''}
                      {transaction.contribution.toLocaleString()}원
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatTime(transaction.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
