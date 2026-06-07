/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  BrainCircuit,
  MessageSquare,
  Check
} from 'lucide-react';
import { Transaction, Category } from '../types';
import CategoryIcon from './CategoryIcon';

interface LaporanScreenProps {
  transactions: Transaction[];
  categories: Category[];
  currency: 'USD' | 'IDR';
}

export default function LaporanScreen({ transactions, categories, currency }: LaporanScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState('Maret 2024');
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');

  const formatValue = (val: number) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(val);
    } else {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(val * 1000); // Scaled for realistic IDR values
    }
  };

  // List of mockup months
  const months = ['Januari 2024', 'Februari 2024', 'Maret 2024', 'April 2024', 'Mei 2024'];

  // Categorize spending metrics
  const categoryStats = categories.map((cat) => {
    // Sum matching expenses
    const spent = transactions
      .filter((tx) => tx.type === 'expense' && tx.category.toLowerCase() === cat.name.toLowerCase())
      .reduce((sum, tx) => sum + tx.amount, 0);

    const actualLimit = currency === 'USD' ? (cat.budget || 3000) / 1000 : cat.budget || 3000000;
    const actualSpent = currency === 'USD' ? spent / 1000 : spent;

    const percentage = actualLimit > 0 ? Math.round((actualSpent / actualLimit) * 100) : 0;
    const isOverBudget = actualSpent > actualLimit;

    return {
      ...cat,
      spent: actualSpent,
      limit: actualLimit,
      percentage,
      isOverBudget,
      transactionCount: transactions.filter(
        (tx) => tx.type === 'expense' && tx.category.toLowerCase() === cat.name.toLowerCase()
      ).length
    };
  });

  // Calculate global budget stats
  const totalBudgetLimit = categoryStats.reduce((sum, item) => sum + item.limit, 0);
  const totalBudgetSpent = categoryStats.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudgetLimit - totalBudgetSpent;
  const globalPercentage = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  // Pie chart breakdown percentages
  const esensialPercent = 45;
  const gayaHidupPercent = 25;
  const tabunganPercent = 15;
  const lainnyaPercent = 15;

  const triggerAIAssistant = () => {
    setIsAIThinking(true);
    setShowAIModal(true);
    setAiResponse('');

    // Generate smart response based on actual data!
    setTimeout(() => {
      const overBudgetCats = categoryStats.filter((c) => c.isOverBudget);
      let analysisText = `## 🔮 Prediksi Keuangan & Analisis Pintar AI

Halo Alexander & Istri! Berikut analisis data pengeluaran real-time Anda untuk bulan ini:

### 📊 Ringkasan Kesehatan Finansial
*   **Efisiensi Anggaran:** Penggunaan anggaran Anda berada di angka **${globalPercentage}%** dari total batas bulanan.
*   **Prediksi Sisa Tabungan:** Anda diproyeksikan dapat menyisihkan tambahan **${formatValue(totalRemaining > 0 ? totalRemaining : 240)}** bulan ini jika pola belanja dipertahankan.
`;

      if (overBudgetCats.length > 0) {
        analysisText += `\n### ⚠️ Kategori Melebihi Anggaran:
`;
        overBudgetCats.forEach((c) => {
          analysisText += `*   **${c.name}:** Anda telah menghabiskan sebanyak **${formatValue(c.spent)}** dari batas **${formatValue(c.limit)}** (Over budget **${c.percentage}%**). Hal ini dipicu oleh aktivitas transaksi di sektor ini.`;
        });
        analysisText += `\n\n### 💡 Rekomendasi Penghematan Langsung:
1.  **Batasi Kategori ${overBudgetCats[0].name}:** Penyelenggaraan aktivitas di kategori ini melampaui alokasi target. Pertimbangkan untuk menunda pembelian non-esensial hingga bulan depan.
2.  **Manfaatkan Dompet Bersama:** Lakukan verifikasi ganda bersama pasangan untuk setiap pengeluaran di atas **Rp 200.000 / $20** guna mengontrol kebocoran anggaran halus.`;
      } else {
        analysisText += `\n\n### 🎉 Selamat!
Seluruh kategori pengeluaran keluarga berada dalam batas aman hijau. Anda berdua menunjukkan koordinasi finansial yang sangat kuat.
\n### 💡 Saran Investasi Pertumbuhan:
Alokasikan surplus anggaran sebesar **${formatValue(totalRemaining * 0.5)}** ke instrumen reksa dana pasar uang atau deposito jangka pendek untuk mengoptimalkan pertumbuhan modal keluarga (+2.1% tahunan).`;
      }

      analysisText += `\n\n*Rekomendasi dihitung otomatis berdasarkan analitik sisa saldo keluarga Anda.*`;
      
      setAiResponse(analysisText);
      setIsAIThinking(false);
    }, 1500);
  };

  return (
    <div className="pb-16 text-[#191b23] max-w-md mx-auto">
      {/* Month Selector Carousel (Screen 4 Layout) */}
      <section className="flex items-center justify-between my-5">
        <button
          onClick={() => {
            const index = months.indexOf(selectedMonth);
            if (index > 0) setSelectedMonth(months[index - 1]);
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f3f3fe] hover:bg-[#e7e7f3] transition-colors active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-display text-lg font-bold text-[#191b23]">{selectedMonth}</h2>
          <p className="font-sans text-xs text-[#737686]">Ikhtisar Bulanan Keluarga</p>
        </div>
        <button
          onClick={() => {
            const index = months.indexOf(selectedMonth);
            if (index < months.length - 1) setSelectedMonth(months[index + 1]);
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f3f3fe] hover:bg-[#e7e7f3] transition-colors active:scale-90"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Sisa Anggaran Hero Overview Card (Screen 4 Banner) */}
      <section className="bg-white soft-card-shadow rounded-2xl p-5 border border-[#e1e2ed]/40 mb-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
          <BrainCircuit size={84} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="font-sans text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-1">
                ANGGARAN BULANAN
              </p>
              <h3 className="font-display text-2xl font-extrabold text-[#004ac6]">
                {formatValue(totalBudgetLimit || 12000)}
              </h3>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs text-[#737686]">Sisa Anggaran</p>
              <p className="font-sans text-sm font-bold text-[#006e2d]">
                {formatValue(totalRemaining > 0 ? totalRemaining : 1120.45)}
              </p>
            </div>
          </div>

          {/* Budget progress utility bar */}
          <div className="w-full h-2.5 bg-[#ededf9] rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500`}
              style={{
                width: `${Math.min(globalPercentage || 74, 100)}%`,
                backgroundColor: globalPercentage > 90 ? '#ba1a1a' : '#2563eb'
              }}
            ></div>
          </div>

          <div className="flex justify-between font-sans text-xs text-[#737686]">
            <span>{globalPercentage || 74}% terpakai</span>
            <span>{formatValue(totalBudgetSpent || 8450)} dibelanjakan</span>
          </div>
        </div>
      </section>

      {/* Spending Breakdown Pie chart simulation */}
      <section className="bg-white soft-card-shadow rounded-2xl p-5 border border-[#e1e2ed]/40 mb-6">
        <h4 className="font-display text-base font-bold text-[#191b23] mb-4">
          Rincian Alokasi Dana
        </h4>
        <div className="flex items-center justify-center p-3 relative">
          {/* Custom vector concentric circle representing the categories */}
          <div
            className="w-44 h-44 rounded-full flex items-center justify-center relative shadow-sm"
            style={{
              background: 'conic-gradient(#004ac6 0% 45%, #bc4800 45% 70%, #006e2d 70% 85%, #d9d9e5 85% 100%)'
            }}
          >
            {/* Center cutout */}
            <div className="absolute w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
              <span className="font-sans text-[10px] text-[#737686] uppercase tracking-wider">Total</span>
              <span className="font-display text-xl font-extrabold text-[#004ac6]">
                {formatValue(totalBudgetSpent || 3100)}
              </span>
            </div>
          </div>
        </div>

        {/* Legend grid detail items */}
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-sans text-[#434655]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#004ac6]"></div>
            <span>Esensial ({esensialPercent}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#bc4800]"></div>
            <span>Gaya Hidup ({gayaHidupPercent}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#006e2d]"></div>
            <span>Tabungan ({tabunganPercent}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#d9d9e5]"></div>
            <span>Lainnya ({lainnyaPercent}%)</span>
          </div>
        </div>
      </section>

      {/* Category progression stats lists */}
      <section className="bg-white soft-card-shadow rounded-2xl p-5 border border-[#e1e2ed]/40 mb-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#f3f3fe]">
          <h4 className="font-display text-base font-bold text-[#191b23]">
            Kategori Pengeluaran
          </h4>
          <span className="font-sans text-xs text-[#004ac6] font-semibold">Batas Angg.</span>
        </div>

        <div className="space-y-4">
          {categoryStats.map((item) => (
            <div key={item.id} className="space-y-1.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#f3f3fe]`}>
                    <CategoryIcon name={item.iconName} className="text-[#004ac6]" size={20} />
                  </div>
                  <div>
                    <h5 className="font-sans text-sm font-semibold text-[#191b23]">{item.name}</h5>
                    <p className="font-sans text-[11px] text-[#737686]">
                      {item.transactionCount || 0} Transaksi
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <p className={`font-sans font-bold ${item.isOverBudget ? 'text-[#ba1a1a]' : 'text-[#191b23]'}`}>
                    {formatValue(item.spent)}
                  </p>
                  <p className="font-sans text-[#737686] text-[10px]">dari {formatValue(item.limit)}</p>
                </div>
              </div>

              {/* Progress bar track indicator */}
              <div className="w-full h-2 bg-[#ededf9] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300`}
                  style={{
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: item.isOverBudget ? '#ba1a1a' : '#2563eb'
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-sans">
                <span className={item.isOverBudget ? 'text-[#ba1a1a] font-bold' : 'text-[#737686]'}>
                  {item.isOverBudget ? `Over budget (${item.percentage}%)` : `${item.percentage}% digunakan`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Quick Insights component with visual icon */}
      <section className="bg-[#ededf9]/50 border border-[#e1e2ed]/30 p-5 rounded-2xl mb-6 space-y-3">
        <h4 className="font-display text-sm font-extrabold text-[#004ac6]">
          Wawasan Keuangan Terbaru
        </h4>
        <div className="flex gap-3">
          <div className="p-2 bg-[#dbe1ff] rounded-full text-[#004ac6] shrink-0 h-9 w-9 flex items-center justify-center">
            <Lightbulb size={18} />
          </div>
          <div className="text-xs font-sans text-[#434655] leading-relaxed space-y-2">
            <p>
              Anda menghabiskan <span className="font-bold text-[#006e2d]">15% lebih sedikit</span> untuk{' '}
              <span className="font-bold">Transportasi</span> minggu ini dibanding minggu lalu. Selamat atas kontribusinya!
            </p>
            <button
              onClick={() => alert('Wawasan ini diukur berdasarkan tren mingguan di spreadsheet.')}
              className="font-semibold text-[#004ac6] hover:underline"
            >
              Lihat Analisis Detail
            </button>
          </div>
        </div>
      </section>

      {/* AI Advisory Call to Action banner overlay */}
      <section className="relative rounded-2xl overflow-hidden shadow-md h-36 flex items-center px-6 border border-[#c3c6d7]/15">
        <div className="absolute inset-0 z-0">
          <img
            alt="Financial Advisory"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCieY3tAhrc8xS6fBCAs0BvrgqqEQ4tRpjBhOW5urCLIHpHVUTOgG8eJZGg7dXvtJ0xghzesh1O0wma0SbzsnWBRkCMD-Bi1MxeOIIBwrn3fh-x4E89DvJeQtTU3cGowTkvoyWuXEkWuIxWZBKYqL1UZnToFyZ7pXeZQHPrkn0soYQMwYqpKfwydAEeAygAVmUYTDo4-CfKKKH3NCTplxtW-yqISDljvqYx3SXUguo2ClEuFq3EgGdBR-iVvPjJoE_qgJUdTia8dfQ"
          />
          <div className="absolute inset-0 bg-[#004ac6]/85 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#004ac6] to-transparent"></div>
        </div>
        <div className="relative z-10 text-white shrink-0">
          <h4 className="font-display text-[#7ffc97] font-bold text-base flex items-center gap-2">
            <Sparkles size={16} /> Prediksi Pintar AI
          </h4>
          <p className="font-sans text-[11px] text-[#eeefff]/90 max-w-[210px] mt-1 line-clamp-2">
            Hemat hingga tambahan {formatValue(240)} bulan ini dengan strategi saku keluarga pintar.
          </p>
          <button
            onClick={triggerAIAssistant}
            className="mt-3 px-4 py-1.5 bg-white text-[#004ac6] hover:bg-[#eeefff] active:scale-[0.98] rounded-full font-sans text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Dapatkan Saran
          </button>
        </div>
      </section>

      {/* AI Advice Dialog Overlay Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-xl border border-[#e1e2ed]">
            <div className="flex justify-between items-center pb-2 border-b border-[#f3f3fe]">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-[#004ac6]" size={22} />
                <h3 className="font-display text-base font-bold text-[#191b23]">
                  Asisten AI Keuangan Keluarga
                </h3>
              </div>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-[#737686] hover:text-[#ba1a1a]"
              >
                Tutup
              </button>
            </div>

            {isAIThinking ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-[#004ac6] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-sans text-xs text-[#737686] animate-pulse">
                  Menganalisis pengeluaran &amp; menghitung sisa tabungan rutin...
                </p>
              </div>
            ) : (
              <div className="font-sans text-xs text-[#434655] leading-relaxed space-y-3 prose">
                {/* Parse manual markdown linebreaks */}
                {aiResponse.split('\n').map((line, index) => {
                  if (line.startsWith('## ')) {
                    return <h3 key={index} className="font-display text-sm font-extrabold text-[#004ac6] mt-3">{line.replace('## ', '')}</h3>;
                  }
                  if (line.startsWith('### ')) {
                    return <h4 key={index} className="font-display text-xs font-bold text-[#191b23] mt-2">{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('* ')) {
                    return <li key={index} className="ml-4 list-disc">{line.replace('* ', '')}</li>;
                  }
                  if (line.match(/^\d+\./)) {
                    return <p key={index} className="ml-2 pl-2 border-l border-[#004ac6]/30 my-1">{line}</p>;
                  }
                  return <p key={index}>{line}</p>;
                })}

                <button
                  onClick={() => setShowAIModal(false)}
                  className="w-full py-3 bg-[#004ac6] text-white rounded-xl font-semibold mt-4 hover:bg-[#2563eb]"
                >
                  Dimengerti, Terima Kasih!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
