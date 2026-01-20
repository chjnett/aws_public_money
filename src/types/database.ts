export type TransactionType = 'DEPOSIT' | 'WITHDRAW';

export interface Restaurant {
  id: number;
  name: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  restaurant_id: number;
  user_name: string;
  amount: number;
  contribution: number;
  type: TransactionType;
  created_at: string;
}

export interface TransactionInsert {
  restaurant_id: number;
  user_name: string;
  amount: number;
  contribution: number;
  type: TransactionType;
}

export interface TransactionUpdate {
  amount?: number;
  contribution?: number;
}

export interface PoolStats {
  restaurant_id: number;
  current_pool: number;
}

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant;
        Insert: Omit<Restaurant, 'id' | 'created_at'>;
        Update: Partial<Omit<Restaurant, 'id'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id'>;
        Update: Partial<Omit<User, 'id'>>;
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
      };
    };
    Views: {
      pool_stats: {
        Row: PoolStats;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
