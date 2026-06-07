/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Wallet,
  RefreshCw,
  Info,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowLeft,
  Coins,
  ShoppingCart,
  Coffee,
  Dumbbell
} from 'lucide-react';
import { Transaction } from '../types';

interface BerandaScreenProps {
  onNavigate: (tab: string) => void;
  transactions: Transaction[];
  onOpenAddTransaction: () => void;
  currency: 'USD' | 'IDR';
  onSync: () => void;
  isSyncing: boolean;
}

export default function BerandaScreen({
  onNavigate,
  transactions,
  onOpenAddTransaction,
  currency,
  onSync,
  isSyncing
}: BerandaScreenProps) {
  // Compute totals
  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // We can simulate an initial balance of $12,450.80 as requested in the mockup
  // If the user adds items, we can adjust the initial balance accordingly!
  const baseBalance = currency === 'USD' ? 12450.8 : 124508000;
  const computedBalance = baseBalance + (totalIncome - totalExpense) * (currency === 'USD' ? 1 : 1);

  const formatValue = (val: number, isCurrencyVal = true) => {
    if (!isCurrencyVal) return val.toString();
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(val);
    } else {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
  };

  // Pre-seed some default transactions matching the visual states
  // We'll show the top 4 most recent transactions
  const recentTransactions = transactions.slice(0, 4);

  // Get specific icon based on category tag
  const getTransactionIcon = (cat: string) => {
    const nameLower = cat.toLowerCase();
    if (nameLower.includes('gaji') || nameLower.includes('proyek') || nameLower.includes('freelance')) {
      return <Coins className="text-[#006e2d]" size={18} />;
    }
    if (nameLower.includes('belanja') || nameLower.includes('supermarket') || nameLower.includes('pasar')) {
      return <ShoppingCart className="text-[#BC5434]" size={18} />;
    }
    if (nameLower.includes('kopi') || nameLower.includes('makan') || nameLower.includes('minum') || nameLower.includes('bistro') || nameLower.includes('kafe')) {
      return <Coffee className="text-[#8B5A2B]" size={18} />;
    }
    if (nameLower.includes('gym') || nameLower.includes('kebugaran') || nameLower.includes('sehat')) {
      return <Dumbbell className="text-[#BC5434]" size={18} />;
    }
    return <Wallet className="text-[#1A1A1A]/70" size={18} />;
  };

  const getCategoryClass = (cat: string) => {
    const nameLower = cat.toLowerCase();
    if (nameLower.includes('gaji') || nameLower.includes('freelance')) return 'border border-[#006e2d]/30 text-[#006e2d]';
    return 'border border-[#1A1A1A]/20 text-[#1A1A1A]/70';
  };

  const getAmountColor = (type: string) => {
    return type === 'income' ? 'text-[#006e2d]' : 'text-[#1A1A1A]';
  };

  // Helper description generator
  const getTxMetadata = (tx: Transaction) => {
    // Generate dates like Bulanan • 2 jam lalu or Kafe • 12 Nov
    if (tx.id === 'tx-1') return 'Bulanan • 2 jam lalu';
    if (tx.id === 'tx-2') return 'Swalayan • Kemarin';
    if (tx.id === 'tx-3') return 'Kafe • 12 Nov';
    if (tx.id === 'tx-4') return 'Transfer • 09:15';
    if (tx.id === 'tx-7') return 'Sewa • 10 Nov';
    
    return `${tx.account} • ${tx.date}`;
  };

  return (
    <div className="pb-12 text-[#1A1A1A] max-w-md mx-auto">
      {/* Welcome Section */}
      <section className="mb-6 pt-4">
        <h2 className="font-display text-4xl font-serif tracking-tighter text-[#1A1A1A] leading-tight">
          Halo, <span className="italic font-light text-[#BC5434]">Alexander</span> <span className="font-light text-2xl">&amp;</span> Istri
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-[1px] w-6 bg-[#BC5434]"></div>
          <p className="text-[#1A1A1A]/70 font-serif text-xs italic">
            Status keuangan keluarga Anda stabil hari ini.
          </p>
        </div>
      </section>

      {/* Hero Total Balance Box (Editorial deep dark slate-black card) */}
      <section className="relative overflow-hidden bg-[#1A1A1A] p-6 text-[#F9F7F2] border border-[#1A1A1A] mb-6">
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] bg-[#BC5434] text-white px-2.5 py-0.5 font-sans font-bold">
                TOTAL SALDO KELUARGA
              </span>
              <h3 className="font-display text-3xl font-serif italic mt-2.5 leading-none tracking-tight">
                {formatValue(computedBalance)}
              </h3>
            </div>
            <button 
              type="button" 
              onClick={() => alert('Saldo dihitung berdasarkan total awal ditambah pemasukan dikurangi pengeluaran.')} 
              className="text-[#F9F7F2]/40 hover:text-white transition-colors"
            >
              <Info size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[#F9F7F2]/10">
            {/* Income Sub-Box */}
            <div className="flex-grow flex items-center gap-2">
              <div>
                <p className="font-sans text-[8px] font-bold text-[#F9F7F2]/50 uppercase tracking-[0.15em] leading-none">
                  PEMASUKAN
                </p>
                <p className="font-serif text-sm font-medium mt-1 text-[#7cf994] italic font-light">
                  {formatValue(totalIncome || (currency === 'USD' ? 4200 : 4200000))}
                </p>
              </div>
            </div>

            <div className="w-px h-8 bg-[#F9F7F2]/10"></div>

            {/* Expenses Sub-Box */}
            <div className="flex-grow flex items-center gap-2">
              <div>
                <p className="font-sans text-[8px] font-bold text-[#F9F7F2]/50 uppercase tracking-[0.15em] leading-none">
                  PENGELUARAN
                </p>
                <p className="font-serif text-sm font-medium mt-1 text-white italic font-light">
                  {formatValue(totalExpense || (currency === 'USD' ? 1850 : 1850000))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Snippet Widgets (Savings + Growth Rate) */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#E5E2D8]/30 p-4 border border-[#1A1A1A]/10 flex items-center gap-3">
          <div className="border border-[#1A1A1A]/20 p-2 text-[#1A1A1A]">
            <PiggyBank size={16} />
          </div>
          <div>
            <p className="font-serif text-xs italic text-[#1A1A1A]/70">Laju Tabungan</p>
            <p className="font-display text-lg font-serif italic font-bold text-[#BC5434]">15.4%</p>
          </div>
        </div>

        <div className="bg-[#E5E2D8]/30 p-4 border border-[#1A1A1A]/10 flex items-center gap-3">
          <div className="border border-[#1A1A1A]/20 p-2 text-[#BC5434]">
            <TrendingUp size={16} />
          </div>
          <div>
            <p className="font-serif text-xs italic text-[#1A1A1A]/70">Pertumbuhan</p>
            <p className="font-display text-lg font-serif italic font-bold text-[#1A1A1A]">+2.1%</p>
          </div>
        </div>
      </div>

      {/* Recent Ledger List */}
      <section className="space-y-4 mb-6">
        <div className="flex justify-between items-baseline border-b border-[#1A1A1A]/15 pb-2">
          <h3 className="font-display text-lg font-serif italic font-semibold text-[#1A1A1A]">
            Jurnal Transaksi
          </h3>
          <button
            onClick={() => onNavigate('riwayat')}
            className="text-[#BC5434] uppercase tracking-widest font-sans text-[10px] font-bold hover:text-[#1A1A1A] transition-colors"
          >
            LIHAT SEMUA
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx) => {
            const isInc = tx.type === 'income';
            return (
              <div
                key={tx.id}
                className="bg-[#E5E2D8]/10 p-3 flex items-center gap-4 border border-[#1A1A1A]/10 hover:bg-[#E5E2D8]/30 transition-all"
              >
                <div className="w-9 h-9 border border-[#1A1A1A]/10 flex items-center justify-center shrink-0 bg-transparent">
                  {getTransactionIcon(tx.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-bold text-[#1A1A1A] truncate">
                    {tx.category === 'Belanja' ? 'Belanja' : tx.category === 'Makanan & Minuman' ? 'Koki' : tx.category === 'Kesehatan' ? 'Kebugaran' : tx.category}
                  </p>
                  <p className="text-[#1A1A1A]/50 font-serif text-xs italic truncate">
                    {getTxMetadata(tx)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-serif text-sm font-bold ${getAmountColor(tx.type)}`}>
                    {isInc ? '+' : '-'}{formatValue(tx.amount)}
                  </p>
                  <span className={`inline-block px-2 py-0.5 text-[8px] font-sans font-bold uppercase mt-1 leading-none ${getCategoryClass(tx.category)}`}>
                    {getCategoryClass(tx.category).includes('green') ? 'MASUK' : tx.category.toUpperCase() === 'MAKANAN & MINUMAN' ? 'KULINER' : tx.category.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Bento widget for Financial Freedom Score */}
      <section className="border-4 border-double border-[#1A1A1A]/20 bg-transparent p-5 text-center my-6 space-y-3">
        <p className="font-display text-[#1A1A1A] font-serif italic text-base font-bold">
          Skor Kebebasan Finansial
        </p>
        <div className="flex items-center justify-center gap-3">
          {/* Progress bar and score status */}
          <div className="h-1.5 w-28 bg-[#1A1A1A]/10 overflow-hidden">
            <div className="h-full bg-[#BC5434] w-[78%]"></div>
          </div>
          <span className="font-serif text-sm font-bold italic text-[#1A1A1A]">
            78/100
          </span>
        </div>
        <p className="font-serif text-xs italic text-[#1A1A1A]/70 max-w-[240px] mx-auto leading-relaxed">
          Anda berada di <span className="font-semibold text-[#006e2d]">12% teratas</span> catatan tabungan keluarga bulan ini.
        </p>
      </section>

      {/* Floating Action Bar in Terracotta Editorial style */}
      <button
        onClick={onOpenAddTransaction}
        className="fixed bottom-24 right-5 w-12 h-12 bg-[#BC5434] text-white hover:bg-[#1A1A1A] active:scale-95 transition-all flex items-center justify-center z-40 cursor-pointer shadow-md"
        title="Catat Baru"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
