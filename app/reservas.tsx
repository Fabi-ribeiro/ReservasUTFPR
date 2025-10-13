import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getReservations, removeReservation } from '../stores/reservationStore';
import { useAuth } from './AuthContext';

export default function Reservas() {
  const router = useRouter();
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  const reservations = useMemo(() => {
    const all = getReservations();
    if (!user?.name) return all;
    return all.filter((r) => r.reservedBy === user.name);
  }, [tick, user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/' as any)} style={styles.searchBadge}>
            <Feather name="search" size={20} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Reservas UTFPR</Text>
            <Text style={styles.headerSubtitle}>Sistema de Reserva Mobiliária</Text>
          </View>
        </View>
        <Text style={styles.headerGreeting}>Olá, João</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Minhas Reservas</Text>
        <Text style={styles.pageSubtitle}>Acompanhe o status das suas reservas</Text>

        {reservations.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardTitle}>{r.title}</Text>
                <Text style={styles.cardPurpose}>{r.purpose}</Text>
              </View>
              <View style={[styles.statusBadge, r.status === 'Confirmada' ? styles.statusConfirmed : styles.statusPending]}>
                <Text style={styles.statusText}>{r.status}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="place" size={16} color="#8a8a8a" />
              <Text style={styles.detailText}>{r.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={16} color="#8a8a8a" />
              <Text style={styles.detailText}>{r.reservedBy}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="event" size={16} color="#8a8a8a" />
              <Text style={styles.detailText}>{r.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={16} color="#8a8a8a" />
              <Text style={styles.detailText}>{r.time}</Text>
            </View>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                removeReservation(r.id);
                setTick((t) => t + 1);
              }}
            >
              <Text style={styles.cancelText}>Cancelar Reserva</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/home' as any)}>
          <MaterialIcons name="home" size={24} color="#999" />
          <Text style={{ color: '#999' }}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/reservas' as any)}>
          <MaterialIcons name="event" size={24} color="#ffd300" />
          <Text style={{ color: '#ffd300' }}>Reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/perfil' as any)}>
          <MaterialIcons name="person" size={24} color="#999" />
          <Text style={{ color: '#999' }}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#ffd300', paddingTop: 18, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontWeight: '700' },
  headerText: { marginLeft: 8, justifyContent: 'center' },
  headerSubtitle: { color: '#8a8a8a', fontSize: 13 },
  searchBadge: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#ffd300', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  iconButton: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.05)' },
  headerUser: { fontWeight: '600' },
  headerGreeting: { fontSize: 13},
  scroll: { padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: '#8a8a8a', marginTop: 6, marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#f0f0f0', marginTop: 12 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: '700', fontSize: 18 },
  cardPurpose: { color: '#8a8a8a', marginTop: 6 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusConfirmed: { backgroundColor: '#000' },
  statusPending: { backgroundColor: '#FFD300' },
  statusText: { color: '#fff', fontWeight: '700' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  detailText: { marginLeft: 8, color: '#8a8a8a' },
  cancelBtn: { marginTop: 12, borderWidth: 1, borderColor: '#f2c0c0', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: '#d33', fontWeight: '700' },
  tabBarSpacer: { height: 80 },
  tabBar: { height: 72, borderTopWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center' },
});
