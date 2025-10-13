import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "./AuthContext";

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={36} color="#000" />
          </View>
        </View>

        <Text style={styles.title}>Reservas UTFPR</Text>
        <Text style={styles.subtitle}>Entre na sua conta para acessar o sistema</Text>

        <View style={styles.formCard}>
          <Text style={styles.formHeading}>Fazer Login</Text>

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
              style={styles.inputText}
            />
          </View>

          <View style={[styles.fieldLabelRow, { marginTop: 12 }]}>
            <Feather name="lock" size={16} color="#333" />
            <Text style={styles.fieldLabel}>Senha</Text>
          </View>
          <View style={[styles.inputPill, { marginTop: 6 }]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor="#9b9b9b"
              secureTextEntry={!visible}
              style={[styles.inputText, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setVisible((v) => !v)} style={styles.eyeBtn}>
              <Feather name={visible ? "eye" : "eye-off"} size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              const name = email.split("@")[0] || "Usuário";
              setUser({ name });
              router.push('/home' as any);
            }}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomTextRow}>
          <Text style={styles.noAccount}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push("/register" as any)}>
            <Text style={styles.createAccount}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    width: "94%",
    maxWidth: 420,
    alignItems: "center",
    marginTop: 0,
  },
  avatarArea: {
    marginTop: 0,
    marginBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#FFD300",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
    color: "#000",
  },
  subtitle: {
    color: "#808080",
    marginTop: 6,
    marginBottom: 14,
    textAlign: "center",
  },
  formCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
    paddingTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  formHeading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  fieldLabel: {
    marginLeft: 8,
    fontWeight: "600",
  },
  inputPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 12,
  },
  inputText: {
    marginLeft: 6,
    color: "#333",
    padding: 0,
  },
  eyeBtn: {
    marginLeft: 8,
    padding: 6,
  },
  forgotRow: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  forgotText: {
    color: "#8a8a8a",
  },
  loginButton: {
    backgroundColor: "#FFD300",
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButtonText: {
    fontWeight: "800",
    color: "#000",
    fontSize: 16,
  },
  bottomTextRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  noAccount: {
    color: "#9b9b9b",
  },
  createAccount: {
    color: "#000",
    fontWeight: "800",
    marginLeft: 6,
  },

});
