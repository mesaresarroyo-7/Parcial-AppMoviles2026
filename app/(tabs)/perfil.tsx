// Pantalla Perfil - Información del administrador y opciones de gestión
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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

export default function PerfilScreen() {
  const router = useRouter();

  // Función para cerrar sesión
  const cerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            // Redirigir al login
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Encabezado rojo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🍕</Text>
          </View>
          <Text style={styles.profileName}>Administrador</Text>
          <Text style={styles.profileEmail}>admin@littlecaesars.com</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Admin</Text>
          </View>
        </View>

        {/* Sección: Gestión de catálogo */}
        <Text style={styles.sectionTitle}>Gestión de catálogo</Text>
        <View style={styles.menuCard}>
          {/* Opción: Ver pizzas registradas */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/home")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#FFEBEE" }]}>
                <Ionicons name="pizza" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuText}>Ver pizzas registradas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Opción: Registrar nueva pizza */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/registrar")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="add-circle" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.menuText}>Registrar nueva pizza</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Opción: Configuración */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="settings" size={20} color="#FF9800" />
              </View>
              <Text style={styles.menuText}>Configuración</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Sección: Acerca de */}
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <View style={styles.menuCard}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Aplicación</Text>
            <Text style={styles.aboutValue}>Little Caesars</Text>
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Versión</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Curso</Text>
            <Text style={styles.aboutValue}>Desarrollo de Apps Móviles 2</Text>
          </View>
        </View>

        {/* Botón: Cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          © 2026 Little Caesars
        </Text>
      </ScrollView>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cream,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  aboutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  aboutLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  aboutValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    // Sombra del botón
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.gray,
  },
});
