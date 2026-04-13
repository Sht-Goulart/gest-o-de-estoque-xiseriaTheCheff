import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, ArrowUpCircle, ArrowDownCircle, Trash2, Pencil, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, registerMovement, addProduct, deleteProduct, updateProduct } from '../services/db';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movementType, setMovementType] = useState('entrada');

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = filterLowStock ? p.quantidade <= p.estoque_minimo : true;
    return matchesSearch && matchesLowStock;
  });

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const productData = {
        nome: formData.get('nome'),
        quantidade: Number(formData.get('quantidade')),
        unidade: formData.get('unidade'),
        preco_unitario: Number(formData.get('preco_unitario')),
        estoque_minimo: Number(formData.get('estoque_minimo')),
      };

      if (modalMode === 'add') {
        await addProduct(productData);
      } else {
        await updateProduct(selectedProduct.id, productData);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert(`Erro ao salvar no Firebase: ${error.message}. Verifique se o Firestore está ativado e as regras permitem gravação.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMovement = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const qtd = Number(formData.get('quantidade'));
    const movement = {
      produto_id: selectedProduct.id,
      nome_produto: selectedProduct.nome,
      quantidade: qtd,
      tipo: movementType,
      valor_total: movementType === 'entrada' ? qtd * selectedProduct.preco_unitario : 0,
      unidade: selectedProduct.unidade
    };
    await registerMovement(movement);
    setIsMovementModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Tem certeza que deseja excluir "${product.nome}"? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteProduct(product.id);
        fetchProducts();
      } catch (error) {
        alert("Erro ao excluir produto: " + error.message);
      }
    }
  };

  return (
    <div className="pb-24 px-4 pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-graffiti italic">ESTOQUE ATUAL</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-xis-neon-green text-xis-black p-2 rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)] active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Buscar insumo..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-xis-neon-blue transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`p-3 rounded-xl border transition-colors flex items-center gap-2 ${filterLowStock ? 'bg-xis-neon-yellow/20 border-xis-neon-yellow text-xis-neon-yellow' : 'bg-white/5 border-white/10 text-white/40'}`}
        >
          <AlertTriangle size={20} />
          {filterLowStock && <span className="text-xs font-bold">BAIXO</span>}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-white/40">Carregando...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-white/40">Nenhum item encontrado.</div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product.id}
              className={`glass-card p-4 relative overflow-hidden ${product.quantidade <= product.estoque_minimo ? 'border-xis-neon-yellow/50' : 'border-white/10'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold uppercase tracking-tight">{product.nome}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setModalMode('edit');
                          setIsModalOpen(true);
                        }}
                        className="text-white/20 hover:text-xis-neon-blue p-1 transition-colors"
                        title="Editar Item"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-white/20 hover:text-xis-neon-pink p-1 transition-colors"
                        title="Excluir Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs">Custo Unit: R$ {product.preco_unitario.toFixed(2)} / {product.unidade}</p>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-black ${product.quantidade <= product.estoque_minimo ? 'text-xis-neon-yellow' : 'text-xis-neon-green'}`}>
                    {product.quantidade} <span className="text-sm font-normal opacity-70">{product.unidade}</span>
                  </div>
                  {product.quantidade <= product.estoque_minimo && (
                    <div className="flex items-center text-[10px] text-xis-neon-yellow font-bold uppercase mt-1">
                      <AlertTriangle size={12} className="mr-1" /> Estoque Baixo
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setMovementType('entrada');
                    setIsMovementModalOpen(true);
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-bold transition-colors"
                >
                  <ArrowUpCircle size={16} className="text-xis-neon-blue" /> ENTRADA
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setMovementType('saida');
                    setIsMovementModalOpen(true);
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-bold transition-colors"
                >
                  <ArrowDownCircle size={16} className="text-xis-neon-pink" /> SAÍDA
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Novo Produto */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-xis-black border border-white/20 w-full max-w-sm rounded-3xl p-6 relative z-10"
            >
              <h3 className="text-2xl font-graffiti mb-6 uppercase tracking-widest">
                {modalMode === 'add' ? 'NOVO INSUMO' : 'EDITAR INSUMO'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-xs font-bold uppercase text-white/50 mb-1">Nome do Insumo</label>
                  <input id="nome" name="nome" required defaultValue={modalMode === 'edit' ? selectedProduct?.nome : ''} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-xis-neon-green outline-none" placeholder="Ex: Pão de Xis" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantidade" className="block text-xs font-bold uppercase text-white/50 mb-1">Qtd {modalMode === 'edit' ? 'Atual' : 'Inicial'}</label>
                    <input id="quantidade" name="quantidade" type="number" step="0.01" required defaultValue={modalMode === 'edit' ? selectedProduct?.quantidade : ''} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-xis-neon-green outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label htmlFor="unidade" className="block text-xs font-bold uppercase text-white/50 mb-1">Unidade</label>
                    <input id="unidade" name="unidade" required defaultValue={modalMode === 'edit' ? selectedProduct?.unidade : ''} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-xis-neon-green outline-none" placeholder="un, kg, g..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preco_unitario" className="block text-xs font-bold uppercase text-white/50 mb-1">Custo Unitário (R$)</label>
                    <input id="preco_unitario" name="preco_unitario" type="number" step="0.01" required defaultValue={modalMode === 'edit' ? selectedProduct?.preco_unitario : ''} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-xis-neon-green outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label htmlFor="estoque_minimo" className="block text-xs font-bold uppercase text-white/50 mb-1">Min Alerta</label>
                    <input id="estoque_minimo" name="estoque_minimo" type="number" step="0.01" required defaultValue={modalMode === 'edit' ? selectedProduct?.estoque_minimo : ''} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-xis-neon-green outline-none" placeholder="5" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-xis-black font-black py-4 rounded-xl mt-4 hover:bg-xis-neon-green transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'SALVANDO...' : modalMode === 'add' ? 'CADASTRAR' : 'SALVAR ALTERAÇÕES'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Movimentação */}
      <AnimatePresence>
        {isMovementModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMovementModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-xis-black border border-white/20 w-full max-w-sm rounded-3xl p-6 relative z-10"
            >
              <h3 className={`text-2xl font-graffiti mb-2 ${movementType === 'entrada' ? 'text-xis-neon-blue' : 'text-xis-neon-pink'}`}>
                {movementType === 'entrada' ? 'REGISTRAR ENTRADA' : 'REGISTRAR SAÍDA'}
              </h3>
              <p className="text-white/60 mb-6 uppercase text-sm font-bold tracking-widest">{selectedProduct?.nome}</p>

              <form onSubmit={handleMovement} className="space-y-4">
                <div>
                  <label htmlFor="mov_quantidade" className="block text-xs font-bold uppercase text-white/50 mb-1">Quantidade ({selectedProduct?.unidade})</label>
                  <input id="mov_quantidade" name="quantidade" type="number" step="0.01" required autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-black text-center focus:border-white outline-none" placeholder="0" />
                </div>

                <button
                  type="submit"
                  className={`w-full ${movementType === 'entrada' ? 'bg-xis-neon-blue' : 'bg-xis-neon-pink'} text-xis-black font-black py-4 rounded-xl mt-4`}
                >
                  CONFIRMAR {movementType === 'entrada' ? 'COMPRA' : 'BAIXA'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
