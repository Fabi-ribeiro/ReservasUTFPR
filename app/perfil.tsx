import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';
import { loadUserProfile, saveUserProfile } from '../services/userStore';

export default function Perfil() {
  const router = useRouter();
  const { user, logout, setUser } = useAuth() as any;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [saving, setSaving] = useState(false);

  // Se não tiver usuário, redireciona
  useEffect(() => {
    if (!user) {
      router.replace('/login' as any);
    }
  }, [user, router]);

  // Carrega o perfil completo do Firestore
  useEffect(() => {
    async function load() {
      if (!user?.uid) return;
      try {
        const profile = await loadUserProfile(user.uid);
        if (profile) {
          setFullName(profile.name || '');
          setEmail(profile.email || '');
          setPhone(profile.phone || '');
          setDepartment(profile.department || '');
        } else {
          // Se não tiver documento ainda, usa os dados básicos do contexto
          setFullName(user.name || '');
          setEmail(user.email || '');
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível carregar seu perfil.');
      }
    }
    load();
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginTop: 40, textAlign: 'center' }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  async function handleSave() {
    if (!fullName || !email) {
      Alert.alert('Erro', 'Nome e e-mail são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const profile = {
        uid: user.uid,
        name: fullName,
        email,
        phone,
        department,
        isAdmin: user.isAdmin ?? false,
      };

      await saveUserProfile(profile);

      // Atualiza o contexto para o novo nome, assim o cabeçalho mostra correto
      setUser({
        ...user,
        name: fullName,
        email,
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar seu perfil.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.searchBadge}
            onPress={() => router.push('/home' as any)}
          >
            <Feather name="search" size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Reservas UTFPR</Text>
            <Text style={styles.headerSubtitle}>Sistema de Reserva Mobiliária</Text>
          </View>
        </View>

        <Text style={styles.headerGreeting}>Olá, {user.name}</Text>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Perfil e Configurações</Text>
        <Text style={styles.pageSubtitle}>Gerencie suas informações pessoais</Text>

        {/* CARD SUPERIOR */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Ionicons name="person-circle-outline" size={48} color="#111" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{fullName || user.name}</Text>
              <Text style={styles.email}>{email || user.email}</Text>
            </View>
          </View>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Seu nome completo"
              placeholderTextColor="#9b9b9b"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              editable={false} // e-mail vem do Auth e não será editado
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="(99) 99999-9999"
              placeholderTextColor="#9b9b9b"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Setor / Departamento</Text>
            <TextInput
              style={styles.textInput}
              value={department}
              onChangeText={setDepartment}
              placeholder="Ex: Setor de TI"
              placeholderTextColor="#9b9b9b"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar alterações'}</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              logout();
              router.replace('/login' as any);
            }}
          >
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#ffd300',
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  searchBadge: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { marginLeft: 10, justifyContent: 'center' },
  headerTitle: { fontWeight: '700' },
  headerSubtitle: { color: '#8a8a8a', fontSize: 13 },
  headerGreeting: { fontSize: 13 },

  scroll: { padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700' },
  pageSubtitle: { color: '#8a8a8a', marginTop: 4, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },

  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: { fontSize: 18, fontWeight: '700' },
  email: { color: '#8a8a8a', marginTop: 4 },

  formGroup: { marginTop: 12 },
  label: { fontWeight: '700', marginBottom: 4 },
  textInput: {
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '700' },

  logoutWrapper: { marginTop: 8, marginBottom: 40 },
  logoutButton: {
    backgroundColor: '#ffd300',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { fontWeight: '700' },
});
