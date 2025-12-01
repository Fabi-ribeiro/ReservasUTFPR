import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  listenReservationsByUser,
  cancelReservation,
  Reservation
} from '../services/reservationStore';
import { useAuth } from './AuthContext';

export default function Reservas() {
  const router = useRouter();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!user) return;

    console.log("USUÁRIO LOGADO:", user);

    const unsubscribe = listenReservationsByUser(user.uid, (res) => {
      console.log("RESERVAS RECEBIDAS:", res);
      setReservations(res);
    });

    return unsubscribe;
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginTop: 40, textAlign: 'center' }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.replace('/tabs/home')} style={styles.searchBadge}>
            <Feather name="search" size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Reservas UTFPR</Text>
            <Text style={styles.headerSubtitle}>Sistema de Reserva Mobiliária</Text>
          </View>
        </View>

        <Text style={styles.headerGreeting}>Olá, {user?.name ?? "Usuário"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Minhas Reservas</Text>
        <Text style={styles.pageSubtitle}>Acompanhe o status das suas reservas</Text>

        {reservations.length === 0 && (
          <Text style={{ color: '#888', marginTop: 20 }}>Nenhuma reserva encontrada.</Text>
        )}

        {reservations.map((r) => (
          <View key={r.id} style={styles.card}>

            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardTitle}>{r.title}</Text>
                <Text style={styles.cardPurpose}>{r.purpose}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  r.status === 'Aprovada'
                    ? styles.statusConfirmed
                    : r.status === 'Cancelada'
                    ? styles.statusCancelled
                    : r.status === 'Rejeitada'
                    ? styles.statusRejected
                    : styles.statusPending
                ]}
              >
                <Text style={styles.statusText}>{r.status}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="event" size={16} color="#8a8a8a" />
              <Text style={styles.detailText}>{r.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={16} color="#8a8a8a" />
              <Text style={styles.detailText}>{r.time}</Text>
            </View>

            {/* SOMENTE PENDENTE PODE CANCELAR */}
            {r.status === "Pendente" && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  Alert.alert(
                    "Cancelar reserva",
                    "Tem certeza que deseja cancelar?",
                    [
                      { text: "Não" },
                      {
                        text: "Sim",
                        onPress: async () => {
                          await cancelReservation(r.id);
                        }
                      }
                    ]
                  )
                }
              >
                <Text style={styles.cancelText}>Cancelar Reserva</Text>
              </TouchableOpacity>
            )}

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#ffd300',
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerText: { marginLeft: 8 },
  headerTitle: { fontWeight: '700' },
  headerSubtitle: { color: '#8a8a8a', fontSize: 13 },
  headerGreeting: { fontSize: 13 },
  searchBadge: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#ffd300', alignItems: 'center', justifyContent: 'center', marginRight: 10 },

  scroll: { padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: '#8a8a8a', marginTop: 6, marginBottom: 12 },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#f0f0f0', marginTop: 12 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  cardTitle: { fontWeight: '700', fontSize: 18 },
  cardPurpose: { color: '#8a8a8a', marginTop: 6 },

  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusPending: { backgroundColor: '#FFD300' },
  statusConfirmed: { backgroundColor: '#000' },
  statusRejected: { backgroundColor: '#999' },
  statusCancelled: { backgroundColor: '#D9534F' },
  statusText: { color: '#fff', fontWeight: '700' },

  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  detailText: { marginLeft: 8, color: '#8a8a8a' },

  cancelBtn: { marginTop: 12, borderWidth: 1, borderColor: '#ff9999', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: '#d33', fontWeight: '700' },

  tabBar: { height: 72, borderTopWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center' },
});
