import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  const initialItems = [
    { id: '1', title: 'Cadeira Executiva Premium', category: 'Cadeiras', location: 'Sala 201', capacity: 1, rating: 4.8, image: require('../assets/images/Mobiliário/Cadeira_executiva_premium.jpeg'), available: true },
    { id: '2', title: 'Mesa de Reunião Grande', category: 'Mesas', location: 'Sala 305', capacity: 8, rating: 4.6, image: require('../assets/images/Mobiliário/Mesa_reuniao_grande.jpeg'), available: false },
    { id: '3', title: 'Armário Pequeno', category: 'Armários', location: 'Depósito', capacity: 1, rating: 4.2, image: require('../assets/images/Mobiliário/Armario_pequeno.jpeg'), available: true },
    { id: '4', title: 'Cadeira Estofada Confort', category: 'Cadeiras', location: 'Sala 110', capacity: 1, rating: 4.5, image: require('../assets/images/Mobiliário/Cadeira_Estofada_Confort.jpeg'), available: true },
  ];

  const [items] = useState(initialItems);

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    const bySearch = (it: typeof items[number]) => {
      if (!q) return true;
      const title = normalize(it.title);
      const category = normalize(it.category);
      const location = normalize(it.location);
      return title.includes(q) || category.includes(q) || location.includes(q);
    };

    const byCategory = (it: typeof items[number]) => {
      if (!categoryFilter || categoryFilter === "Todas") return true;
      return it.category === categoryFilter;
    };

    return items.filter((it) => byCategory(it) && bySearch(it));
  }, [search, items, categoryFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/login' as any)} style={styles.searchBadge}>
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
        <Text style={styles.sectionTitle}>Mobiliário Disponível</Text>
        <Text style={styles.sectionSubtitle}>Encontre e reserve o mobiliário que você precisa</Text>

        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#bdbdbd" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Buscar mobiliário ou local..." placeholderTextColor="#bdbdbd" style={styles.searchInput} />
        </View>

        <View style={styles.filterRow}>
          {['Todas','Cadeiras','Mesas','Armários'].map((c) => (
            <TouchableOpacity key={c} onPress={() => setCategoryFilter(c)} style={[styles.filterPill, categoryFilter === c && styles.filterPillActive]}>
              <Text style={categoryFilter === c ? styles.filterPillTextActive : undefined}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ marginTop: 12, color: '#8a8a8a' }}>{filtered.length} itens encontrados</Text>

        {filtered.map((it) => (
          <View key={it.id} style={[styles.card, !it.available && styles.cardUnavailable]}>
            <View>
                <View style={styles.cardImageWrapper}>
                  <Image
                    source={typeof it.image === 'string' ? { uri: it.image } : it.image}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={[styles.badge, it.available ? styles.badgeAvailable : styles.badgeUnavailable]}>
                  <Text style={styles.badgeText}>{it.available ? 'Disponível' : 'Reservado'}</Text>
                </View>
              </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, !it.available && styles.textMuted]}>{it.title}</Text>
              <Text style={[styles.cardCategory, !it.available && styles.textMuted]}>{it.category}</Text>
              <View style={styles.cardMeta}>
                <Text style={[styles.metaText, !it.available && styles.textMuted]}>{it.location}</Text>
                <Text style={[styles.metaText, !it.available && styles.textMuted]}>· {it.capacity}</Text>
                <Text style={[styles.metaText, !it.available && styles.textMuted]}>· ★ {it.rating}</Text>
              </View>

              <TouchableOpacity
                style={[styles.reserveBtn, !it.available && styles.reserveBtnDisabled]}
                disabled={!it.available}
                onPress={() => {
                  if (!it.available) return;
                  const title = encodeURIComponent(it.title);
                  router.push(`/reservar/${it.id}?title=${title}` as any);
                }}
              >
                <Text style={[styles.reserveBtnText, !it.available && styles.textMuted]}>{it.available ? 'Reservar' : 'Indisponível'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
  scroll: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  sectionSubtitle: { color: '#8a8a8a', marginTop: 6 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f6', padding: 12, borderRadius: 12, marginTop: 12 },
  searchPlaceholder: { color: '#bdbdbd', marginLeft: 8 },
  searchInput: { marginLeft: 8, flex: 1, color: '#333', padding: 0 },
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#f0f0f0', marginRight: 8 },
  filterPillActive: { backgroundColor: '#fff', borderColor: '#ffd300' },
  filterPillTextActive: { color: '#ffd300', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginTop: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  cardUnavailable: { opacity: 0.6 },
  cardImage: { width: '100%', height: 180 },
  cardImageWrapper: { width: '100%', height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  badge: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeAvailable: { backgroundColor: '#FFD300' },
  badgeUnavailable: { backgroundColor: '#d3d3d3' },
  badgeText: { fontWeight: '700', color: '#000' },
  textMuted: { color: '#a0a0a0' },
  cardBody: { padding: 12 },
  cardTitle: { fontWeight: '700', fontSize: 16 },
  cardCategory: { color: '#8a8a8a', marginTop: 4 },
  cardMeta: { flexDirection: 'row', marginTop: 8 },
  metaText: { color: '#8a8a8a', marginRight: 8 },
  reserveBtn: { backgroundColor: '#FFD300', paddingVertical: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  reserveBtnText: { fontWeight: '700' },
  reserveBtnDisabled: { backgroundColor: '#e0e0e0' },
  tabBar: { height: 72, borderTopWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center' },
});
