import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnryM3yncd3zR8_qhfEjyaIEIHCzBOB_c",
  authDomain: "gestao-de-estoque-4abb9.firebaseapp.com",
  databaseURL: "https://gestao-de-estoque-4abb9-default-rtdb.firebaseio.com",
  projectId: "gestao-de-estoque-4abb9",
  storageBucket: "gestao-de-estoque-4abb9.firebasestorage.app",
  messagingSenderId: "620500955568",
  appId: "1:620500955568:web:26e572c391254cefc16675",
  measurementId: "G-51JGGD9K2E"
};

async function testConnection() {
  console.log("Iniciando teste de conexão...");
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firestore inicializado. Tentando ler coleção 'produtos'...");

    const querySnapshot = await getDocs(collection(db, "produtos"));
    console.log(`Sucesso! Encontrados ${querySnapshot.size} produtos.`);
  } catch (error) {
    console.error("ERRO NO TESTE DE CONEXÃO:");
    console.error(error);
  }
}

testConnection();
