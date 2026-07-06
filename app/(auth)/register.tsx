// Pantalla de Registro - Crear cuenta con Firebase Authentication
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

// Colores principales de la app (consistentes con login)
const COLORS = {
  primary: "#C9362C",
  primaryDark: "#A72B23",
  cream: "#FFF4E8",
  white: "#FFFFFF",
  text: "#2B2B2B",
  gray: "#777777",
  border: "#E5D8CE",
  green: "#2E7D32",
};

export default function RegisterScreen() {
  // Estado para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Función para manejar el registro con Firebase
  const handleRegister = async () => {
    // Validación de campos vacíos
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(
        "Campos vacíos",
        "Por favor, completa todos los campos para continuar."
      );
      return;
    }

    // Validación de contraseñas coincidentes
    if (password !== confirmPassword) {
      Alert.alert(
        "Contraseñas no coinciden",
        "Las contraseñas ingresadas no son iguales. Verifica e intenta de nuevo."
      );
      return;
    }

    // Validación de longitud mínima de contraseña (Firebase requiere al menos 6 caracteres)
    if (password.length < 6) {
      Alert.alert(
        "Contraseña muy corta",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    setLoading(true);

    try {
      // Crear usuario con Firebase Authentication - UNA SOLA LÍNEA
      await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Registro exitoso
      Alert.alert(
        "¡Registro exitoso! ✅",
        "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
        [
          {
            text: "Ir al Login",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error: any) {
      // Manejo de errores de Firebase con mensajes en español
      let errorMessage = "Ocurrió un error inesperado. Intenta de nuevo.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "Este correo electrónico ya está registrado. Intenta iniciar sesión.";
          break;
        case "auth/invalid-email":
          errorMessage =
            "El formato del correo electrónico no es válido.";
          break;
        case "auth/weak-password":
          errorMessage =
            "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "El registro con correo y contraseña no está habilitado. Contacta al administrador.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Error de conexión. Verifica tu conexión a internet.";
          break;
        default:
          errorMessage = `Error: ${error.message}`;
          break;
      }

      Alert.alert("Error en el registro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo y título */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🍕</Text>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>
              Regístrate para acceder a Little Caesars
            </Text>
          </View>

          {/* Formulario de registro */}
          <View style={styles.formCard}>
            {/* Campo: Correo electrónico */}
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Campo: Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Campo: Confirmar contraseña */}
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor={COLORS.gray}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Botón de registro */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.registerButtonText}>Crear cuenta</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Link para ir al login */}
          <TouchableOpacity
            style={styles.loginLinkContainer}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta?{" "}
              <Text style={styles.loginLinkBold}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>

          {/* Pie de pantalla */}
          <Text style={styles.footerText}>
            © 2026 Little Caesars{"\n"}
            Desarrollo de Aplicaciones Móviles 2
          </Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoEmoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Sombra Android
    elevation: 6,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    // Sombra del botón
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 18,
  },
});
