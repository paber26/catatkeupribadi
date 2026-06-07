/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Home,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  RefreshCw,
  Wallet,
  Coins,
  Repeat,
  Heart
} from 'lucide-react';

import { Transaction, Category } from './types';
import { INITIAL_CATEGORIES, INITIAL_TRANSACTIONS } from './data';

import LoginScreen from './components/LoginScreen';
import BerandaScreen from './components/BerandaScreen';
import RiwayatScreen from './components/RiwayatScreen';
import LaporanScreen from './components/LaporanScreen';
import TambahScreen from './components/TambahScreen';
import KelolaKategoriScreen from './components/KelolaKategoriScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in as mockup
  const [currentUser, setCurrentUser] = useState('Alexander & Istri');
  const [activeTab, setActiveTab] = useState('beranda'); // 'beranda' | 'riwayat' | 'laporan' | 'pengaturan'
  const [showAddTask, setShowAddTask] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD'); // Mock is originally USD, let users switch
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize DB from localStorage or seeds
  useEffect(() => {
    const cachedTx = localStorage.getItem('cs_transactions');
    const cachedCat = localStorage.getItem('cs_categories');
    const cachedCurrency = localStorage.getItem('cs_currency');
    const cachedUser = localStorage.getItem('cs_user');
    const cachedLogin = localStorage.getItem('cs_logged_in');

    if (cachedTx) {
      setTransactions(JSON.parse(cachedTx));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('cs_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }

    if (cachedCat) {
      setCategories(JSON.parse(cachedCat));
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('cs_categories', JSON.stringify(INITIAL_CATEGORIES));
    }

    if (cachedCurrency) {
      setCurrency(cachedCurrency as 'USD' | 'IDR');
    }

    if (cachedUser) {
      setCurrentUser(cachedUser);
    }

    if (cachedLogin) {
      setIsLoggedIn(cachedLogin === 'true');
    }
  }, []);

  // Save utility triggers
  const saveTransactions = (updated: Transaction[]) => {
    setTransactions(updated);
    localStorage.setItem('cs_transactions', JSON.stringify(updated));
  };

  const saveCategories = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem('cs_categories', JSON.stringify(updated));
  };

  const handleLogin = (userName: string) => {
    setCurrentUser(userName);
    setIsLoggedIn(true);
    localStorage.setItem('cs_user', userName);
    localStorage.setItem('cs_logged_in', 'true');
    setActiveTab('beranda');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('cs_logged_in', 'false');
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const txCompletes: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };
    const updated = [txCompletes, ...transactions];
    saveTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    saveTransactions(updated);
  };

  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const completes: Category = {
      ...newCat,
      id: `cat-${Date.now()}`
    };
    const updated = [...categories, completes];
    saveCategories(updated);
    triggerToast(`Kategori "${newCat.name}" berhasil ditambahkan!`);
  };

  const handleEditCategory = (updatedCat: Category) => {
    const updated = categories.map((c) => (c.id === updatedCat.id ? updatedCat : c));
    saveCategories(updated);
    triggerToast(`Kategori "${updatedCat.name}" berhasil diubah!`);
  };

  const handleDeleteCategory = (id: string) => {
    const target = categories.find((c) => c.id === id);
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
    if (target) {
      triggerToast(`Kategori "${target.name}" dihapus.`);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      triggerToast('Sinkronisasi spreadsheet berhasil!');
    }, 1200);
  };

  const handleToggleCurrency = () => {
    const nextCur = currency === 'USD' ? 'IDR' : 'USD';
    setCurrency(nextCur);
    localStorage.setItem('cs_currency', nextCur);
    triggerToast(`Ubah tampilan ke ${nextCur === 'USD' ? 'USD ($)' : 'Rupiah (Rp)'}`);
  };

  // If not logged in, render the login box gate directly
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-[#F9F7F2] text-[#1A1A1A] min-h-screen font-sans flex flex-col justify-between selection:bg-[#BC5434]/10">
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#BC5434] text-white px-5 py-3 border border-[#1A1A1A]/20 flex items-center gap-2.5 shadow-md z-50 text-xs font-semibold animate-slideDown">
          <RefreshCw className="animate-spin" size={14} />
          <span className="font-sans uppercase tracking-widest text-[10px]">{toastMessage}</span>
        </div>
      )}

      {/* Top App Sticky Header (from screens 1, 3, 4, 6) */}
      {!showAddTask && (
        <header className="w-full sticky top-0 z-40 bg-[#F9F7F2]/90 backdrop-blur-md border-b border-[#1A1A1A]/10 py-5 px-5 flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#BC5434] text-white flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <div>
              <h1 className="font-display text-base font-serif italic font-bold tracking-tight text-[#1A1A1A] leading-none">
                Jurnal Keuangan
              </h1>
              <p className="font-serif text-[10px] italic text-[#1A1A1A]/60 mt-0.5">
                Keluarga • {currentUser}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Currency toggle */}
            <button
              onClick={handleToggleCurrency}
              className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold border border-[#1A1A1A]/20 hover:bg-[#E5E2D8] text-[#1A1A1A] transition-colors cursor-pointer mr-1"
              title="Ganti mata uang"
            >
              {currency}
            </button>
            <button
              onClick={handleSync}
              className={`p-2 border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#E5E2D8]/50 transition-all cursor-pointer ${
                isSyncing ? 'animate-spin text-[#BC5434] font-bold' : ''
              }`}
              title="Sinkronisasi spreadsheet"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>
      )}

      {/* Main active layout canvases */}
      <main className="flex-grow px-5">
        {showAddTask ? (
          <TambahScreen
            categories={categories}
            currency={currency}
            onAddTransaction={handleAddTransaction}
            onBack={() => setShowAddTask(false)}
          />
        ) : activeTab === 'beranda' ? (
          <BerandaScreen
            onNavigate={(tab) => setActiveTab(tab)}
            transactions={transactions}
            onOpenAddTransaction={() => setShowAddTask(true)}
            currency={currency}
            onSync={handleSync}
            isSyncing={isSyncing}
          />
        ) : activeTab === 'riwayat' ? (
          <RiwayatScreen
            transactions={transactions}
            currency={currency}
            onDeleteTransaction={handleDeleteTransaction}
          />
        ) : activeTab === 'laporan' ? (
          <LaporanScreen
            transactions={transactions}
            categories={categories}
            currency={currency}
          />
        ) : (
          /* activeTab === 'pengaturan' (direct to manage categories config) */
          <KelolaKategoriScreen
            categories={categories}
            transactions={transactions}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onBack={() => setActiveTab('beranda')}
          />
        )}
      </main>

      {/* Floating auxiliary control for Logging out */}
      {!showAddTask && activeTab === 'beranda' && (
        <div className="max-w-md mx-auto px-5 mb-24">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 border border-[#1A1A1A]/20 hover:bg-[#1A1A1A] hover:text-white uppercase tracking-widest text-[#1A1A1A] font-sans text-[10px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={12} />
            Keluar dari Sesi {currentUser}
          </button>
        </div>
      )}

      {/* Persistent Bottom Nav Tab bar switcher with Editorial aesthetic */}
      {!showAddTask && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F9F7F2] border-t border-[#1A1A1A]/10 py-3 px-4 flex justify-around items-center h-20 max-w-md mx-auto rounded-none">
          {/* Beranda Tab */}
          <button
            onClick={() => setActiveTab('beranda')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 cursor-pointer ${
              activeTab === 'beranda'
                ? 'bg-[#1A1A1A] text-white font-bold'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <Home size={18} />
            <span className="font-sans text-[8px] uppercase tracking-wider mt-1 font-bold">Beranda</span>
          </button>

          {/* Riwayat ledger Tab */}
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 cursor-pointer ${
              activeTab === 'riwayat'
                ? 'bg-[#1A1A1A] text-white font-bold'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <Receipt size={18} />
            <span className="font-sans text-[8px] uppercase tracking-wider mt-1 font-bold">Riwayat</span>
          </button>

          {/* Laporan Tab */}
          <button
            onClick={() => setActiveTab('laporan')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 cursor-pointer ${
              activeTab === 'laporan'
                ? 'bg-[#1A1A1A] text-white font-bold'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <BarChart3 size={18} />
            <span className="font-sans text-[8px] uppercase tracking-wider mt-1 font-bold">Laporan</span>
          </button>

          {/* Kelola Kategori "Pengaturan" Tab (Screen 7 title launcher) */}
          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 cursor-pointer ${
              activeTab === 'pengaturan'
                ? 'bg-[#1A1A1A] text-white font-bold'
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <Settings size={18} />
            <span className="font-sans text-[8px] uppercase tracking-wider mt-1 font-bold">Kategori</span>
          </button>
        </nav>
      )}
    </div>
  );
}
