// Layout principal de la aplicación - Configura Expo Router
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      {/* Barra de estado con texto oscuro */}
      <StatusBar style="dark" />

      {/* Navegación tipo Stack principal */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Pantalla de inicio redirige al login */}
        <Stack.Screen name="index" />

        {/* Grupo de autenticación (login) */}
        <Stack.Screen name="(auth)" />

        {/* Grupo de tabs (home, registrar, perfil) */}
        <Stack.Screen name="(tabs)" />

        {/* Pantallas de detalle y edición de pizza */}
        <Stack.Screen name="pizza/[id]" />
        <Stack.Screen name="pizza/editar/[id]" />
      </Stack>
    </>
  );
}
