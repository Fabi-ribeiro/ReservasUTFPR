import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import {
  listenAllReservations,
  approveReservation,
  rejectReservation,
  cancelReservation,
  Reservation,
} from "../services/reservationStore";
import { useAuth } from "./AuthContext";
import { useRouter } from "expo-router";

export default function Admin() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const unsub = listenAllReservations(setReservations);
    return unsub;
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!user.isAdmin) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
        <Text style={{ textAlign: "center" }}>
          Esta área é exclusiva para administradores.
        </Text>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.replace("/home" as any)}>
          <Text style={{ color: "#007bff" }}>Voltar para a Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  async function handleApprove(id: string) {
    try {
      await approveReservation(id);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível aprovar a reserva.");
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectReservation(id);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível rejeitar a reserva.");
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancelReservation(id);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível cancelar a reserva.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={styles.title}>Admin - Reservas</Text>
      <ScrollView>
        {reservations.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.item}>{r.title}</Text>
            <Text>Solicitante: {r.fullName ?? r.reservedBy}</Text>
            <Text>Período: {r.date}</Text>
            <Text>Horário: {r.time}</Text>
            <Text>Status atual: {r.status}</Text>

            <View style={styles.row}>
              <TouchableOpacity style={styles.btnApprove} onPress={() => handleApprove(r.id)}>
                <Text>Aprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnReject} onPress={() => handleReject(r.id)}>
                <Text>Rejeitar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => handleCancel(r.id)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },
  item: { fontWeight: "700", marginBottom: 4 },
  row: { flexDirection: "row", marginTop: 10, gap: 10 },
  btnApprove: { backgroundColor: "#c5ffa1", padding: 10, borderRadius: 8 },
  btnReject: { backgroundColor: "#ffb5b5", padding: 10, borderRadius: 8 },
  btnCancel: { backgroundColor: "#ffe08a", padding: 10, borderRadius: 8 },
});
