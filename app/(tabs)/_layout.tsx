// Layout de las tabs principales (Home, Registrar, Perfil)
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Colores principales de la app
const COLORS = {
  primary: "#C9362C",
  cream: "#FFF4E8",
  gray: "#777777",
  white: "#FFFFFF",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: "#E5D8CE",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Tab: Inicio / Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Tab: Registrar nueva pizza */}
      <Tabs.Screen
        name="registrar"
        options={{
          title: "Registrar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      {/* Tab: Perfil del administrador */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
