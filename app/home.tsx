import React, { useEffect, useState, useRef } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";
import { listenItems, Item } from "../services/itemsStore";

/* Mapeamento de imagens locais pois o React Native não aceita require com variável, por isso criamos o mapa abaixo.*/
const localImages: Record<string, any> = {
  "armario_pequeno.jpeg": require("../assets/images/Mobiliario/armario_pequeno.jpeg"),
  "cadeira_estofada_confort.jpeg": require("../assets/images/Mobiliario/cadeira_estofada_confort.jpeg"),
  "cadeira_executiva_premium.jpeg": require("../assets/images/Mobiliario/cadeira_executiva_premium.jpeg"),
  "mesa_reuniao_grande.jpeg": require("../assets/images/Mobiliario/mesa_reuniao_grande.jpeg"),
  "placeholder.jpeg": require("../assets/images/Mobiliario/placeholder.jpeg"),
  "armario_pequeno_dois.jpeg": require("../assets/images/Mobiliario/armario_pequeno_dois.jpeg"),
  "cadeira_escritorio_tres.jpeg": require("../assets/images/Mobiliario/cadeira_escritorio_tres.jpeg"),
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [filtered, setFiltered] = useState<Item[]>([]);

  const [search, setSearch] = useState("");
  const searchRef = useRef<TextInput | null>(null);

  const [category, setCategory] = useState("Todas");

  const CATEGORIES = [
    "Todas",
    "Cadeiras",
    "Mesas",
    "Armários",
    "Projetores",
    "Equipamentos",
  ];

  useEffect(() => {
    const unsubscribe = listenItems(setItems);
    return unsubscribe;
  }, []);

  // Filtro Automatico
  useEffect(() => {
    let result = items;

    if (category !== "Todas") {
      result = result.filter((i) => i.category === category);
    }

    if (search.trim().length > 0) {
      const s = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(s) ||
          i.location.toLowerCase().includes(s)
      );
    }

    setFiltered(result);
  }, [items, category, search]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.searchBadge}
            onPress={() => searchRef.current?.focus()}
          >
            <Image
              source={require("../assets/search.jpeg")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Reservas UTFPR</Text>
            <Text style={styles.headerSubtitle}>Sistema de Reserva Mobiliária</Text>
          </View>
        </View>

        <Text style={styles.headerGreeting}>Olá, {user?.name ?? "Usuário"}</Text>
      </View>

      {/* BARRA DE BUSCA */}
      <View style={styles.searchContainer}>
        <TextInput
          ref={searchRef}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar mobiliário ou local..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              category === cat && styles.filterButtonActive,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.filterText,
                category === cat && styles.filterTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA DE ITENS */}
      <ScrollView contentContainerStyle={styles.itemsContainer}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/reservar/[id]",
                 params: { id: item.id }

              })
            }
          >
            <Image
              source={localImages[item.image] || localImages["placeholder.jpeg"]}
              style={styles.cardImage}
            />

            <View style={{ padding: 12 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardLocation}>{item.location}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>

              <Text
                style={[
                  styles.availability,
                  item.available ? styles.available : styles.unavailable,
                ]}
              >
                {item.available ? "Disponível" : "Indisponível"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <Text style={{ marginTop: 40, textAlign: "center", color: "#777" }}>
            Nenhum item encontrado.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#ffd300",
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  searchBadge: {
    backgroundColor: "#fff",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { marginLeft: 10 },
  headerTitle: { fontWeight: "700" },
  headerSubtitle: { color: "#8a8a8a", fontSize: 13 },
  headerGreeting: { fontWeight: "600" },

  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
filters: {
  paddingVertical: 16,
  paddingHorizontal: 10,
  flexDirection: "row",
},

filterButton: {
  paddingHorizontal: 18,
  paddingVertical: 8,
  borderRadius: 20,
  marginRight: 10,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ccc",
  minHeight: 36,          
  justifyContent: "center",
  alignItems: "center",
},

filterButtonActive: {
  backgroundColor: "#ffd300",
  borderColor: "#e0b800",
},


filterText: {
  fontWeight: "600",
  fontSize: 14,
  color: "#000000",          
  includeFontPadding: false, 
  textAlignVertical: "center",
},

filterTextActive: {
  fontWeight: "700",
  fontSize: 14,
  color: "#000000",          
  includeFontPadding: false,
  textAlignVertical: "center",
},




  itemsContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ececec",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#eee",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cardLocation: {
    marginTop: 4,
    color: "#777",
  },
  cardCategory: {
    marginTop: 4,
    color: "#333",
    fontWeight: "600",
  },
  availability: {
    marginTop: 10,
    fontWeight: "700",
  },
  available: {
    color: "#228B22",
  },
  unavailable: {
    color: "#b30000",
  },
});
