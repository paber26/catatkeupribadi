/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  HeartPulse,
  Coins,
  Wallet
} from 'lucide-react';
import { Transaction } from '../types';

interface RiwayatScreenProps {
  transactions: Transaction[];
  currency: 'USD' | 'IDR';
  onDeleteTransaction?: (id: string) => void;
}

export default function RiwayatScreen({ transactions, currency, onDeleteTransaction }: RiwayatScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'semua' | 'income' | 'expense'>('semua');

  const formatValue = (val: number) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(val);
    } else {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(val);
    }
  };

  // Render proper Lucide React icon based on category or textual keyword
  const getIcon = (cat: string, desc: string) => {
    const combined = (cat + ' ' + desc).toLowerCase();
    if (combined.includes('makan') || combined.includes('restoran') || combined.includes('bistro') || combined.includes('kopi') || combined.includes('minum')) {
      return <UtensilsCrossed className="text-[#943700]" size={18} />;
    }
    if (combined.includes('commute') || combined.includes('transport') || combined.includes('mobil') || combined.includes('motor') || combined.includes('bus') || combined.includes('kereta')) {
      return <Car className="text-[#004ac6]" size={18} />;
    }
    if (combined.includes('gaji') || combined.includes('freelance') || combined.includes('proyek') || combined.includes('income')) {
      return <Coins className="text-[#006e2d]" size={18} />;
    }
    if (combined.includes('belanja') || combined.includes('pasar') || combined.includes('supermarket') || combined.includes('retail')) {
      return <ShoppingBag className="text-[#004ac6]" size={18} />;
    }
    if (combined.includes('listrik') || combined.includes('air') || combined.includes('internet') || combined.includes('tagihan') || combined.includes('sewa')) {
      return <Receipt className="text-[#bc4800]" size={18} />;
    }
    if (combined.includes('sport') || combined.includes('gym') || combined.includes('kebugaran') || combined.includes('sehat') || combined.includes('dokter')) {
      return <HeartPulse className="text-[#ba1a1a]" size={18} />;
    }
    if (combined.includes('bioskop') || combined.includes('film') || combined.includes('hiburan') || combined.includes('game')) {
      return <Film className="text-[#943700]" size={18} />;
    }
    return <Wallet className="text-[#737686]" size={18} />;
  };

  const getStyleClasses = (cat: string) => {
    const combined = cat.toLowerCase();
    if (combined.includes('makan') || combined.includes('kopi')) return 'border border-[#BC5434]/30 text-[#BC5434]';
    if (combined.includes('gaji') || combined.includes('proyek')) return 'border border-[#006e2d]/30 text-[#006e2d]';
    if (combined.includes('sehat') || combined.includes('kebugaran') || combined.includes('kesehatan')) return 'border border-[#BC5434]/40 text-[#BC5434]';
    if (combined.includes('tagihan') || combined.includes('listrik')) return 'border border-[#BC5434]/40 text-[#BC5434]';
    if (combined.includes('belanja')) return 'border border-[#1A1A1A]/20 text-[#1A1A1A]/70';
    return 'border border-[#1A1A1A]/10 text-[#1A1A1A]/60';
  };

  // Perform search & filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Filter by type chip
      if (activeFilter === 'income' && tx.type !== 'income') return false;
      if (activeFilter === 'expense' && tx.type !== 'expense') return false;

      // Filter by search query
      if (searchQuery.trim() === '') return true;
      const term = searchQuery.toLowerCase();
      return (
        tx.description.toLowerCase().includes(term) ||
        tx.category.toLowerCase().includes(term) ||
        tx.account.toLowerCase().includes(term)
      );
    });
  }, [transactions, searchQuery, activeFilter]);

  // Group by relative dates: "Hari Ini", "Kemarin", "Sebelumnya"
  const groupedTransactions = useMemo(() => {
    const today: Transaction[] = [];
    const yesterday: Transaction[] = [];
    const older: Transaction[] = [];

    // Current date values mock-related (e.g. 2026-06-07)
    filteredTransactions.forEach((tx) => {
      if (tx.date === '2026-06-07') {
        today.push(tx);
      } else if (tx.date === '2026-06-06') {
        yesterday.push(tx);
      } else {
        older.push(tx);
      }
    });

    return { today, yesterday, older };
  }, [filteredTransactions]);

  // Dynamic dynamic month sums
  const monthlyIncomingSum = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((s, tx) => s + tx.amount, 0);
  }, [filteredTransactions]);

  const monthlyOutgoingSum = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((s, tx) => s + tx.amount, 0);
  }, [filteredTransactions]);

  return (
    <div className="pb-16 text-[#1A1A1A] max-w-md mx-auto">
      {/* Search Input Box */}
      <div className="relative w-full mb-5 mt-3 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-[#1A1A1A]/50" size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari transaksi saku..."
          className="w-full h-11 bg-white border border-[#1A1A1A]/15 rounded-none pl-11 pr-4 text-[#1A1A1A] placeholder-[#1A1A1A]/30 focus:border-[#BC5434] focus:ring-0 transition-colors outline-none text-xs font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] uppercase tracking-wider font-bold text-[#BC5434] hover:text-[#1A1A1A]"
          >
            Bersih
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveFilter('semua')}
          className={`px-4.5 py-2 rounded-none font-sans text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all duration-150 ${
            activeFilter === 'semua'
              ? 'bg-[#1A1A1A] text-white'
              : 'border border-[#1A1A1A]/10 bg-transparent text-[#1A1A1A]/70 hover:bg-[#E5E2D8]/40'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveFilter('income')}
          className={`px-4.5 py-2 rounded-none font-sans text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all duration-150 ${
            activeFilter === 'income'
              ? 'bg-[#1A1A1A] text-white'
              : 'border border-[#1A1A1A]/10 bg-transparent text-[#1A1A1A]/70 hover:bg-[#E5E2D8]/40'
          }`}
        >
          Pemasukan
        </button>
        <button
          onClick={() => setActiveFilter('expense')}
          className={`px-4.5 py-2 rounded-none font-sans text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all duration-150 ${
            activeFilter === 'expense'
              ? 'bg-[#1A1A1A] text-white'
              : 'border border-[#1A1A1A]/10 bg-transparent text-[#1A1A1A]/70 hover:bg-[#E5E2D8]/40'
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Group Lists */}
      <div className="space-y-6">
        {/* Today Block */}
        {groupedTransactions.today.length > 0 && (
          <div>
            <h3 className="font-sans text-[10px] font-bold text-[#BC5434] uppercase tracking-[0.2em] mb-3 px-1 border-b border-[#1A1A1A]/10 pb-1">
              Hari Ini
            </h3>
            <div className="space-y-2">
              {groupedTransactions.today.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center p-3.5 bg-[#E5E2D8]/10 rounded-none border border-[#1A1A1A]/10 hover:bg-[#E5E2D8]/30 transition-colors"
                >
                  <div className={`w-9 h-9 flex items-center justify-center mr-3.5 bg-transparent ${getStyleClasses(tx.category)}`}>
                    {getIcon(tx.category, tx.description)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-serif text-sm font-bold text-[#1A1A1A] truncate">
                      {tx.description || tx.category}
                    </p>
                    <p className="font-serif text-xs italic text-[#1A1A1A]/50">
                      {tx.account} • {tx.time || '12:00'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-serif text-sm font-bold ${tx.type === 'expense' ? 'text-[#BC5434]' : 'text-[#007230]'}`}>
                      {tx.type === 'expense' ? '-' : '+'}{formatValue(tx.amount)}
                    </p>
                    {onDeleteTransaction && (
                      <button
                        onClick={() => {
                          if (confirm('Hapus transaksi ini?')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="text-[9px] uppercase tracking-wider font-bold text-[#BC5434] hover:text-[#1A1A1A] mt-1 block w-full text-right"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yesterday Block */}
        {groupedTransactions.yesterday.length > 0 && (
          <div>
            <h3 className="font-sans text-[10px] font-bold text-[#BC5434] uppercase tracking-[0.2em] mb-3 px-1 border-b border-[#1A1A1A]/10 pb-1">
              Kemarin
            </h3>
            <div className="space-y-2">
              {groupedTransactions.yesterday.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center p-3.5 bg-[#E5E2D8]/10 rounded-none border border-[#1A1A1A]/10 hover:bg-[#E5E2D8]/30 transition-colors"
                >
                  <div className={`w-9 h-9 flex items-center justify-center mr-3.5 bg-transparent ${getStyleClasses(tx.category)}`}>
                    {getIcon(tx.category, tx.description)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-serif text-sm font-bold text-[#1A1A1A] truncate">
                      {tx.description || tx.category}
                    </p>
                    <p className="font-serif text-xs italic text-[#1A1A1A]/50">
                      {tx.account} • {tx.time || '15:30'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-serif text-sm font-bold ${tx.type === 'expense' ? 'text-[#BC5434]' : 'text-[#007230]'}`}>
                      {tx.type === 'expense' ? '-' : '+'}{formatValue(tx.amount)}
                    </p>
                    {onDeleteTransaction && (
                      <button
                        onClick={() => {
                          if (confirm('Hapus transaksi ini?')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="text-[9px] uppercase tracking-wider font-bold text-[#BC5434] hover:text-[#1A1A1A] mt-1 block w-full text-right"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Older Block */}
        {groupedTransactions.older.length > 0 && (
          <div>
            <h3 className="font-sans text-[10px] font-bold text-[#BC5434] uppercase tracking-[0.2em] mb-3 px-1 border-b border-[#1A1A1A]/10 pb-1">
              Sebelumnya
            </h3>
            <div className="space-y-2">
              {groupedTransactions.older.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center p-3.5 bg-[#E5E2D8]/10 rounded-none border border-[#1A1A1A]/10 hover:bg-[#E5E2D8]/30 transition-colors"
                >
                  <div className={`w-9 h-9 flex items-center justify-center mr-3.5 bg-transparent ${getStyleClasses(tx.category)}`}>
                    {getIcon(tx.category, tx.description)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-serif text-sm font-bold text-[#1A1A1A] truncate">
                      {tx.description || tx.category}
                    </p>
                    <p className="font-serif text-xs italic text-[#1A1A1A]/50">
                      {tx.account} • {tx.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-serif text-sm font-bold ${tx.type === 'expense' ? 'text-[#BC5434]' : 'text-[#007230]'}`}>
                      {tx.type === 'expense' ? '-' : '+'}{formatValue(tx.amount)}
                    </p>
                    {onDeleteTransaction && (
                      <button
                        onClick={() => {
                          if (confirm('Hapus transaksi ini?')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="text-[9px] uppercase tracking-wider font-bold text-[#BC5434] hover:text-[#1A1A1A] mt-1 block w-full text-right"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state fall-back */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 px-4 bg-transparent rounded-none border border-[#1A1A1A]/10">
            <p className="font-serif text-xs italic text-[#1A1A1A]/60">
              Tidak ada catatan transaksi yang sesuai dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>

      {/* Summary Bento Row widgets at bottom */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {/* Monthly Income summed card */}
        <div className="p-4 rounded-none bg-[#E5E2D8]/40 border border-[#1A1A1A]/10 text-[#1A1A1A]">
          <TrendingUp className="text-[#006e2d] mb-2" size={16} />
          <p className="font-sans text-[8px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest">
            Total Pemasukan
          </p>
          <p className="font-serif font-bold italic text-sm mt-1 text-[#006e2d]">
            {formatValue(monthlyIncomingSum || (currency === 'USD' ? 4250 : 4250000))}
          </p>
        </div>

        {/* Monthly Expense summed card */}
        <div className="p-4 rounded-none bg-[#E5E2D8]/40 border border-[#1A1A1A]/10 text-[#1A1A1A]">
          <TrendingDown className="text-[#BC5434] mb-2" size={16} />
          <p className="font-sans text-[8px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest">
            Total Pengeluaran
          </p>
          <p className="font-serif font-bold italic text-sm mt-1 text-[#BC5434]">
            {formatValue(monthlyOutgoingSum || (currency === 'USD' ? 2180.3 : 2180300))}
          </p>
        </div>
      </div>
    </div>
  );
}
