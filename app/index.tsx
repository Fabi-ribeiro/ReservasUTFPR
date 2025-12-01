import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "./AuthContext";

export default function Index() {
  const { user } = useAuth();

  // Se usuário está logado → vai para tabs/home
  if (user) {
    return <Redirect href="/tabs/home" />;
  }

  // Senão → login
  return <Redirect href="/login" />;
}
