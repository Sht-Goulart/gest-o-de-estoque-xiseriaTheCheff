import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "../firebase";

// Produtos
export const getProducts = async () => {
  try {
    const q = query(collection(db, "produtos"), orderBy("nome"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    return await addDoc(collection(db, "produtos"), {
      ...product,
      quantidade: Number(product.quantidade),
      preco_unitario: Number(product.preco_unitario),
      estoque_minimo: Number(product.estoque_minimo),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const productRef = doc(db, "produtos", id);
    return await updateDoc(productRef, data);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};

// Histórico / Movimentação
export const getHistory = async () => {
  try {
    const q = query(collection(db, "historico"), orderBy("data", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
};

export const registerMovement = async (movement) => {
  try {
    // 1. Adicionar ao histórico
    await addDoc(collection(db, "historico"), {
      ...movement,
      data: serverTimestamp()
    });

    // 2. Atualizar quantidade no produto
    const productRef = doc(db, "produtos", movement.produto_id);
    const incrementValue = movement.tipo === 'entrada' ? movement.quantidade : -movement.quantidade;

    return await updateDoc(productRef, {
      quantidade: increment(incrementValue)
    });
  } catch (error) {
    console.error("Erro ao registrar movimentação:", error);
    throw error;
  }
};
