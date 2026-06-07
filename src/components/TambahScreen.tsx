/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Save,
  CheckCircle,
  FileText,
  DollarSign,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types';

interface TambahScreenProps {
  categories: Category[];
  currency: 'USD' | 'IDR';
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onBack: () => void;
}

export default function TambahScreen({ categories, currency, onAddTransaction, onBack }: TambahScreenProps) {
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0] || {
    id: 'cat-1',
    name: 'Makanan & Minuman',
    iconName: 'UtensilsCrossed',
    colorClass: 'amber'
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Masukkan jumlah uang yang valid.');
      return;
    }

    // Prepare metadata
    const accountType = txType === 'income' ? 'Transfer Bank' : 'Visa'; // realistic default accounts
    const times = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    onAddTransaction({
      type: txType,
      amount: parsedAmount,
      category: selectedCategory.name,
      date,
      time: times,
      description: description.trim() || `${selectedCategory.name} - Pengeluaran`,
      account: accountType
    });

    // Notify success
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onBack(); // auto-return on complete
    }, 1500);
  };

  // Icon selector maps
  const getCatIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed className="text-[#004ac6]" size={20} />;
      case 'Car': return <Car className="text-[#004ac6]" size={20} />;
      case 'ShoppingBag': return <ShoppingBag className="text-[#004ac6]" size={20} />;
      case 'Film': return <Film className="text-[#004ac6]" size={20} />;
      case 'HeartPulse': return <HeartPulse className="text-[#004ac6]" size={20} />;
      case 'Receipt': return <Receipt className="text-[#004ac6]" size={20} />;
      default: return <HelpCircle className="text-[#004ac6]" size={20} />;
    }
  };

  return (
    <div className="pb-16 text-[#191b23] max-w-md mx-auto relative min-h-[80vh]">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#006e2d] text-white px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-lg z-50 animate-bounce">
          <CheckCircle size={20} />
          <span className="font-sans text-xs font-bold">
            Data transaksi berhasil disinkronkan ke Sheets!
          </span>
        </div>
      )}

      {/* Main Back header */}
      <div className="flex items-center gap-3 mb-6 pt-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f3f3fe] hover:bg-[#e7e7f3] active:scale-90 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-display text-lg font-bold text-[#191b23]">Tambah Transaksi</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toggle Slide Switcher: Pengeluaran vs Pemasukan (Screen 5 switch style) */}
        <div className="flex p-1 bg-[#f3f3fe] rounded-full w-full h-14 items-center relative border border-[#e1e2ed]/10">
          <div
            className={`absolute h-12 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 transform`}
            style={{
              transform: txType === 'income' ? 'translateX(calc(100% - 4px))' : 'translateX(4px)'
            }}
          ></div>
          <button
            type="button"
            onClick={() => setTxType('expense')}
            className={`relative z-10 flex-grow h-full flex items-center justify-center font-sans text-xs font-bold transition-colors ${
              txType === 'expense' ? 'text-[#004ac6]' : 'text-[#737686]'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setTxType('income')}
            className={`relative z-10 flex-grow h-full flex items-center justify-center font-sans text-xs font-bold transition-colors ${
              txType === 'income' ? 'text-[#006e2d]' : 'text-[#737686]'
            }`}
          >
            Pemasukan
          </button>
        </div>

        {/* Amount Numerical input (Mock style Screen 5) */}
        <div className="text-center py-6">
          <label className="block font-sans text-[10px] font-bold text-[#737686] uppercase tracking-widest mb-2">
            Jumlah Uang
          </label>
          <div className="relative flex items-center justify-center">
            <span className={`font-display text-2xl font-black mr-2 ${txType === 'income' ? 'text-[#006e2d]' : 'text-[#004ac6]'}`}>
              {currency === 'USD' ? '$' : 'Rp'}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full max-w-[220px] bg-transparent border-b-2 border-transparent focus:border-[#004ac6] text-center font-display text-3xl font-black text-[#191b23] focus:ring-0 outline-none placeholder-[#c3c6d7]"
              required
              step="any"
              min="0.01"
              autoFocus
            />
          </div>
        </div>

        {/* Fields Container block */}
        <div className="space-y-4">
          
          {/* Category Dropdown (Mock Screen 5) */}
          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-bold text-[#434655] px-1">
              Kategori
            </label>
            <div className="relative">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-14 bg-[#f3f3fe] hover:bg-[#e7e7f3] rounded-2xl flex items-center px-4 cursor-pointer border border-transparent focus-within:border-[#004ac6] transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center mr-3 shadow-xs">
                  {getCatIcon(selectedCategory.iconName)}
                </div>
                <span className="flex-grow font-sans text-sm font-semibold text-[#191b23]">
                  {selectedCategory.name}
                </span>
                <ChevronDown className="text-[#737686]" size={18} />
              </div>

              {/* Custom Overlay selects */}
              {isDropdownOpen && (
                <div className="absolute top-15 left-0 w-full bg-white border border-[#e1e2ed] hover:shadow-md rounded-2xl z-50 py-2 max-h-56 overflow-y-auto no-scrollbar animate-fadeIn">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center px-4 py-3 hover:bg-[#f3f3fe] cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#f3f3fe] flex items-center justify-center mr-3">
                        {getCatIcon(cat.iconName)}
                      </div>
                      <span className="font-sans text-xs font-semibold text-[#191b23]">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                  {/* Dynamic Category adding trigger */}
                  <div 
                    onClick={() => {
                      alert('Untuk menambah kategori baru, gunakan tab Kelola Kategori di pengaturan!');
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-3 hover:bg-[#ededf9] text-[#004ac6] border-t border-[#f3f3fe] cursor-pointer italic font-sans text-xs font-medium"
                  >
                    + Buat Kategori Baru
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date Picker Input */}
          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-bold text-[#434655] px-1">
              Tanggal Transaksi
            </label>
            <div className="relative flex items-center bg-[#f3f3fe] rounded-2xl">
              <Calendar className="absolute left-4 text-[#737686]" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-0 ring-0 focus:ring-0 py-4 pl-12 pr-4 font-sans text-sm text-[#191b23] outline-none cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Comments Description Card */}
          <div className="space-y-1.5">
            <label className="block font-sans text-xs font-bold text-[#434655] px-1">
              Catatan / Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Belanja Bulanan Supermarket atau Gaji Tambahan..."
              className="w-full bg-[#f3f3fe] focus:bg-white border-0 rounded-2xl px-4 py-3.5 font-sans text-sm text-[#191b23] focus:ring-2 focus:ring-[#004ac6] outline-none placeholder-[#737686]"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* Sync Sheet Promo Card Overlay (Screen 5 promo banner) */}
        <div className="rounded-2xl border border-[#e1e2ed] bg-white p-4 flex gap-4 items-center soft-card-shadow">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#e1e2ed] shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSlBTOGCsb-6k8UNPxRrMCgWE_u7jVN60w9lytrFHXs8dsGTUsv33U5joIkK9WpD0-gjfwCf499zEuns0rTRfV-Cvm9wOA0iKX5givmZKjgZP00XW5wojCpp7TcLeSGBG4oXEpApyOgLQPZJeQMvp2KKioxtNVXsXZZ1LH80tZGnLooL9q7cIjFJyylXijVnSI7MZi0MvU5049kkrOCyFZtAkjTOb0S1CmixFE0D5FW6pzfncgZn6zq3PKXG-72nHsFojqYZGHNJk"
              alt="Workspace sheet mockup"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-display font-bold text-[#004ac6] text-xs">
              Sinkron dengan Sheets
            </h4>
            <p className="font-sans text-[10px] text-[#737686] mt-0.5 leading-relaxed">
              Transaksi keluarga Anda akan langsung disimpan &amp; diperbarui di spreadsheet utama secara aman.
            </p>
          </div>
        </div>

        {/* Primary Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full h-14 bg-[#004ac6] text-white font-display text-base font-bold rounded-2xl flex items-center justify-center gap-3 shadow-md hover:bg-[#2563eb] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save size={20} />
            Simpan ke Spreadsheet
          </button>
        </div>
      </form>
    </div>
  );
}
