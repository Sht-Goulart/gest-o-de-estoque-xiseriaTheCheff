import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "../firebase";

const PRODUTOS_COL = "produtos";
const HISTORICO_COL = "historico";

export const getProducts = async () => {
  try {
    console.log("Chamando getProducts...");
    const q = query(collection(db, PRODUTOS_COL), orderBy("nome"));
    const snap = await getDocs(q);
    console.log("getProducts sucesso:", snap.docs.length, "itens");
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Erro crítico getProducts:", e);
    throw e; // Lançar erro para o componente tratar
  }
};

// Usando timestamps manuais para evitar problemas com serverTimestamp() em conexões instáveis
const getManualTimestamp = () => new Date();

export const addProduct = async (p) => {
  try {
    console.log("Tentando addDoc em", PRODUTOS_COL, p);

    // Promise com timeout de 15 segundos
    const addPromise = addDoc(collection(db, PRODUTOS_COL), {
      ...p,
      quantidade: Number(p.quantidade),
      preco_unitario: Number(p.preco_unitario),
      estoque_minimo: Number(p.estoque_minimo),
      createdAt: getManualTimestamp()
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout: Firebase não respondeu em 15s")), 15000)
    );

    const docRef = await Promise.race([addPromise, timeoutPromise]);
    console.log("addDoc sucesso ID:", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Erro crítico addProduct:", e);
    throw e;
  }
};

export const registerMovement = async (m) => {
  try {
    console.log("Registrando movimentação:", m);
    const ts = getManualTimestamp();

    // Histórico
    await addDoc(collection(db, HISTORICO_COL), {
      ...m,
      data: ts
    });

    // Atualiza saldo
    const ref = doc(db, PRODUTOS_COL, m.produto_id);
    const diff = m.tipo === 'entrada' ? m.quantidade : -m.quantidade;
    await updateDoc(ref, { quantidade: increment(diff) });
    console.log("Movimentação registrada com sucesso!");
  } catch (e) {
    console.error("Erro crítico registerMovement:", e);
    throw e;
  }
};

export const getHistory = async () => {
  try {
    // Tentamos ordenar por data, mas se falhar (ex: falta de índice), retornamos sem ordem
    const q = query(collection(db, HISTORICO_COL), orderBy("data", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Erro getHistory (tentando sem ordenação):", e);
    const qSimple = query(collection(db, HISTORICO_COL));
    const snapSimple = await getDocs(qSimple);
    return snapSimple.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};
