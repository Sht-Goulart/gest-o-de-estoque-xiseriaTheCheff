import React, { useState } from 'react';
import { LayoutDashboard, Package, History, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
    { id: 'inventory', icon: Package, label: 'Estoque' },
    { id: 'history', icon: History, label: 'Extrato' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-xis-black via-xis-black to-transparent">
      <div className="max-w-md mx-auto flex justify-around items-center glass-card p-2 border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center p-3 transition-all duration-300"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  color: isActive ? '#39ff14' : '#ffffff',
                }}
              >
                <Icon size={24} />
              </motion.div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-xis-neon-green' : 'text-white/60'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
