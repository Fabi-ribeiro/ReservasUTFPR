## Reservas UTFPR — Sistema de Reserva de Mobiliário

- Aplicativo mobile desenvolvido em React Native + Expo + Firebase, permitindo:
- login e cadastro de usuários
- listagem de mobiliário (com fotos locais)
- reserva de itens por data/horário
- cancelamento de reservas
- painel administrativo para aprovação/rejeição
- persistência de autenticação
- regras de Firestore com segurança
- navegação com Tabs usando Expo Router

## Tecnologias utilizadas

- React Native (Expo)
- Expo Router
- Firebase Authentication
- Firestore Database
- AsyncStorage (persistência do login)
- TypeScript

## Instalação do projeto

- Requisitos

- Node.js 18+
- Expo CLI instalado globalmente:

Rodar: 
npm install -g expo-cli

- Instalar dependências

Rodar:
npm install

## Configuração do Firebase

##  2.1 — Criar projeto no Firebase

Acesse: https://console.firebase.google.com

Ative:

Authentication >> Email/senha

Firestore Database >>  Modo production

##  2.2 — Configurar o arquivo:

- src/services/firebase.ts

import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);



## Regras do Firestore

Cole em Firestore >> Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /items/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /reservations/{reservationId} {

      allow read: if isAdmin() || isOwner();

      allow create: if request.auth != null;

      allow delete: if isOwner() || isAdmin();

      allow update: if 
          isAdmin()
          ||
          (
            isOwner() &&
            request.resource.data.status == "Cancelada"
          );
    }

    function isAdmin() {
      return request.auth.token.admin == true;
    }

    function isOwner() {
      return request.auth.uid == resource.data.userId;
    }
  }
}

## Rodar o projeto

Android:
npm start


Abra:
- Expo Go no celular
Ou use:
- npm run android


## Principais comandos Expo

Limpar cache (se algo quebrar):

- expo start -c
Ver problemas no metro:
- npx expo start
