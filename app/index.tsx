// Pantalla de entrada - Redirige automáticamente al Login
import { Redirect } from "expo-router";

export default function Index() {
  // Al abrir la app, redirigir al login
  return <Redirect href="/(auth)/login" />;
}
