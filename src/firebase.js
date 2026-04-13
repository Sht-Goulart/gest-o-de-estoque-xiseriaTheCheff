import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnryM3yncd3zR8_qhfEjyaIEIHCzBOB_c",
  authDomain: "gestao-de-estoque-4abb9.firebaseapp.com",
  projectId: "gestao-de-estoque-4abb9",
  storageBucket: "gestao-de-estoque-4abb9.firebasestorage.app",
  messagingSenderId: "620500955568",
  appId: "1:620500955568:web:26e572c391254cefc16675",
  measurementId: "G-51JGGD9K2E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Facilitar debug no console do navegador
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firestoreDb = db;
}
