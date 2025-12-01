// src/services/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// credenciais firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCtwTDQXkqv8y5J9ocHGh7eQdkiXkWXBxc',
  authDomain: 'dispositivos-moveis-ii.firebaseapp.com',
  projectId: 'dispositivos-moveis-ii',
  storageBucket: 'dispositivos-moveis-ii.appspot.com',
  messagingSenderId: '458812261112',
  appId: '1:458812261112:web:20f7961ddf71e3a86df10d',
};

// Garante que o Firebase só seja inicializado 1 vez
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth 
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);
