import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useAuth } from "./AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { loadUserProfile } from "../services/userStore";

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      // Login no Firebase Auth
      // use the initialized auth exported from ../services/firebase
      const authInstance = auth;
      const credential = await signInWithEmailAndPassword(authInstance, email, password);
      const uid = credential.user.uid;

      // Busca dados do Firestore (coleção users / documento = uid)
      const profile = await loadUserProfile(uid);

      // Atualiza contexto com nome (se não achar perfil, usa parte do e-mail)
      const nameFromEmail = email.split("@")[0];
      setUser({
        uid,
        email: credential.user.email ?? email,
        name: profile?.name || nameFromEmail,
        isAdmin: profile?.isAdmin ?? false,
      });

      // Vai para home
      router.replace("/tabs/home");
    } catch (err: any) {
      console.error(err);
      let message = "Não foi possível fazer login.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "E-mail ou senha inválidos.";
      }
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservas UTFPR</Text>
        <Text style={styles.subtitle}>Sistema de Reserva Mobiliária</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formHeading}>Fazer Login</Text>

        {/* Campo Email */}
        <View style={styles.fieldLabelRow}>
          <MaterialIcons name="mail-outline" size={18} color="#333" />
          <Text style={styles.fieldLabel}>E-mail</Text>
        </View>

        <View style={styles.inputPill}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu.email@gmail.com"
            placeholderTextColor="#9b9b9b"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Campo Senha */}
        <View style={[styles.fieldLabelRow, { marginTop: 16 }]}>
          <Feather name="lock" size={18} color="#333" />
          <Text style={styles.fieldLabel}>Senha</Text>
        </View>

        <View style={styles.inputPill}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            placeholderTextColor="#9b9b9b"
            secureTextEntry={!visible}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity onPress={() => setVisible((v) => !v)}>
            <Feather name={visible ? "eye" : "eye-off"} size={18} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Botão Login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? "Entrando..." : "Entrar"}</Text>
        </TouchableOpacity>

        {/* Criar conta */}
        <View style={styles.bottomTextRow}>
          <Text style={styles.noAccount}>Ainda não tem conta?</Text>
          <TouchableOpacity onPress={() => router.push("/register" as any)}>
            <Text style={styles.createAccount}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: "#fff" },
  header: { marginBottom: 40 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#8a8a8a", marginTop: 4 },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  formHeading: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  fieldLabel: { marginLeft: 6, fontWeight: "700" },
  inputPill: {
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, marginLeft: 6, color: "#333", padding: 0 },
  loginButton: {
    backgroundColor: "#ffd300",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButtonText: { fontWeight: "700", color: "#000" },
  bottomTextRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noAccount: { color: "#9b9b9b" },
  createAccount: { color: "#000", fontWeight: "800", marginLeft: 6 },
});
