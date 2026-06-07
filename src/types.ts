/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  description: string;
  account: string; // e.g. 'Mastercard', 'Visa', 'Transfer Bank', 'Apple Pay'
  isPending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon identifier
  colorClass: string; // tailwind color prefix e.g. 'emerald', 'sky'
  budget?: number;
}

export interface UserProfile {
  name: string;
  partnerName: string;
  isLoggedIn: boolean;
  financialFreedomScore: number;
}
