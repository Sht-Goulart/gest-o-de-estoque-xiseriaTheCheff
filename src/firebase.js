import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

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

console.log("Inicializando Firebase com Long Polling...");
const app = initializeApp(firebaseConfig);

// initializeFirestore permite configurações extras como o forceLongPolling
// Isso ajuda muito quando a rede do cliente bloqueia o tráfego padrão do Firebase
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

if (typeof window !== 'undefined') {
  window.firestoreDb = db;
  console.log("Firebase pronto!");
}
