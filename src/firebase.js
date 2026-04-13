import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (Nova configuração fornecida pelo usuário)
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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
