import { db } from "./firebase-admin.js";
import admin from "firebase-admin";

const items = [
  {
    title: "Cadeira Executiva Premium",
    category: "Cadeiras",
    location: "Sala 201",
    capacity: 1,
    rating: 4.8,
    available: true,
    image: "cadeira_executiva_premium.jpg"
  },
  {
    title: "Mesa de Reunião Grande",
    category: "Mesas",
    location: "Sala 305",
    capacity: 8,
    rating: 4.6,
    available: false,
    image: "mesa_reuniao_grande.jpg"
  },
  {
    title: "Armário Pequeno",
    category: "Armários",
    location: "Depósito",
    capacity: 1,
    rating: 4.2,
    available: true,
    image: "armario_pequeno.jpg"
  }
];

async function seed() {
  console.log("⏳ Inserindo itens no Firestore...");

  for (const item of items) {
    await db.collection("items").add({
      ...item,
      createdAt: admin.firestore.Timestamp.now()
    });

    console.log("✔ Inserido:", item.title);
  }

  console.log("🎉 Finalizado com sucesso!");
}

seed().catch(console.error);
