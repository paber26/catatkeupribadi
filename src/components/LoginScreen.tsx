/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Wallet, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('alexander@family.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Login Alexander & Istri
      onLogin(email.includes('alexander') ? 'Alexander & Istri' : email);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden relative bg-[#F9F7F2] text-[#1A1A1A] px-6 py-8">
      {/* Editorial Decorative Background Details */}
      <div className="absolute right-0 top-0 text-[180px] font-serif font-light leading-none opacity-[0.03] select-none pointer-events-none tracking-tighter">
        FM.
      </div>
      <div className="absolute left-6 top-1/3 w-32 h-[1px] bg-[#1A1A1A]/10 pointer-events-none"></div>

      {/* Header section with brand identity */}
      <div className="w-full flex flex-col items-center mt-10 text-center z-10">
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] bg-[#BC5434] text-white px-3.5 py-1 font-sans font-semibold">
            JURNAL KELUARGA
          </span>
        </div>
        <h1 className="font-display text-4xl font-serif italic tracking-tighter text-[#1A1A1A] mb-3">
          Catatan Keuangan
        </h1>
        <p className="font-serif text-sm italic text-[#1A1A1A]/70 leading-relaxed max-w-[280px]">
          Kelola kebebasan finansial keluarga Anda dalam satu harmoni yang rapi.
        </p>
      </div>

      {/* Inner card panel body with crisp Editorial layout */}
      <div className="w-full max-w-sm mx-auto bg-[#E5E2D8]/40 border border-[#1A1A1A]/10 p-6 z-10 my-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username Box */}
          <div className="space-y-1">
            <label className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 ml-1" htmlFor="email">
              Email atau Username
            </label>
            <div className="relative flex items-center bg-[#F9F7F2] border border-[#1A1A1A]/20 transition-all duration-200 focus-within:border-[#BC5434] focus-within:shadow-[0_2px_8px_rgba(188,84,52,0.06)]">
              <User className="absolute left-4 text-[#1A1A1A]/60" size={16} />
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 ring-0 focus:ring-0 py-3.5 pl-11 pr-4 font-sans text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/30 outline-none"
                placeholder="nama@email.com"
                required
              />
            </div>
          </div>

          {/* Password Card field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/70" htmlFor="password">
                KATA SANDI
              </label>
              <button
                type="button"
                onClick={() => alert('Fitur pemulihan kata sandi disimulasikan!')}
                className="font-serif text-xs italic text-[#BC5434] hover:underline"
              >
                Lupa?
              </button>
            </div>
            <div className="relative flex items-center bg-[#F9F7F2] border border-[#1A1A1A]/20 transition-all duration-200 focus-within:border-[#BC5434] focus-within:shadow-[0_2px_8px_rgba(188,84,52,0.06)]">
              <Lock className="absolute left-4 text-[#1A1A1A]/60" size={16} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-0 ring-0 focus:ring-0 py-3.5 pl-11 pr-12 font-sans text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/30 outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#1A1A1A]/60 hover:text-[#BC5434] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Sign In Button in Terracotta */}
          <button
            type="submit"
            className="w-full bg-[#BC5434] text-white font-sans text-[11px] uppercase tracking-[0.2em] font-bold py-4 px-4 hover:bg-[#1A1A1A] transition-colors duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            Masuk Jurnal
            <span className="font-bold">→</span>
          </button>
        </form>

        {/* Alternate Social Login Line */}
        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-[#1A1A1A]/10"></div>
          <span className="flex-shrink mx-4 font-serif text-xs italic text-[#1A1A1A]/50">
            atau masuk dengan
          </span>
          <div className="flex-grow border-t border-[#1A1A1A]/10"></div>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onLogin('Alexander & Istri')}
            className="flex items-center justify-center py-3 border border-[#1A1A1A]/20 hover:bg-[#E5E2D8]/50 transition-colors bg-transparent cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj18nvrnfi813099-7Nk0YF1AqyhadQVU_vr9SD66K0HKSP7byrjA3OZoGoHEUjdbLIGrCc04dfNotS-QvE0fBWhxpzZP8IlKlFTdfRWFr2JAK_PYtlsqubOP3wqkHQWVUUREhWm4o2zN09N9FcOLECfHHDt2O0UrBigotA8PsBD5pvJlQWajqPSXdgolAzjXHpfll8DMVLJVF4RgRXvir7XJd53FGit5MZOMlZZqghNBo6tcXSQZasIkqFWJFsSfevNDH3V5PeU4"
              alt="Google"
              className="w-3.5 h-3.5 mr-2"
            />
            <span className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#1A1A1A]">Google</span>
          </button>

          <button
            type="button"
            onClick={() => onLogin('Alexander & Istri')}
            className="flex items-center justify-center py-3 border border-[#1A1A1A]/20 hover:bg-[#E5E2D8]/50 transition-colors bg-transparent cursor-pointer"
          >
            <div className="w-3.5 h-3.5 bg-[#1A1A1A] text-white rounded-sm flex items-center justify-center text-[8px] font-bold mr-2">f</div>
            <span className="font-sans text-[11px] uppercase tracking-wider font-semibold text-[#1A1A1A]">Facebook</span>
          </button>
        </div>
      </div>

      {/* Redirect Footer */}
      <div className="w-full text-center z-10 space-y-5">
        <p className="font-sans text-xs text-[#1A1A1A]/70">
          Belum punya akun keluarga?{' '}
          <button
            type="button"
            onClick={() => onLogin('Keluarga Baru')}
            className="text-[#BC5434] font-bold hover:underline ml-1"
          >
            Daftar Sekarang
          </button>
        </p>

        {/* Trust assurance element in Editorial style */}
        <div className="max-w-xs mx-auto bg-[#E5E2D8] text-[#1A1A1A] p-3 flex items-center gap-3 border border-[#1A1A1A]/10">
          <div className="bg-[#1A1A1A] text-white w-8 h-8 rounded-none flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={16} />
          </div>
          <div className="text-left">
            <p className="font-sans text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]">
              Keamanan Terjamin
            </p>
            <p className="font-serif text-[11px] italic text-[#1A1A1A]/80 leading-tight">
              Enkripsi tingkat bank untuk data keluarga Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
