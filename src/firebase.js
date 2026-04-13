import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRgHuqxFqExGifxCceYQlT_DU_PDueIas",
  authDomain: "gestor-de-estoque-82223.firebaseapp.com",
  projectId: "gestor-de-estoque-82223",
  storageBucket: "gestor-de-estoque-82223.firebasestorage.app",
  messagingSenderId: "404859324685",
  appId: "1:404859324685:web:852856f52f0220629cc844"
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
