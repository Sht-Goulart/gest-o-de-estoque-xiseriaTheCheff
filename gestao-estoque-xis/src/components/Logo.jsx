import React from 'react';

const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative">
        <h1 className="text-6xl font-graffiti text-white select-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          XISERIA
        </h1>
        <div className="absolute -bottom-2 -right-4 bg-xis-neon-pink text-xis-black font-bold px-2 py-0.5 rounded rotate-12 text-sm">
          ESTOQUE
        </div>
      </div>
      <div className="mt-2 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
    </div>
  );
};

export default Logo;
