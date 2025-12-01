import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

import { useAuth } from "./AuthContext";

export default function Register() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      return Alert.alert("Erro", "Preencha os campos obrigatórios.");
    }

    if (password !== confirm) {
      return Alert.alert("Erro", "As senhas não coincidem.");
    }

    try {
      // Criar usuário no Firebase Auth
      const creds = await createUserWithEmailAndPassword(getAuth(), email, password);

      const uid = creds.user.uid;

      // Salvar no Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone,
        department,
        isAdmin: false,
      });

      // Atualizar contexto
      setUser({
        uid,
        name,
        email,
      });

      // Redirecionar
      router.push("/home" as any);
    } catch (err: any) {
      Alert.alert("Erro ao registrar", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <View style={styles.avatarArea}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={36} color="#000" />
            </View>
          </View>

          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para criar sua conta</Text>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>

            <View style={styles.labelRow}>
              <Feather name="user" size={16} color="#333" />
              <Text style={styles.labelText}>Nome Completo *</Text>
            </View>
            <View style={styles.inputPill}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#9b9b9b"
                style={styles.inputText}
              />
            </View>

            <View style={[styles.labelRow, { marginTop: 12 }]}>
              <MaterialIcons name="mail-outline" size={18} color="#333" />
              <Text style={styles.labelText}>E-mail *</Text>
            </View>
            <View style={styles.inputPill}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu.email@empresa.com"
                placeholderTextColor="#9b9b9b"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputText}
              />
            </View>

            <View style={[styles.labelRow, { marginTop: 12 }]}>
              <Feather name="phone" size={16} color="#333" />
              <Text style={styles.labelText}>Telefone</Text>
            </View>
            <View style={styles.inputPill}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#9b9b9b"
                keyboardType="phone-pad"
                style={styles.inputText}
              />
            </View>

            <View style={[styles.labelRow, { marginTop: 12 }]}>
              <FontAwesome5 name="building" size={16} color="#333" />
              <Text style={styles.labelText}>Departamento</Text>
            </View>
            <View style={styles.inputPill}>
              <TextInput
                value={department}
                onChangeText={setDepartment}
                placeholder="Selecione seu departamento"
                placeholderTextColor="#9b9b9b"
                style={styles.inputText}
              />
            </View>

            {/* SENHA */}
            <View style={[styles.labelRow, { marginTop: 12 }]}>
              <Feather name="lock" size={16} color="#333" />
              <Text style={styles.labelText}>Senha *</Text>
            </View>
            <View style={[styles.inputPill, { marginTop: 6 }]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#9b9b9b"
                secureTextEntry={!visible}
                style={[styles.inputText, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setVisible((v) => !v)} style={styles.eyeBtn}>
                <Feather name={visible ? "eye" : "eye-off"} size={18} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.labelText, { marginTop: 12 }]}>Confirmar Senha *</Text>
            <View style={[styles.inputPill, { marginTop: 6 }]}>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#9b9b9b"
                secureTextEntry={!visible}
                style={[styles.inputText, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setVisible((v) => !v)} style={styles.eyeBtn}>
                <Feather name={visible ? "eye" : "eye-off"} size={18} color="#333" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleRegister}>
              <Text style={styles.createButtonText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scroll: { alignItems: "center", paddingVertical: 24 },
  wrapper: { width: "94%", maxWidth: 420, alignItems: "center" },
  avatarArea: { marginTop: 8, marginBottom: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#FFD300",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, fontWeight: "800", marginTop: 12, color: "#000" },
  subtitle: { color: "#808080", marginTop: 6, marginBottom: 14, textAlign: "center" },
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
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  labelText: { marginLeft: 8, fontWeight: "600" },
  inputPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 12,
  },
  inputText: { marginLeft: 6, color: "#333", padding: 0 },
  eyeBtn: { marginLeft: 8, padding: 6 },
  createButton: {
    backgroundColor: "#2fb16f",
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "700" },
});
