// services/reservationsStore.ts
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { changeItemStock } from "./itemsStore";

// TIPO DA RESERVA
export type Reservation = {
  id: string;
  itemId: string;
  title: string;

  fullName?: string;
  email?: string;
  notes?: string;

  purpose: string;
  date: string;
  time: string;

  userId: string;      
  reservedBy: string;  

  status: "Pendente" | "Aprovada" | "Rejeitada" | "Cancelada";
  createdAt: string;
};

// Criar reserva 
export async function addReservation(data: any, user: any) {
  const payload = {
    ...data,

    // Garantia dos dados obrigatórios
    userId: user?.uid ?? "",
    reservedBy: user?.name ?? data.fullName ?? "Usuário",

    status: "Pendente",
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, "reservations"), payload);
}

//Ouvir reservas do usuário logado
export function listenReservationsByUser(userId: string | undefined, onChange: (list: Reservation[]) => void) {
  if (!userId) return () => {};

  const q = query(
    collection(db, "reservations"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const list: Reservation[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    onChange(list);
  });
}

//Ouvir todas as reservas (ADMIN)
export function listenAllReservations(onChange: (list: Reservation[]) => void) {
  const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const list: Reservation[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    onChange(list);
  });
}

// Atualizar status + controle de estoque
export async function updateReservationStatus(
  id: string,
  status: "Pendente" | "Aprovada" | "Rejeitada" | "Cancelada"
) {
  const ref = doc(db, "reservations", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data() as Reservation;

  if (status === "Aprovada") {
    await changeItemStock(data.itemId, -1);
  } else if (status === "Cancelada" && data.status === "Aprovada") {
    await changeItemStock(data.itemId, +1);
  }

  await updateDoc(ref, { status });
}

//Admin aprova (AGORA RECEBE SOMENTE O ID)
export async function approveReservation(id: string) {
  await updateReservationStatus(id, "Aprovada");
}

//Admin rejeita
export async function rejectReservation(id: string) {
  await updateReservationStatus(id, "Rejeitada");
}

//Usuário cancela
export async function cancelReservation(id: string) {
  await updateReservationStatus(id, "Cancelada");
}

//Remover reserva (não recomendado)
export async function removeReservation(id: string) {
  await deleteDoc(doc(db, "reservations", id));
}
