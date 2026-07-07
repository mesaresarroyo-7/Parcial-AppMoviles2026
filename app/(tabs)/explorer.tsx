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
const CATEGORIAS_INFO = [
  { nombre: "Clásicas", emoji: "🍕", color: "#FFEBEE", textColor: "#C9362C" },
  { nombre: "Especiales", emoji: "⭐", color: "#FFF3E0", textColor: "#E65100" },
  { nombre: "Familiares", emoji: "👨‍👩‍👧‍👦", color: "#E8F5E9", textColor: "#2E7D32" },
  { nombre: "Promociones", emoji: "🔥", color: "#FCE4EC", textColor: "#AD1457" },
];

export default function ExplorerScreen() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
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
  const contarPorCategoria = (categoria: string) => {
    return pizzas.filter((p) => p.categoria === categoria).length;
  };
  const pizzasFiltradas = pizzas.filter((pizza) => {
    const coincideBusqueda =
      pizza.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      pizza.ingredientes.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      !categoriaSeleccionada || pizza.categoria === categoriaSeleccionada;
    return coincideBusqueda && coincideCategoria;
  });
  const verDetalle = (id: string) => {
    router.push(`/pizza/${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar 🔍</Text>
        <Text style={styles.headerSubtitle}>
          Descubre nuestras categorías y encuentra tu pizza ideal
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o ingrediente..."
          placeholderTextColor={COLORS.gray}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {cargando ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando categorías...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.sectionTitle}>Categorías</Text>
              <View style={styles.categoriasGrid}>
                {CATEGORIAS_INFO.map((cat) => {
                  const cantidad = contarPorCategoria(cat.nombre);
                  const isActiva = categoriaSeleccionada === cat.nombre;
                  return (
                    <TouchableOpacity
                      key={cat.nombre}
                      style={[
                        styles.categoriaCard,
                        { backgroundColor: isActiva ? COLORS.primary : cat.color },
                      ]}
                      onPress={() =>
                        setCategoriaSeleccionada(isActiva ? null : cat.nombre)
                      }
                    >
                      <Text style={styles.categoriaEmoji}>{cat.emoji}</Text>
                      <Text
                        style={[
                          styles.categoriaNombre,
                          { color: isActiva ? COLORS.white : cat.textColor },
                        ]}
                      >
                        {cat.nombre}
                      </Text>
                      <Text
                        style={[
                          styles.categoriaCantidad,
                          { color: isActiva ? "rgba(255,255,255,0.8)" : COLORS.gray },
                        ]}
                      >
                        {cantidad} {cantidad === 1 ? "pizza" : "pizzas"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.resultadosHeader}>
                <Text style={styles.sectionTitle}>
                  {categoriaSeleccionada
                    ? `📂 ${categoriaSeleccionada}`
                    : busqueda
                    ? "🔎 Resultados de búsqueda"
                    : "📋 Todas las pizzas"}
                </Text>
                <Text style={styles.resultadosCount}>
                  {pizzasFiltradas.length}{" "}
                  {pizzasFiltradas.length === 1 ? "resultado" : "resultados"}
                </Text>
              </View>
            </>
          }
          data={pizzasFiltradas}
          keyExtractor={(item) => item.id || ""}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pizzaItem}
              onPress={() => verDetalle(item.id || "")}
            >
              <View style={styles.pizzaItemLeft}>
                <Text style={styles.pizzaItemEmoji}>🍕</Text>
                <View style={styles.pizzaItemInfo}>
                  <Text style={styles.pizzaItemNombre} numberOfLines={1}>
                    {item.nombre}
                  </Text>
                  <Text style={styles.pizzaItemIngredientes} numberOfLines={1}>
                    {item.ingredientes}
                  </Text>
                  <View style={styles.pizzaItemTags}>
                    {item.categoria ? (
                      <View style={styles.pizzaItemTag}>
                        <Text style={styles.pizzaItemTagText}>
                          {item.categoria}
                        </Text>
                      </View>
                    ) : null}
                    <Text style={styles.pizzaItemTamano}>📏 {item.tamano}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.pizzaItemRight}>
                <Text style={styles.pizzaItemPrecio}>S/ {item.precio}</Text>
                <Text style={styles.pizzaItemStock}>
                  Stock: {item.stock}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>
                {busqueda || categoriaSeleccionada
                  ? "No se encontraron pizzas con ese filtro."
                  : "No hay pizzas registradas aún."}
              </Text>
              {(busqueda || categoriaSeleccionada) && (
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={() => {
                    setBusqueda("");
                    setCategoriaSeleccionada(null);
                  }}
                >
                  <Text style={styles.clearFilterText}>Limpiar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          }
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
    fontSize: 14,
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
  clearIcon: {
    fontSize: 16,
    color: COLORS.gray,
    paddingLeft: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  categoriasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  categoriaCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriaEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoriaNombre: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  categoriaCantidad: {
    fontSize: 12,
  },
  resultadosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  resultadosCount: {
    fontSize: 13,
    color: COLORS.gray,
  },
  pizzaItem: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pizzaItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pizzaItemEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  pizzaItemInfo: {
    flex: 1,
  },
  pizzaItemNombre: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 2,
  },
  pizzaItemIngredientes: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  pizzaItemTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pizzaItemTag: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pizzaItemTagText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
  pizzaItemTamano: {
    fontSize: 11,
    color: COLORS.gray,
  },
  pizzaItemRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  pizzaItemPrecio: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  pizzaItemStock: {
    fontSize: 11,
    color: COLORS.green,
    fontWeight: "600",
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
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 16,
  },
  clearFilterButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearFilterText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
});
