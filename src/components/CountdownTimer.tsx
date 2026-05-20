'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'pp_offer_expires_at';

function getOrCreateExpiry(): number {
  if (typeof window === 'undefined') return Date.now();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const expiry = parseInt(stored, 10);
    // Si ya expiró, creá uno nuevo
    if (expiry > Date.now()) return expiry;
  }
  // Random entre 4 y 12 horas desde ahora
  const hours = Math.floor(Math.random() * 8) + 4;
  const expiry = Date.now() + hours * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, String(expiry));
  return expiry;
}

function getRemaining(expiry: number) {
  const diff = Math.max(0, expiry - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function CountdownTimer() {
  const expiryRef = useRef<number>(0);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    expiryRef.current = getOrCreateExpiry();
    setTime(getRemaining(expiryRef.current));
    setMounted(true);

    const interval = setInterval(() => {
      const remaining = getRemaining(expiryRef.current);
      // Si expiró, generá uno nuevo
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        const hours = Math.floor(Math.random() * 8) + 4;
        expiryRef.current = Date.now() + hours * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, String(expiryRef.current));
      }
      setTime(getRemaining(expiryRef.current));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Evita hydration mismatch
  if (!mounted) return null;

  return (
    <div>
      <div className="bg-red-600 rounded-2xl px-6 py-5 mt-2" id="countdown-timer">
        <p className="text-white text-xs font-bold text-center uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-bounce">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
          </svg>
          ¡Esta oferta vence en!
        </p>

        <div className="flex items-center justify-center gap-3">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 min-w-[64px] text-center">
              <span className="text-white text-3xl font-black tabular-nums">{pad(time.hours)}</span>
            </div>
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1.5">Horas</span>
          </div>

          <span className="text-white text-3xl font-black mb-4">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 min-w-[64px] text-center">
              <span className="text-white text-3xl font-black tabular-nums">{pad(time.minutes)}</span>
            </div>
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1.5">Minutos</span>
          </div>

          <span className="text-white text-3xl font-black mb-4">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 min-w-[64px] text-center">
              <span className="text-white text-3xl font-black tabular-nums">{pad(time.seconds)}</span>
            </div>
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1.5">Segundos</span>
          </div>
        </div>

        <p className="text-white/80 text-xs text-center mt-4">
          🔥 El precio vuelve a su valor original cuando termine el contador
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {/* Stock Alert */}
        <div className="text-center flex items-center justify-center gap-2">
          <span className="text-red-600 text-lg font-black animate-blink-pulse">●</span>
          <span className="text-gray-900 text-sm font-bold">Quedan pocas unidades - Pedi <span className="text-red-600">Ahora</span></span>
        </div>

        {/* Shipping & Promo Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h14m-14 4v10m0-10L10.5 9m0 0L16 3.5m-5.5 5.5V1.5"/>
            </svg>
            <span className="text-white text-xs font-bold">Envío hoy</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 1015.5 17H5.5z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-xs font-bold">Promo activa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
