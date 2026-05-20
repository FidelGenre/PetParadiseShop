'use client';

import BeforeAfterSlider from './BeforeAfterSlider';

interface PainPointSectionProps {
  title?: string;
  subtitle?: string;
  cardTitle?: string;
  bullets?: string[];
  beforeSrc?: string;
  afterSrc?: string;
  showCTA?: boolean;
  ctaHref?: string;
}

export default function PainPointSection({
  title,
  subtitle,
  cardTitle,
  bullets,
  beforeSrc = '/perrobotella.jpg',
  afterSrc = '/perrocalle.jpg',
  showCTA = true,
  ctaHref,
}: PainPointSectionProps) {
  const defaultTitle = <>¿Tu mascota merece <span className="underline decoration-white/40 decoration-4 underline-offset-4">más comodidad</span> en cada paseo?</>;
  const defaultSubtitle = 'Descubrí por qué miles de dueños eligen nuestro kit premium para sus mejores amigos.';
  const defaultCardTitle = 'Los paseos no deberían ser un dolor de cabeza.';
  const defaultBullets = [
    'Tu perro toma agua de charcos o fuentes sucias en el paseo.',
    'Las botellas comunes gotean y te mojan toda la mochila.',
    'En paseos largos se queda sin agua y vuelve deshidratado.',
    'Y lo peor: pasás el paseo preocupado en vez de disfrutarlo.',
  ];

  return (
    <section className="relative bg-red-600 py-20 md:py-28">
      {/* Top wave */}
      <svg
        className="absolute top-0 left-0 w-full h-12 md:h-20 -translate-y-[1px]"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="white"
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
        />
      </svg>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Problema */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            {title ?? defaultTitle}
          </h2>
          <p className="text-white/90 text-base md:text-lg">
            {subtitle ?? defaultSubtitle}
          </p>
        </div>

        {/* Two columns - Problema & Solución */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 items-center mb-16">
          {/* Left: white card with bullets - Solución */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl order-2 md:order-1">
            <div className="inline-block bg-green-100 px-3 py-1 rounded-full mb-4">
              <span className="text-green-800 text-xs font-black uppercase tracking-widest">La Solución</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 leading-tight">
              {cardTitle ?? defaultCardTitle}
            </h3>
            <ul className="space-y-4">
              {(bullets ?? defaultBullets).map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700 text-sm md:text-base leading-relaxed">
                  <svg className="w-6 h-6 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: before/after slider */}
          <div className="order-1 md:order-2">
            <BeforeAfterSlider
              beforeSrc={beforeSrc}
              afterSrc={afterSrc}
              beforeLabel="Antes"
              afterLabel="Después"
              intervalMs={6000}
            />
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 mb-12">
          <div className="text-center mb-6">
            <span className="text-white text-sm font-bold uppercase tracking-widest">Prueba Social</span>
          </div>
          <div className="flex justify-center gap-6 md:gap-12">
            {[
              { stat: '+350', label: 'Clientes satisfechos' },
              { stat: '4.5★', label: 'Calificación promedio' },
              { stat: '100%', label: 'Garantía de satisfacción' },
            ].map((item) => (
              <div key={item.label} className="text-center flex-1">
                <div className="text-2xl md:text-3xl font-black text-white mb-2">{item.stat}</div>
                <p className="text-white/80 text-xs md:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {showCTA && (
          <div className="text-center">
            {ctaHref ? (
              <a
                href={ctaHref}
                className="inline-block bg-white text-red-600 hover:bg-gray-100 font-black py-4 px-8 md:px-12 rounded-2xl text-lg md:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl">
                Obtén tu Kit Premium Ahora
              </a>
            ) : (
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white text-red-600 hover:bg-gray-100 font-black py-4 px-8 md:px-12 rounded-2xl text-lg md:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl">
                Obtén tu Kit Premium Ahora
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-12 md:h-20 translate-y-[1px] rotate-180"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="white"
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
        />
      </svg>
    </section>
  );
}
