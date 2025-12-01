// services/userStore.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  isAdmin?: boolean;
};

/*Carrega o perfil do usuário a partir do UID (mesmo id usado no Firebase Auth)*/
export async function loadUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as any;
  return {
    uid,
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    department: data.department ?? data.departament ?? "",
    isAdmin: data.isAdmin ?? false,
  };
}

/*Salva/atualiza o perfil do usuário no Firestore, o documento continua sendo identificado pelo UID*/
export async function saveUserProfile(profile: UserProfile) {
  const ref = doc(db, "users", profile.uid);
  await setDoc(
    ref,
    {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      department: profile.department,
      isAdmin: profile.isAdmin ?? false,
    },
    { merge: true }
  );
}
