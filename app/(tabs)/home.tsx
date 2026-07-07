import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, onValue } from "firebase/database";
import { database } from "../../config/firebaseConfig";
import { Pizza } from "../../types/pizza";
import PizzaCard from "../../components/PizzaCard";
const COLORS = {
  primary: "#C9362C",
  primaryDark: "#A72B23",
  cream: "#FFF4E8",
  white: "#FFFFFF",
  green: "#4CAF50",
  text: "#2B2B2B",
  gray: "#777777",
  border: "#E5D8CE",
};
const CATEGORIAS = ["Todas", "Clásicas", "Especiales", "Familiares", "Promociones"];

export default function HomeScreen() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const pizzasRef = ref(database, "pizzas");
    const unsubscribe = onValue(pizzasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista: Pizza[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPizzas(lista);
      } else {
        setPizzas([]);
      }
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);
  const pizzasFiltradas = pizzas.filter((pizza) => {
    const coincideBusqueda =
      pizza.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      pizza.ingredientes.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaActiva === "Todas" || pizza.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });
  const verDetalle = (id: string) => {
    router.push(`/pizza/${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bienvenido a Little Caesars 🍕</Text>
        <Text style={styles.headerSubtitle}>¿Qué pizza te provoca hoy?</Text>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pizza..."
          placeholderTextColor={COLORS.gray}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>
      <View style={styles.categoriasContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIAS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriasContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoriaChip,
                categoriaActiva === item && styles.categoriaChipActiva,
              ]}
              onPress={() => setCategoriaActiva(item)}
            >
              <Text
                style={[
                  styles.categoriaText,
                  categoriaActiva === item && styles.categoriaTextActiva,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {cargando ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando pizzas...</Text>
        </View>
      ) : pizzasFiltradas.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyEmoji}>🍕</Text>
          <Text style={styles.emptyText}>
            {busqueda
              ? "No se encontraron pizzas con esa búsqueda."
              : "No hay pizzas registradas todavía."}
          </Text>
          <Text style={styles.emptySubtext}>
            {busqueda
              ? "Intenta con otro nombre o ingrediente."
              : "Ve a la pestaña Registrar para agregar tu primera pizza."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={pizzasFiltradas}
          keyExtractor={(item) => item.id || ""}
          renderItem={({ item }) => (
            <PizzaCard
              pizza={item}
              onPress={() => verDetalle(item.id || "")}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 12,
  },
  categoriasContainer: {
    marginBottom: 8,
  },
  categoriasContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoriaChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoriaChipActiva: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoriaText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.gray,
  },
  categoriaTextActiva: {
    color: COLORS.white,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.gray,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 20,
  },
});
