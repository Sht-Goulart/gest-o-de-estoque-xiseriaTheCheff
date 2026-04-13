import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
// Nota: Usando valores fixos para garantir que o deploy funcione imediatamente.
const firebaseConfig = {
  apiKey: "AIzaSyCnryM3yncd3zR8_qhfEjyaIEIHCzBOB_c",
  authDomain: "gestao-de-estoque-4abb9.firebaseapp.com",
  projectId: "gestao-de-estoque-4abb9",
  storageBucket: "gestao-de-estoque-4abb9.firebasestorage.app",
  messagingSenderId: "620500955568",
  appId: "1:620500955568:web:2d14ff5cf6002b19c16675",
  measurementId: "G-HD9CRHFLQG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
