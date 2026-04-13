import React, { useState } from 'react';
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import History from './components/History';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'inventory':
        return <Inventory />;
      case 'history':
        return <History />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-20">
      <Logo />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
