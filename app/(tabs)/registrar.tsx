import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, push } from "firebase/database";
import { database } from "../../config/firebaseConfig";
const COLORS = {
  primary: "#C9362C",
  primaryDark: "#A72B23",
  cream: "#FFF4E8",
  white: "#FFFFFF",
  text: "#2B2B2B",
  gray: "#777777",
  border: "#E5D8CE",
};
const CATEGORIAS = ["Clásicas", "Especiales", "Familiares", "Promociones"];

export default function RegistrarScreen() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [tamano, setTamano] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [categoria, setCategoria] = useState("");
  const limpiarCampos = () => {
    setNombre("");
    setPrecio("");
    setStock("");
    setTamano("");
    setIngredientes("");
    setDescripcion("");
    setImagenUrl("");
    setCategoria("");
  };
  const guardarPizza = () => {
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
    if (isNaN(Number(precio)) || Number(precio) <= 0) {
      Alert.alert("Precio inválido", "El precio debe ser un número válido mayor a 0.");
      return;
    }
    if (isNaN(Number(stock)) || Number(stock) < 0) {
      Alert.alert("Stock inválido", "El stock debe ser un número válido.");
      return;
    }
    push(ref(database, "pizzas"), {
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
        Alert.alert("¡Éxito!", "Pizza registrada correctamente.");
        limpiarCampos();
      })
      .catch((error) => {
        Alert.alert("Error", "No se pudo registrar la pizza: " + error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registrar Pizza 🍕</Text>
        <Text style={styles.headerSubtitle}>
          Agrega una nueva pizza al catálogo
        </Text>
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
          <View style={styles.formCard}>
            <Text style={styles.label}>Nombre de la pizza *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Margarita Clásica"
              placeholderTextColor={COLORS.gray}
              value={nombre}
              onChangeText={setNombre}
            />
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Precio (S/) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 28.00"
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
                  placeholder="Ej: 12"
                  placeholderTextColor={COLORS.gray}
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                />
              </View>
            </View>
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
            <Text style={styles.label}>Tamaño *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Mediana - 30cm"
              placeholderTextColor={COLORS.gray}
              value={tamano}
              onChangeText={setTamano}
            />
            <Text style={styles.label}>Ingredientes *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ej: Tomate, mozzarella, albahaca"
              placeholderTextColor={COLORS.gray}
              value={ingredientes}
              onChangeText={setIngredientes}
              multiline
              numberOfLines={2}
            />
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ej: Pizza clásica con salsa de tomate natural..."
              placeholderTextColor={COLORS.gray}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.label}>URL de imagen (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://ejemplo.com/imagen.jpg"
              placeholderTextColor={COLORS.gray}
              value={imagenUrl}
              onChangeText={setImagenUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TouchableOpacity style={styles.saveButton} onPress={guardarPizza}>
              <Text style={styles.saveButtonText}>🍕 Guardar pizza</Text>
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
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
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
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 17,
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
