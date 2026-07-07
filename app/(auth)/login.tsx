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
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Campos vacíos",
        "Por favor, completa todos los campos para continuar."
      );
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "Ocurrió un error inesperado. Intenta de nuevo.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage =
            "No existe una cuenta con este correo electrónico. ¿Deseas registrarte?";
          break;
        case "auth/wrong-password":
          errorMessage =
            "La contraseña es incorrecta. Verifica e intenta de nuevo.";
          break;
        case "auth/invalid-email":
          errorMessage =
            "El formato del correo electrónico no es válido.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Demasiados intentos fallidos. Espera un momento antes de intentar de nuevo.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "Esta cuenta ha sido deshabilitada. Contacta al administrador.";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "Credenciales incorrectas. Verifica tu correo y contraseña.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Error de conexión. Verifica tu conexión a internet.";
          break;
        default:
          errorMessage = `Error: ${error.message}`;
          break;
      }

      Alert.alert("Error de acceso", errorMessage);
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
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🍅</Text>
            <Text style={styles.title}>Little Caesars</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>
          <View style={styles.formCard}>
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
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu contraseña"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.registerLinkContainer}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerLinkText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerLinkBold}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text style={styles.skipText}>Omitir por ahora →</Text>
          </TouchableOpacity>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
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
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 12,
    marginBottom: 24,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "bold",
  },
  registerLinkContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  registerLinkText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  registerLinkBold: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 18,
  },
  skipButton: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
  },
});
