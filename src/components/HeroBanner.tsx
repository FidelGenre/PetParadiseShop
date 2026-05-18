'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = 2;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, []);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 4000);
  }, [next]);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next(); else prev();
      resetInterval();
    }
    touchStartX.current = null;
  };

  const goTo = (index: number) => {
    setCurrent(index);
    resetInterval();
  };

  return (
    <section
      className="relative overflow-hidden"
      id="hero-banner"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Slide 2 define la altura del contenedor (con su padding natural) ── */}
      {/* Esta es la capa que da el tamaño al section */}
      <div className="invisible" aria-hidden="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="text-white space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">Pet Paradise</h1>
              <p className="text-2xl md:text-3xl font-bold mt-1 uppercase">Shop</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-bold italic">TODO LO QUE TU MASCOTA NECESITA</h2>
              <p className="text-sm md:text-base italic max-w-md leading-relaxed">Encontrá productos de calidad y ofertas increíbles para hacer la vida de tu mejor amigo mas feliz!</p>
            </div>
            <div><div className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm">Ver Tienda →</div></div>
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">342-477-0030</div>
          </div>
        </div>
      </div>

      {/* ── Slide 1: bannerbotella.png ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${current === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      >
        <Link href="/producto/kit-premium-de-paseo-para-perros" className="block w-full h-full cursor-pointer">
          {/* Mobile */}
          <Image
            src="/responsivebanner.png"
            alt="Kit Premium de Paseo para Perros"
            fill
            priority
            className="object-cover object-center sm:hidden"
            sizes="100vw"
          />
          {/* Desktop */}
          <Image
            src="/bannerbotella.png"
            alt="Kit Premium de Paseo para Perros"
            fill
            priority
            className="object-cover object-center hidden sm:block"
            sizes="100vw"
          />
        </Link>
      </div>

      {/* ── Slide 2: fondopagina1.png con textos ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${current === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      >
        <Image
          src="/fondopagina1.png"
          alt="Pet Paradise Shop - Todo lo que tu mascota necesita"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 flex items-center">
          <div className="text-white space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none drop-shadow-lg">
                Pet Paradise
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-red-200 mt-1 uppercase drop-shadow-md">
                Shop
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-bold italic drop-shadow-md">
                TODO LO QUE TU MASCOTA NECESITA
              </h2>
              <p className="text-sm md:text-base text-white/90 italic max-w-md leading-relaxed drop-shadow-sm">
                Encontrá productos de calidad y ofertas increíbles para hacer
                la vida de tu mejor amigo mas feliz!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-3 rounded-full font-bold text-sm hover:bg-red-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                id="hero-cta-button"
              >
                Ver Tienda →
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <span className="font-medium">342-477-0030</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-[1px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 30L48 25C96 20 192 10 288 8.3C384 6.7 480 13.3 576 20C672 26.7 768 33.3 864 35C960 36.7 1056 33.3 1152 28.3C1248 23.3 1344 16.7 1392 13.3L1440 10V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0V30Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
