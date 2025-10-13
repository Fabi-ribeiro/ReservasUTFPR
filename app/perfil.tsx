import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';

export default function Perfil() {
  const { user } = useAuth();
  const router = useRouter();
  const name = user?.name ?? 'João Silva';

  const [fullName, setFullName] = useState('João Silva');
  const [email, setEmail] = useState('jheanfelipegotardo@gmail.com');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [department, setDepartment] = useState('Tecnologia da Informação');

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  async function handleSave() {
    Alert.alert('Salvar indisponível', 'A integração com Firebase ainda não foi implementada!');
  }

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
        <Text style={styles.pageTitle}>Perfil e Configurações</Text>
        <Text style={styles.pageSubtitle}>Gerencie suas informações pessoais</Text>

        <View style={styles.cardTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials('João Silva')}</Text>
          </View>
          <View style={styles.cardTopText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.department}>Tecnologia da Informação</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person-outline" size={20} color="#111" />
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          </View>

          <EditableInput label="Nome Completo" value={fullName} onChangeText={setFullName} />
          <EditableInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <EditableInput label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <EditableInput label="Departamento" value={department} onChangeText={setDepartment} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={20} color="#111" />
            <Text style={styles.sectionTitle}>Notificações</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.rowTitle}>Notificações Push</Text>
              <Text style={styles.rowSubtitle}>Receber notificações sobre reservas</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: '#ffd300' }} />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.rowTitle}>E-mail de Atualizações</Text>
              <Text style={styles.rowSubtitle}>Receber resumos por e-mail</Text>
            </View>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="security" size={20} color="#111" />
            <Text style={styles.sectionTitle}>Segurança</Text>
          </View>

          <TouchableOpacity style={styles.optionButton} onPress={() => { }}>
            <Text style={styles.optionText}>Alterar Senha</Text>
            <Feather name="chevron-right" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => { }}>
            <Text style={styles.optionText}>Configurar autenticação em duas etapas</Text>
            <Feather name="chevron-right" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => { }}>
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/home' as any)}>
          <MaterialIcons name="home" size={24} color="#ffd300" />
          <Text style={{ color: '#ffd300' }}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/reservas' as any)}>
          <MaterialIcons name="event" size={24} color="#999" />
          <Text style={{ color: '#999' }}>Reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/perfil' as any)}>
          <MaterialIcons name="person" size={24} color="#999" />
          <Text style={{ color: '#999' }}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

function getInitials(fullName: string) {
  const parts = fullName.trim().split(' ');
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function LabeledInput({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.fakeInput}>
        <Text style={styles.inputText}>{value ?? ''}</Text>
      </View>
    </View>
  );
}

function EditableInput({ label, value, onChangeText, keyboardType }: { label: string; value?: string; onChangeText: (t: string) => void; keyboardType?: any }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.textInput} value={value} onChangeText={onChangeText} keyboardType={keyboardType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#ffd300', paddingTop: 18, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontWeight: '700' },
  headerText: { marginLeft: 8, justifyContent: 'center' },
  headerSubtitle: { color: '#8a8a8a', fontSize: 13 },
  headerGreeting: { fontSize: 13 },
  searchBadge: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#ffd300', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  iconButton: { padding: 6 },

  scroll: { padding: 16, paddingBottom: 40 },
  cardTop: { flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', padding: 16, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ffd300', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#111', fontWeight: '700' },
  cardTopText: { marginLeft: 12 },
  name: { fontSize: 18, fontWeight: '700' },
  department: { color: '#8a8a8a', marginTop: 6 },

  sectionCard: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { marginLeft: 8, fontWeight: '600' },
  sectionSubtitle: { color: '#8a8a8a', marginTop: 6 },

  pageTitle: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  pageSubtitle: { color: '#8a8a8a', marginTop: 6, marginBottom: 12 },

  inputLabel: { color: '#222', fontWeight: '600', marginBottom: 6 },
  fakeInput: { backgroundColor: '#f6f6f6', padding: 12, borderRadius: 8 },
  inputText: { color: '#444' },

  saveButton: { backgroundColor: '#000', paddingVertical: 12, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  textInput: { backgroundColor: '#f6f6f6', padding: 12, borderRadius: 8, color: '#222' },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  rowTitle: { fontWeight: '600' },
  rowSubtitle: { color: '#8a8a8a', marginTop: 4 },

  optionButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  optionText: { color: '#111' },

  logoutWrapper: { marginBottom: 40 },
  logoutButton: { backgroundColor: '#ffd300', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  logoutText: { fontWeight: '700' },

  tabBar: { height: 72, borderTopWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center' },
});

