import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, query, orderBy, addDoc, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// --- CONFIGURACIÓN DE FIREBASE ---
// REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES REALES DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCivpWhY3yV_slFSmElASoakyrS25OisWU", // <--- Pega tu apiKey aquí
    authDomain: "sistema-tickets-34b1c.firebaseapp.com",
    projectId: "sistema-tickets-34b1c",
    storageBucket: "sistema-tickets-34b1c.firebasestorage.app",
    messagingSenderId: "313582267962",
    appId: "1:313582267962:web:ce8f6048d4266fbb8c8f03",
    measurementId: "G-XTL49KNXBZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log("Firebase inicializado correctamente");

// Hacer disponible globalmente para que detalle-ticket.js pueda usarlo
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseCollection = collection;
window.firebaseQuery = query;
window.firebaseOrderBy = orderBy;
window.firebaseAddDoc = addDoc;
window.firebaseOnSnapshot = onSnapshot;
window.firebaseServerTimestamp = serverTimestamp;
