'use client';

import { useState } from 'react';
import HeroBanner from './HeroBanner';
import BotellaPortatil from './BotellaPortatil';

export default function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <HeroBanner onSlideChange={setCurrentSlide} />
      <div
        className={`grid transition-all duration-500 ease-in-out relative z-30 pointer-events-none ${
          currentSlide === 0
            ? 'grid-rows-[1fr] opacity-100 -mt-16 md:-mt-24'
            : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <BotellaPortatil />
        </div>
      </div>
    </>
  );
}
