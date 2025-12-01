import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

// Carrega a chave privada
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

// Inicializa o firebase-admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function exportAll() {
  console.log("Exportando Firestore...");

  const collections = await db.listCollections();
  let exportData = {};

  for (const col of collections) {
    console.log(`Exportando coleção: ${col.id}`);
    const snapshot = await col.get();

    exportData[col.id] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  fs.writeFileSync(
    "firestore-export.json",
    JSON.stringify(exportData, null, 2)
  );

  console.log("Export concluído → firestore-export.json");
}

exportAll();
