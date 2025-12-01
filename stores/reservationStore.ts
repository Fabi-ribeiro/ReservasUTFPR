import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

export type Reservation = {
  id: string;
  itemId?: string;
  title?: string;
  purpose?: string;
  location?: string;
  reservedBy?: string;
  date?: string;
  time?: string;
  status?: string;
};

// Cria uma nova reserva no Firestore
export async function addReservation(data: Omit<Reservation, 'id'>) {
  const colRef = collection(db, 'reservations');
  await addDoc(colRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

// Remove uma reserva pelo ID (document ID no Firestore)
export async function removeReservation(id: string) {
  const docRef = doc(db, 'reservations', id);
  await deleteDoc(docRef);
}

// Escuta em tempo real as reservas de um usuário específico
export function listenReservationsByUser(
  userName: string | undefined,
  onChange: (reservations: Reservation[]) => void,
) {
  if (!userName) {
    onChange([]);
    return () => {};
  }

  const colRef = collection(db, 'reservations');
  const q = query(
    colRef,
    where('reservedBy', '==', userName),
    orderBy('createdAt', 'desc'),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data: Reservation[] = snapshot.docs.map((d) => {
      const raw = d.data() as any;
      return {
        id: d.id,
        itemId: raw.itemId,
        title: raw.title,
        purpose: raw.purpose,
        location: raw.location,
        reservedBy: raw.reservedBy,
        date: raw.date,
        time: raw.time,
        status: raw.status,
      };
    });
    onChange(data);
  });

  return unsubscribe;
}
