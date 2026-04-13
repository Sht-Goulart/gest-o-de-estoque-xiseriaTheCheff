import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getHistory } from '../services/db';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '...';
    const date = timestamp.toDate();
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="pb-24 px-4 pt-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-graffiti italic">EXTRATO</h2>
        <p className="text-white/40 text-xs uppercase font-bold tracking-widest mt-1">Movimentações de Insumos</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10 text-white/40">Carregando histórico...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 text-white/40">Nenhuma movimentação registrada.</div>
        ) : (
          <div className="relative border-l-2 border-white/5 ml-3 pl-6 space-y-8">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-xis-black ${item.tipo === 'entrada' ? 'bg-xis-neon-blue' : 'bg-xis-neon-pink'}`} />

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/30 uppercase mb-2 flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(item.data)}
                  </span>

                  <div className="glass-card p-4 border-white/5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.tipo === 'entrada' ? 'bg-xis-neon-blue/10 text-xis-neon-blue' : 'bg-xis-neon-pink/10 text-xis-neon-pink'}`}>
                          {item.tipo === 'entrada' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm uppercase leading-none">{item.nome_produto}</h4>
                          <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tight">
                            {item.tipo === 'entrada' ? 'Compra de Insumo' : 'Baixa de Estoque'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-black ${item.tipo === 'entrada' ? 'text-xis-neon-blue' : 'text-xis-neon-pink'}`}>
                          {item.tipo === 'entrada' ? '+' : '-'}{item.quantidade} <span className="text-[10px] font-normal opacity-50">{item.unidade}</span>
                        </div>
                        {item.tipo === 'entrada' && (
                          <div className="text-[10px] font-bold text-xis-neon-green mt-0.5">
                            R$ {item.valor_total?.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
