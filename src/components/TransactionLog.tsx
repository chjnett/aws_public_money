'use client';

import { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Edit2, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(true);

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
      <div className="bg-cream-50 rounded-2xl p-8 text-center border border-cream-200">
        <Clock size={40} className="text-brown-300 mx-auto mb-3" />
        <p className="text-brown-400">아직 등록된 내역이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-cream-200 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-4 border-b border-cream-100 hover:bg-cream-50 transition-colors rounded-t-2xl"
      >
        <Clock size={20} className="text-brown-500" />
        <h3 className="font-semibold text-brown-700">실시간 장부</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-brown-400 bg-cream-100 px-2 py-0.5 rounded-full">
            {transactions.length}건
          </span>
          {isExpanded ? (
            <ChevronUp size={24} className="text-brown-600" />
          ) : (
            <ChevronDown size={24} className="text-brown-600" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-cream-100 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 hover:bg-cream-50 transition-colors"
            >
              {editingId === transaction.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-cream-300 text-sm text-brown-800 focus:border-orange-400 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave(transaction)}
                    disabled={loading}
                    className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-lg bg-cream-100 text-brown-600 hover:bg-cream-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${transaction.type === 'DEPOSIT'
                        ? 'bg-orange-100'
                        : 'bg-brown-100'
                        }`}
                    >
                      {transaction.type === 'DEPOSIT' ? (
                        <TrendingUp size={18} className="text-orange-600" />
                      ) : (
                        <TrendingDown size={18} className="text-brown-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-brown-800">
                        {transaction.user_name}
                      </p>
                      <p className="text-xs text-brown-400">
                        {transaction.type === 'DEPOSIT' ? '식대' : '공금 사용'}{' '}
                        {transaction.amount.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={`font-bold ${transaction.contribution >= 0
                          ? 'text-orange-600'
                          : 'text-brown-600'
                          }`}
                      >
                        {transaction.contribution >= 0 ? '+' : ''}
                        {transaction.contribution.toLocaleString()}원
                      </p>
                      <p className="text-xs text-brown-400">
                        {formatTime(transaction.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 rounded-lg hover:bg-cream-100 text-brown-400 hover:text-brown-600 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
