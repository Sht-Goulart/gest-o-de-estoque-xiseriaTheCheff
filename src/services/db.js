import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "../firebase";

const PRODUTOS_COL = "produtos";
const HISTORICO_COL = "historico";

export const getProducts = async () => {
  try {
    const q = query(collection(db, PRODUTOS_COL), orderBy("nome"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Erro getProducts:", e);
    return [];
  }
};

export const addProduct = async (p) => {
  return addDoc(collection(db, PRODUTOS_COL), {
    ...p,
    quantidade: Number(p.quantidade),
    preco_unitario: Number(p.preco_unitario),
    estoque_minimo: Number(p.estoque_minimo),
    createdAt: serverTimestamp()
  });
};

export const registerMovement = async (m) => {
  // Histórico
  await addDoc(collection(db, HISTORICO_COL), {
    ...m,
    data: serverTimestamp()
  });

  // Atualiza saldo
  const ref = doc(db, PRODUTOS_COL, m.produto_id);
  const diff = m.tipo === 'entrada' ? m.quantidade : -m.quantidade;
  return updateDoc(ref, { quantidade: increment(diff) });
};

export const getHistory = async () => {
  try {
    const q = query(collection(db, HISTORICO_COL), orderBy("data", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Erro getHistory:", e);
    return [];
  }
};
