import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function PizzaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pizza, setPizza] = useState<Pizza | null>(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    if (!id) return;
    const pizzaRef = ref(database, `pizzas/${id}`);
    const unsubscribe = onValue(pizzaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPizza({ id, ...data });
      } else {
        setPizza(null);
      }
      setCargando(false);
    });
    return () => unsubscribe();
  }, [id]);
  if (cargando) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando pizza...</Text>
      </SafeAreaView>
    );
  }
  if (!pizza) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ fontSize: 48 }}>😕</Text>
        <Text style={styles.loadingText}>Pizza no encontrada</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => router.back()}
          >
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>

          {pizza.imagenUrl ? (
            <Image
              source={{ uri: pizza.imagenUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>🍕</Text>
            </View>
          )}
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.nombre}>{pizza.nombre}</Text>
          <Text style={styles.precio}>S/ {pizza.precio}</Text>
          <View style={styles.badgesRow}>
            {pizza.categoria ? (
              <View style={[styles.badge, { backgroundColor: "#FFEBEE" }]}>
                <Text style={styles.badgeIcon}>🏷️</Text>
                <Text style={[styles.badgeText, { color: COLORS.primary, fontWeight: "600" }]}>
                  {pizza.categoria}
                </Text>
              </View>
            ) : null}
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>📏</Text>
              <Text style={styles.badgeText}>{pizza.tamano}</Text>
            </View>
            <View style={[styles.badge, styles.stockBadge]}>
              <Text style={styles.badgeIcon}>📦</Text>
              <Text style={styles.stockBadgeText}>Stock: {pizza.stock}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧀 Ingredientes</Text>
            <Text style={styles.sectionContent}>{pizza.ingredientes}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Descripción</Text>
            <Text style={styles.sectionContent}>{pizza.descripcion}</Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push(`/pizza/editar/${id}`)}
            >
              <Text style={styles.editButtonText}>✏️ Editar pizza</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>← Volver al catálogo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.gray,
  },
  imageSection: {
    height: 280,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    position: "absolute",
    top: 10,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrowText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 100,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: 400,
  },
  nombre: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  precio: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  badgeIcon: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  stockBadge: {
    backgroundColor: "#E8F5E9",
  },
  stockBadgeText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: "600",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: COLORS.gray,
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.gray,
    fontSize: 15,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "bold",
  },
});
