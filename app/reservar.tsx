import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Reservar() {
  const title = undefined as string | undefined;
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

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
  <Text style={styles.pageTitle}>Reservar: {title ? decodeURIComponent(title as string) : 'Item'}</Text>

        <View style={styles.card}>
          <View style={styles.rowLabel}>
            <Feather name="user" size={16} color="#333" />
            <Text style={styles.label}>Nome Completo</Text>
          </View>
          <View style={styles.inputPill}>
            <TextInput placeholder="Digite seu nome completo" value={name} onChangeText={setName} placeholderTextColor="#9b9b9b" style={styles.input} />
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>E-mail</Text>
          <View style={styles.inputPill}>
            <TextInput placeholder="seu.email@empresa.com" value={email} onChangeText={setEmail} placeholderTextColor="#9b9b9b" keyboardType="email-address" style={styles.input} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Data Início</Text>
              <View style={styles.inputPill}>
                <TextInput placeholder="DD/MM/AAAA" value={startDate} onChangeText={setStartDate} placeholderTextColor="#9b9b9b" style={styles.input} />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Fim de data</Text>
              <View style={styles.inputPill}>
                <TextInput placeholder="DD/MM/AAAA" value={endDate} onChangeText={setEndDate} placeholderTextColor="#9b9b9b" style={styles.input} />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Horário Início</Text>
              <View style={styles.inputPill}>
                <TextInput placeholder="HH:MM" value={startTime} onChangeText={setStartTime} placeholderTextColor="#9b9b9b" style={styles.input} />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Horário Fim</Text>
              <View style={styles.inputPill}>
                <TextInput placeholder="HH:MM" value={endTime} onChangeText={setEndTime} placeholderTextColor="#9b9b9b" style={styles.input} />
              </View>
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Finalidade da Reserva</Text>
          <View style={styles.inputPill}>
            <TextInput placeholder="Ex: Reunião de equipe, trabalho individual..." value={purpose} onChangeText={setPurpose} placeholderTextColor="#9b9b9b" style={styles.input} />
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Observações (opcional)</Text>
          <View style={[styles.inputPill, { minHeight: 80, paddingVertical: Platform.OS === 'ios' ? 12 : 8 }]}>
            <TextInput placeholder="Informações adicionais sobre uma reserva..." value={notes} onChangeText={setNotes} placeholderTextColor="#9b9b9b" multiline style={[styles.input, { height: 72 }]} />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => {
              router.push('/home' as any);
            }}>
              <Text style={styles.confirmText}>Confirmar Reserva</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#ffd300', paddingTop: 18, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  searchBadge: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#ffd300', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  headerText: { marginLeft: 8, justifyContent: 'center' },
  headerTitle: { fontWeight: '700' },
  headerSubtitle: { color: '#8a8a8a', fontSize: 13 },
  headerGreeting: { fontSize: 13 },
  iconButton: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.05)' },
  scroll: { padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700'},
  pageSubtitle: { color: '#8a8a8a', marginTop: 6, marginBottom: 12 },
  rowLabel: { flexDirection: 'row', alignItems: 'center' },
  label: { marginLeft: 8, fontWeight: '700' },
  inputPill: { backgroundColor: '#f6f6f6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, marginTop: 6 },
  input: { color: '#333', padding: 0 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#f0f0f0',
  shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  actionsRow: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', alignItems: 'center' },
  confirmBtn: { backgroundColor: '#FFD300', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, minWidth: 150, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  confirmText: { fontSize: 14, fontWeight: '700', color: '#000' },
  cancelBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: '#e6e6e6', minWidth: 150, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  cancelText: { color: '#333' },
 
});
