import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnryM3yncd3zR8_qhfEjyaIEIHCzBOB_c",
  authDomain: "gestao-de-estoque-4abb9.firebaseapp.com",
  projectId: "gestao-de-estoque-4abb9",
  storageBucket: "gestao-de-estoque-4abb9.firebasestorage.app",
  messagingSenderId: "620500955568",
  appId: "1:620500955568:web:2d14ff5cf6002b19c16675",
  measurementId: "G-HD9CRHFLQG"
};

console.log("Inicializando Firebase (padrão)...");
const app = initializeApp(firebaseConfig);

// Voltando para a inicialização padrão para ver se resolve o timeout
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);

if (typeof window !== 'undefined') {
  window.firestoreDb = db;
  console.log("Firebase pronto!");
}
