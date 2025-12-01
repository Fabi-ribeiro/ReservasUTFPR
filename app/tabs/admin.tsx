import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../AuthContext";
import { listenAllReservations, approveReservation, rejectReservation, cancelReservation, Reservation } from "../../services/reservationStore";
import { useRouter } from "expo-router";

export default function AdminPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [reservas, setReservas] = useState<Reservation[]>([]);

  // Bloqueia o acesso caso não seja admin
  useEffect(() => {
    if (!user?.isAdmin) {
      Alert.alert("Acesso negado", "Você não tem permissão para acessar esta área.");
      router.replace("/tabs/home");
      return;
    }
  }, [user]);

  // Escuta todas reservas
  useEffect(() => {
    const unsubscribe = listenAllReservations(setReservas);
    return unsubscribe;
  }, []);

  async function handleApprove(res: Reservation) {
    try {
      await approveReservation(res.id);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  async function handleReject(res: Reservation) {
    try {
      await rejectReservation(res.id);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  async function handleCancel(res: Reservation) {
    try {
      await cancelReservation(res.id);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>

        <Text style={styles.title}>Painel Administrativo</Text>
        <Text style={styles.subtitle}>Gerencie todas as reservas do sistema</Text>

        {reservas.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.itemTitle}>{r.title}</Text>
            <Text style={styles.userName}>Usuário: {r.fullName}</Text>
            <Text style={styles.info}>{r.date}</Text>
            <Text style={styles.info}>{r.time}</Text>

            <Text
              style={[
                styles.status,
                r.status === "Pendente" && styles.pending,
                r.status === "Aprovada" && styles.approved,
                r.status === "Rejeitada" && styles.rejected,
                r.status === "Cancelada" && styles.cancelled,
              ]}
            >
              {r.status}
            </Text>

            {/* Botões do admin */}
            {r.status === "Pendente" && (
              <View style={styles.row}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(r)}>
                  <Text style={styles.btnText}>Aprovar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(r)}>
                  <Text style={styles.btnText}>Rejeitar</Text>
                </TouchableOpacity>
              </View>
            )}

            {r.status === "Aprovada" && (
              <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(r)}>
                <Text style={styles.btnText}>Cancelar Reserva</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#666", marginBottom: 16 },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  itemTitle: { fontSize: 18, fontWeight: "700" },
  userName: { marginTop: 4, fontWeight: "600" },
  info: { color: "#555", marginTop: 2 },

  status: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    fontWeight: "700",
  },

  pending: { backgroundColor: "#fff6c2", color: "#a67c00" },
  approved: { backgroundColor: "#d6ffe0", color: "#008f2a" },
  rejected: { backgroundColor: "#ffd6d6", color: "#b80000" },
  cancelled: { backgroundColor: "#dcdcdc", color: "#444" },

  row: { flexDirection: "row", marginTop: 12, gap: 10 },

  approveBtn: {
    flex: 1,
    backgroundColor: "#28a745",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#dc3545",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  cancelBtn: {
    marginTop: 12,
    backgroundColor: "#f0ad4e",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },

  btnText: { color: "#fff", fontWeight: "700" },
});
