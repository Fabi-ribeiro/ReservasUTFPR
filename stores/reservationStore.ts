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

let store: Reservation[] = [];

export function addReservation(r: Reservation) {
  store = [r, ...store];
}

export function getReservations() {
  return store.slice();
}

export function removeReservation(id: string) {
  store = store.filter((r) => r.id !== id);
}

export function clearReservations() {
  store = [];
}
