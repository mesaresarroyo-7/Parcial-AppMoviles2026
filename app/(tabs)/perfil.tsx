import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
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
  const [usuario, setUsuario] = useState<User | null>(null);
  const [verificando, setVerificando] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setVerificando(false);
    });
    return () => unsubscribe();
  }, []);
  const cerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/(tabs)/home");
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar la sesión.");
            }
          },
        },
      ]
    );
  };
  if (verificando) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Verificando sesión...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!usuario) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>
        <View style={styles.centerContent}>
          <View style={styles.lockIconContainer}>
            <Ionicons name="lock-closed" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.noAuthTitle}>Acceso restringido</Text>
          <Text style={styles.noAuthSubtitle}>
            Debes iniciar sesión para ver tu perfil y acceder a las opciones de
            gestión.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Ionicons name="log-in-outline" size={20} color={COLORS.white} />
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerLinkText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerLinkBold}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🍕</Text>
          </View>
          <Text style={styles.profileName}>
            {usuario.displayName || "Usuario"}
          </Text>
          <Text style={styles.profileEmail}>{usuario.email}</Text>
          <View style={styles.uidContainer}>
            <Text style={styles.uidLabel}>ID de usuario:</Text>
            <Text style={styles.uidValue} numberOfLines={1}>
              {usuario.uid}
            </Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Autenticado ✅</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Información de la cuenta</Text>
        <View style={styles.menuCard}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Correo electrónico</Text>
            <Text style={styles.aboutValue} numberOfLines={1}>
              {usuario.email || "No disponible"}
            </Text>
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>ID único (UID)</Text>
            <Text style={styles.aboutValue} numberOfLines={1}>
              {usuario.uid}
            </Text>
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Última conexión</Text>
            <Text style={styles.aboutValue}>
              {usuario.metadata.lastSignInTime
                ? new Date(usuario.metadata.lastSignInTime).toLocaleDateString(
                    "es-PE",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "No disponible"}
            </Text>
          </View>
          <View style={styles.menuDivider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Cuenta creada</Text>
            <Text style={styles.aboutValue}>
              {usuario.metadata.creationTime
                ? new Date(usuario.metadata.creationTime).toLocaleDateString(
                    "es-PE",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "No disponible"}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Gestión de catálogo</Text>
        <View style={styles.menuCard}>
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
        </View>
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
        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>© 2026 Little Caesars</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.gray,
  },
  lockIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noAuthTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
  noAuthSubtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 4,
  },
  registerLinkText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  registerLinkBold: {
    color: COLORS.primary,
    fontWeight: "bold",
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
  uidContainer: {
    backgroundColor: COLORS.cream,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  uidLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 2,
  },
  uidValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },
  roleBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2E7D32",
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
    flex: 1,
  },
  aboutValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
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
