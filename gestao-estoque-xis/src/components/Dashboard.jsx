import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProducts, getHistory } from '../services/db';

const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    monthEntries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const products = await getProducts();
      const history = await getHistory();

      const lowStock = products.filter(p => p.quantidade <= p.estoque_minimo).length;

      // Calcular valor de entradas do mês atual (simplificado)
      const monthEntries = history
        .filter(h => h.tipo === 'entrada')
        .reduce((acc, curr) => acc + (curr.valor_total || 0), 0);

      setStats({
        totalItems: products.length,
        lowStock,
        monthEntries
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'TOTAL DE INSUMOS',
      value: stats.totalItems,
      icon: Package,
      color: 'text-xis-neon-blue',
      tab: 'inventory'
    },
    {
      label: 'ESTOQUE BAIXO',
      value: stats.lowStock,
      icon: AlertCircle,
      color: stats.lowStock > 0 ? 'text-xis-neon-yellow' : 'text-white/20',
      tab: 'inventory'
    },
    {
      label: 'TOTAL COMPRAS',
      value: `R$ ${stats.monthEntries.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-xis-neon-green',
      tab: 'history'
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <header className="py-4">
        <p className="text-white/40 font-bold text-sm tracking-widest uppercase">Bem-vindo à</p>
        <h2 className="text-4xl font-graffiti text-white">XISERIA GESTÃO</h2>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTab(card.tab)}
              className="glass-card p-6 flex items-center justify-between active:scale-95 transition-transform"
            >
              <div>
                <p className="text-white/40 text-[10px] font-black tracking-widest uppercase mb-1">{card.label}</p>
                <p className={`text-3xl font-black ${card.color}`}>{loading ? '...' : card.value}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-white/5 ${card.color}`}>
                <Icon size={32} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-graffiti mb-4">AÇÕES RÁPIDAS</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className="aspect-square glass-card flex flex-col items-center justify-center gap-3 border-xis-neon-green/30 hover:bg-xis-neon-green/10 transition-colors"
          >
            <PlusCircle size={40} className="text-xis-neon-green" />
            <span className="font-bold text-xs uppercase tracking-tighter text-center px-2">Adicionar Insumo</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className="aspect-square glass-card flex flex-col items-center justify-center gap-3 border-xis-neon-blue/30 hover:bg-xis-neon-blue/10 transition-colors"
          >
            <History size={40} className="text-xis-neon-blue" />
            <span className="font-bold text-xs uppercase tracking-tighter text-center px-2">Ver Extrato</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Re-using History for the plus circle import
import { PlusCircle, History } from 'lucide-react';

export default Dashboard;
