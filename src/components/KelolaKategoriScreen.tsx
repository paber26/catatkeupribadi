/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  HelpCircle,
  FolderLock,
  Plus,
  Save,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Receipt
} from 'lucide-react';
import { Category, Transaction } from '../types';
import CategoryIcon from './CategoryIcon';

interface KelolaKategoriScreenProps {
  categories: Category[];
  transactions: Transaction[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  onBack: () => void;
}

export default function KelolaKategoriScreen({
  categories,
  transactions,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onBack
}: KelolaKategoriScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // New Category states
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newIcon, setNewIcon] = useState('ShoppingBag');

  // Edit Category states
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editIcon, setEditIcon] = useState('');

  // Lucide selectable icons for picker
  const AVAILABLE_ICONS = [
    { name: 'UtensilsCrossed', label: 'Kuliner / Makanan' },
    { name: 'Car', label: 'Transportasi' },
    { name: 'ShoppingBag', label: 'Belanja' },
    { name: 'Film', label: 'Hiburan / Rekreasi' },
    { name: 'Receipt', label: 'Tagihan' },
    { name: 'HeartPulse', label: 'Kesehatan' },
    { name: 'PlusCircle', label: 'Lainnya' }
  ];

  // Search category list
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      return cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [categories, searchQuery]);

  // Transaction count helper
  const getCategoryCount = (catName: string) => {
    return transactions.filter((t) => t.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Masukkan nama kategori.');
      return;
    }

    onAddCategory({
      name: newName.trim(),
      iconName: newIcon,
      colorClass: 'indigo',
      budget: parseFloat(newBudget) || undefined
    });

    // Reset Form
    setNewName('');
    setNewBudget('');
    setShowAddModal(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editName.trim()) return;

    onEditCategory({
      ...editingCat,
      name: editName.trim(),
      budget: parseFloat(editBudget) || undefined,
      iconName: editIcon
    });

    setShowEditModal(false);
    setEditingCat(null);
  };

  return (
    <div className="pb-16 text-[#191b23] max-w-md mx-auto">
      {/* Back Header navigation */}
      <div className="flex items-center gap-3 mb-6 pt-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f3f3fe] hover:bg-[#e7e7f3] active:scale-90 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-display text-lg font-bold text-[#191b23]">Kelola Kategori</span>
      </div>

      {/* Hero Blue Info Card (Screen 7 Header) */}
      <section className="mb-6">
        <div className="bg-[#004ac6] p-5 rounded-2xl text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10 space-y-1 max-w-[280px]">
            <h2 className="font-display text-base font-bold">Atur Pengeluaran Anda</h2>
            <p className="font-sans text-xs text-[#eeefff]/80 leading-relaxed">
              Sesuaikan kategori transaksi untuk laporan keuangan yang lebih akurat dan terperinci.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <FolderLock size={96} />
          </div>
        </div>
      </section>

      {/* Quick Search and Add Section */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kategori..."
            className="w-full bg-[#f3f3fe] border-0 rounded-2xl py-3 pl-10 pr-4 text-xs font-sans text-[#191b23] placeholder-[#737686] focus:ring-2 focus:ring-[#004ac6] focus:bg-white outline-none"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#004ac6] text-white rounded-2xl px-4 py-3 h-[42px] flex items-center gap-2 hover:bg-[#2563eb] active:scale-95 transition-all text-xs font-bold shadow-xs cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Tambah</span>
        </button>
      </div>

      {/* Category listing grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="soft-card-shadow bg-white border border-[#e1e2ed]/50 p-4 rounded-2xl flex items-center justify-between hover:scale-[0.99] transition-transform duration-100"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#f3f3fe] flex items-center justify-center shrink-0">
                <CategoryIcon name={cat.iconName} className="text-[#004ac6]" size={20} />
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold text-[#191b23]">{cat.name}</h3>
                <p className="font-sans text-xs text-[#737686]">
                  {getCategoryCount(cat.name)} Transaksi {cat.budget ? `• Bagian dari Anggaran` : ''}
                </p>
              </div>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setEditingCat(cat);
                  setEditName(cat.name);
                  setEditBudget(cat.budget ? cat.budget.toString() : '');
                  setEditIcon(cat.iconName);
                  setShowEditModal(true);
                }}
                className="w-9 h-9 flex items-center justify-center text-[#737686] hover:text-[#004ac6] hover:bg-[#f3f3fe] rounded-full transition-colors cursor-pointer"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus kategori "${cat.name}"? Ini tidak akan menghapus transaksi yang sudah tercatat.`)) {
                    onDeleteCategory(cat.id);
                  }
                }}
                className="w-9 h-9 flex items-center justify-center text-[#737686] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 bg-white rounded-2xl border border-[#e1e2ed]/30 px-4">
            <p className="font-sans text-xs text-[#737686]">Tidak ada kategori saku yang ditemukan.</p>
          </div>
        )}
      </div>

      {/* Asymmetric analytical bullets (Screen 7 footer text) */}
      <section className="mt-8 space-y-4">
        <div>
          <h2 className="font-display text-base font-bold text-[#191b23] mb-1.5">Analisis Kategori</h2>
          <p className="font-sans text-xs text-[#434655] leading-relaxed">
            Sistem kami membantu mengelompokkan pengeluaran Anda secara otomatis berdasarkan riwayat transaksi. Semakin rapi kategori Anda, semakin akurat wawasan keuangan yang akan Anda terima.
          </p>
        </div>

        <div className="space-y-2 text-xs font-sans text-[#191b23]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-[#006e2d] shrink-0" size={16} />
            <span>Kategori yang diatur dengan baik mengurangi stres keuangan keluarga.</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-[#006e2d] shrink-0" size={16} />
            <span>Monitor budget untuk tiap kategori secara real-time.</span>
          </div>
        </div>

        {/* Financial banner decorative card */}
        <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm border border-[#e1e2ed]/20">
          <img
            alt="Financial planning table"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBgRlwMJUIrjGz_tmsPVqDDjBkWJJBydP7IwIkAQo8c2hfLVQ52wrT25zjhYbGRDeHLqYxQjmj8vZW654K0afQ84FYJSUFdsghVjK1hpI9-TLIGs-B_MKjgpm89RV2ElcoNnQ2dS0Bbh5XTiteHc02Q1RJ_59g250m2peC77juQYAWIZyZHCha-V5pDX7wh_ugXuu8iOm68rvGDIgiaVFz2CSMsXWvDbmvigJnXeyN9UDP0wTQl8Fsvxa8rx8dNQJugdu58tda6Pw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-white/80">Tip Keuangan</p>
            <p className="font-display text-sm font-bold">Tetap Teratur &amp; Hemat Alokasi</p>
          </div>
        </div>
      </section>

      {/* CREATE MODAL DIALOG OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 space-y-4 animate-slideUp shadow-xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#f3f3fe]">
              <h3 className="font-display text-base font-bold text-[#191b23]">Buat Kategori Saku Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#737686] hover:text-[#ba1a1a] text-xs font-bold"
              >
                Batal
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-[#434655]">
              <div className="space-y-1">
                <label className="font-semibold block">Nama Kategori</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Belanja Bulanan, Kuliner, dst..."
                  className="w-full bg-[#f3f3fe] border-0 rounded-xl p-3.5 text-xs text-[#191b23] outline-none focus:ring-2 focus:ring-[#004ac6]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Batas Anggaran Bulanan (Opsional)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="e.g. 1000000"
                  className="w-full bg-[#f3f3fe] border-0 rounded-xl p-3.5 text-xs text-[#191b23] outline-none focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Pilih Gaya Icon Saku</label>
                <div className="grid grid-cols-4 gap-2 pt-1 font-sans text-[10px] text-center text-[#191b23]">
                  {AVAILABLE_ICONS.map((ico) => (
                    <button
                      key={ico.name}
                      type="button"
                      onClick={() => setNewIcon(ico.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                        newIcon === ico.name
                          ? 'border-[#004ac6] bg-[#004ac6]/10 text-[#004ac6]'
                          : 'border-[#e1e2ed] bg-white hover:bg-[#f3f3fe]'
                      }`}
                    >
                      <CategoryIcon name={ico.name} size={18} />
                      <span className="truncate w-full block">{ico.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-display text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Simpan Kategori Baru
            </button>
          </form>
        </div>
      )}

      {/* EDIT MODAL DIALOG OVERLAY */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 space-y-4 animate-slideUp shadow-xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#f3f3fe]">
              <h3 className="font-display text-base font-bold text-[#191b23]">Ubah Kategori Saku</h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCat(null);
                }}
                className="text-[#737686] hover:text-[#ba1a1a] text-xs font-bold"
              >
                Batal
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-[#434655]">
              <div className="space-y-1">
                <label className="font-semibold block">Nama Kategori</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f3f3fe] border-0 rounded-xl p-3.5 text-xs text-[#191b23] outline-none focus:ring-2 focus:ring-[#004ac6]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Batas Anggaran Bulanan (Opsional)</label>
                <input
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  className="w-full bg-[#f3f3fe] border-0 rounded-xl p-3.5 text-xs text-[#191b23] outline-none focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Ubah Gaya Icon</label>
                <div className="grid grid-cols-4 gap-2 pt-1 font-sans text-[10px] text-center text-[#191b23]">
                  {AVAILABLE_ICONS.map((ico) => (
                    <button
                      key={ico.name}
                      type="button"
                      onClick={() => setEditIcon(ico.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                        editIcon === ico.name
                          ? 'border-[#004ac6] bg-[#004ac6]/10 text-[#004ac6]'
                          : 'border-[#e1e2ed] bg-white hover:bg-[#f3f3fe]'
                      }`}
                    >
                      <CategoryIcon name={ico.name} size={18} />
                      <span className="truncate w-full block">{ico.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-xl font-display text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Perbarui Kategori Saku
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
