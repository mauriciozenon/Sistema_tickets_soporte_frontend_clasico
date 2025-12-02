// Configuración de Firebase - EJEMPLO
// Copia este archivo como firebase-config.js y reemplaza los valores con tus credenciales de Firebase

export const firebaseConfig = {
  apiKey: "AIzaSyCivpWhY3yV_slFSmElASoakyrS25OisWU",
  authDomain: "sistema-tickets-34b1c.firebaseapp.com",
  projectId: "sistema-tickets-34b1c",
  storageBucket: "sistema-tickets-34b1c.firebasestorage.app",
  messagingSenderId: "313582267962",
  appId: "1:313582267962:web:ce8f6048d4266fbb8c8f03",
  measurementId: "G-XTL49KNXBZ"
};

// INSTRUCCIONES PARA OBTENER TUS CREDENCIALES:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Configuración del proyecto (ícono de engranaje)
// 4. En "Tus aplicaciones", selecciona la app web o crea una nueva
// 5. Copia los valores del objeto de configuración
// 6. Reemplaza los valores en este archivo

// ESTRUCTURA DE FIRESTORE:
// - Colección: tickets
//   - Documento: {ticketId}
//     - Subcolección: mensajes
//       - Documento: {mensajeId}
//         - campos: texto, autor, autorId, autorNombre, timestamp, leido

