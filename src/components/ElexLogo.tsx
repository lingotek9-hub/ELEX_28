import React from 'react';

interface ElexLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const ElexLogo: React.FC<ElexLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const badgeSizes = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9 text-xs',
    md: 'w-10 h-10 sm:w-12 sm:h-12 text-sm',
    lg: 'w-13 h-13 sm:w-16 sm:h-16 text-base',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subSizes = {
    sm: 'text-[8.5px] sm:text-[9.5px]',
    md: 'text-[9.5px] sm:text-xs',
    lg: 'text-xs sm:text-sm',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Programmatic High-Tech IC Chip Emblem (100% Code-based, zero distorted paths) */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Circuit Ambient Backlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f38035] via-[#ff9d5c] to-[#67B8DE] rounded-2xl blur-[7px] opacity-40"></div>

        {/* Microprocessor / Silicon Chip Body */}
        <div
          className={`${badgeSizes[size]} relative rounded-2xl bg-gradient-to-br from-[#0c1422] via-[#070b12] to-[#111a2d] border-2 border-[#f38035]/80 flex flex-col items-center justify-center shadow-lg shadow-[#f38035]/25`}
        >
          {/* Top Integrated Circuit Contact Pins */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-1 h-1 rounded-full bg-[#f38035] shadow-[0_0_4px_#f38035]"></span>
            <span className="w-1 h-1 rounded-full bg-[#67B8DE] shadow-[0_0_4px_#67B8DE]"></span>
            <span className="w-1 h-1 rounded-full bg-[#f38035] shadow-[0_0_4px_#f38035]"></span>
          </div>

          {/* Bottom Integrated Circuit Contact Pins */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-1 h-1 rounded-full bg-[#67B8DE] shadow-[0_0_4px_#67B8DE]"></span>
            <span className="w-1 h-1 rounded-full bg-[#f38035] shadow-[0_0_4px_#f38035]"></span>
            <span className="w-1 h-1 rounded-full bg-[#67B8DE] shadow-[0_0_4px_#67B8DE]"></span>
          </div>

          {/* Central E28 Monogram */}
          <div className="flex items-center justify-center leading-none font-mono font-black tracking-tight select-none">
            <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              E
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff9d5c] via-[#f38035] to-[#ea580c] drop-shadow-[0_1px_4px_rgba(243,128,53,0.5)]">
              28
            </span>
          </div>

          {/* Active Logic Status Micro-LED */}
          <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#67B8DE] animate-pulse shadow-[0_0_4px_#67B8DE]"></div>
        </div>
      </div>

      {/* Programmatic Typography Hierarchy */}
      <div className="flex flex-col justify-center leading-tight text-right">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`font-mono font-black tracking-wider text-white ${titleSizes[size]} uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]`}>
            ELEX <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#f38035]">28</span>
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`${subSizes[size]} font-mono font-bold tracking-[0.2em] sm:tracking-[0.24em] text-[#67B8DE] uppercase drop-shadow-[0_0_6px_rgba(103,184,222,0.3)]`}>
              ELECTRONIC ENGINEERING
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
