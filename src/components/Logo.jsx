import React from 'react';

const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative">
        <h1 className="text-5xl font-graffiti text-white select-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] uppercase tracking-tighter">
          THE CHEFF
        </h1>
        <div className="absolute -bottom-2 -right-2 bg-xis-neon-pink text-xis-black font-bold px-2 py-0.5 rounded rotate-6 text-xs uppercase tracking-widest">
          Estoque
        </div>
      </div>
      <div className="mt-4 w-32 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  );
};

export default Logo;
