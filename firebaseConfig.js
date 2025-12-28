import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEB1dSs-DsK4eqBHjiHcwuISB73CaAjEU",
  authDomain: "hanootyapp.firebaseapp.com",
  projectId: "hanootyapp",
  storageBucket: "hanootyapp.firebasestorage.app",
  messagingSenderId: "754480733858",
  appId: "1:754480733858:web:77970c9796a3e63a1b01fb",
  measurementId: "G-HC1TFN5ZGE"
};

console.log("Initialisation de Firebase avec le projet:", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
console.log("Firebase Auth prêt");
