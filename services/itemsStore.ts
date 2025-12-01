// services/itemsStore.ts
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";

export type Item = {
  id: string;
  title: string;
  category: string;
  location: string;
  capacity: number;
  rating: number;
  image: string;   
  available: boolean;
  stock: number;
};

/*Listener de itens — lê do Firestore e aplica lógica*/
export function listenItems(onChange: (items: Item[]) => void) {
  const colRef = collection(db, "items");
  const q = query(colRef, orderBy("title"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data: Item[] = snapshot.docs.map((docSnap) => {
      const raw = docSnap.data() as any;

      const stock = raw.stock ?? 0;

      return {
        id: docSnap.id,
        title: raw.title,
        category: raw.category,
        location: raw.location,
        capacity: raw.capacity ?? 1,
        rating: raw.rating ?? 4.0,

        // Usa o nome do arquivo salvo no Firestore
        image: raw.image,

        // Disponível apenas se:
        // - available == true
        // - stock > 0
        available: raw.available !== false && stock > 0,

        stock,
      };
    });

    onChange(data);
  });

  return unsubscribe;
}

/*Função para alterar estoque (reserva, devolução, etc.*/
// delta: -1 >> reservar
// delta: +1 >> devolução
export async function changeItemStock(itemId: string, delta: number) {
  const ref = doc(db, "items", itemId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Item não encontrado");

    const data = snap.data() as any;

    const currentStock = data.stock ?? 0;
    const newStock = currentStock + delta;

    if (newStock < 0) {
      throw new Error("Estoque insuficiente");
    }

    tx.update(ref, {
      stock: newStock,
      available: newStock > 0, // Atualiza disponibilidade automaticamente
    });
  });
}
