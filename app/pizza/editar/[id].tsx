// Pantalla Editar Pizza - Actualizar o eliminar una pizza existente
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../../../config/firebaseConfig";

// Colores principales de la app
const COLORS = {
  primary: "#C9362C",
  primaryDark: "#A72B23",
  cream: "#FFF4E8",
  white: "#FFFFFF",
  text: "#2B2B2B",
  gray: "#777777",
  border: "#E5D8CE",
};

// Opciones de categoría disponibles
const CATEGORIAS = ["Clásicas", "Especiales", "Familiares", "Promociones"];

export default function EditarPizzaScreen() {
  // Obtener el id de la pizza desde los parámetros
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [tamano, setTamano] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cargando, setCargando] = useState(true);

  // useEffect: Cargar datos actuales de la pizza desde Firebase
  useEffect(() => {
    if (!id) return;

    // Referencia a la pizza en Firebase
    const pizzaRef = ref(database, `pizzas/${id}`);

    // Leer datos una vez con onValue
    const unsubscribe = onValue(pizzaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Llenar los campos con los datos actuales
        setNombre(data.nombre || "");
        setPrecio(data.precio || "");
        setStock(data.stock || "");
        setTamano(data.tamano || "");
        setIngredientes(data.ingredientes || "");
        setDescripcion(data.descripcion || "");
        setImagenUrl(data.imagenUrl || "");
        setCategoria(data.categoria || "");
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Función para actualizar la pizza en Firebase
  const actualizarPizza = () => {
    // Validación: campos obligatorios no vacíos
    if (
      !nombre.trim() ||
      !precio.trim() ||
      !stock.trim() ||
      !tamano.trim() ||
      !ingredientes.trim() ||
      !descripcion.trim() ||
      !categoria
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    // Validación: precio numérico
    if (isNaN(Number(precio)) || Number(precio) <= 0) {
      Alert.alert("Precio inválido", "El precio debe ser un número válido mayor a 0.");
      return;
    }

    // Validación: stock numérico
    if (isNaN(Number(stock)) || Number(stock) < 0) {
      Alert.alert("Stock inválido", "El stock debe ser un número válido.");
      return;
    }

    // Actualizar en Firebase usando update()
    update(ref(database, `pizzas/${id}`), {
      nombre: nombre.trim(),
      precio: precio.trim(),
      stock: stock.trim(),
      tamano: tamano.trim(),
      ingredientes: ingredientes.trim(),
      descripcion: descripcion.trim(),
      imagenUrl: imagenUrl.trim(),
      categoria: categoria,
    })
      .then(() => {
        Alert.alert("¡Éxito!", "Pizza actualizada correctamente.", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      })
      .catch((error) => {
        Alert.alert("Error", "No se pudo actualizar: " + error.message);
      });
  };

  // Función para eliminar la pizza
  const eliminarPizza = () => {
    // Confirmación antes de eliminar
    Alert.alert(
      "Eliminar pizza",
      "¿Seguro que deseas eliminar esta pizza? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // Eliminar de Firebase usando remove()
            remove(ref(database, `pizzas/${id}`))
              .then(() => {
                Alert.alert("Eliminada", "Pizza eliminada correctamente.", [
                  {
                    text: "OK",
                    onPress: () => router.replace("/(tabs)/home"),
                  },
                ]);
              })
              .catch((error) => {
                Alert.alert("Error", "No se pudo eliminar: " + error.message);
              });
          },
        },
      ]
    );
  };

  // Pantalla de carga
  if (cargando) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Barra superior roja */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerBack}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Pizza ✏️</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tarjeta del formulario */}
          <View style={styles.formCard}>
            {/* Campo: Nombre */}
            <Text style={styles.label}>Nombre de la pizza *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la pizza"
              placeholderTextColor={COLORS.gray}
              value={nombre}
              onChangeText={setNombre}
            />

            {/* Fila: Precio y Stock */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Precio (S/) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Precio"
                  placeholderTextColor={COLORS.gray}
                  value={precio}
                  onChangeText={setPrecio}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Stock *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Stock"
                  placeholderTextColor={COLORS.gray}
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Campo: Categoría */}
            <Text style={styles.label}>Categoría *</Text>
            <View style={styles.categoriasRow}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoriaChip,
                    categoria === cat && styles.categoriaChipActiva,
                  ]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text
                    style={[
                      styles.categoriaChipText,
                      categoria === cat && styles.categoriaChipTextActiva,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Campo: Tamaño */}
            <Text style={styles.label}>Tamaño *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tamaño"
              placeholderTextColor={COLORS.gray}
              value={tamano}
              onChangeText={setTamano}
            />

            {/* Campo: Ingredientes */}
            <Text style={styles.label}>Ingredientes *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingredientes"
              placeholderTextColor={COLORS.gray}
              value={ingredientes}
              onChangeText={setIngredientes}
              multiline
              numberOfLines={2}
            />

            {/* Campo: Descripción */}
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              placeholderTextColor={COLORS.gray}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
            />

            {/* Campo: URL de imagen */}
            <Text style={styles.label}>URL de imagen (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="URL de la imagen"
              placeholderTextColor={COLORS.gray}
              value={imagenUrl}
              onChangeText={setImagenUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            {/* Botón: Actualizar */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={actualizarPizza}
            >
              <Text style={styles.updateButtonText}>✅ Actualizar pizza</Text>
            </TouchableOpacity>

            {/* Botón: Eliminar */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={eliminarPizza}
            >
              <Text style={styles.deleteButtonText}>🗑️ Eliminar pizza</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.gray,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBack: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    // Sombra
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  deleteButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
  categoriasRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoriaChip: {
    backgroundColor: COLORS.cream,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoriaChipActiva: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoriaChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.gray,
  },
  categoriaChipTextActiva: {
    color: COLORS.white,
  },
});
