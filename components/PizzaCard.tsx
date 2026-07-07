import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Pizza } from "../types/pizza";
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
interface PizzaCardProps {
  pizza: Pizza;
  onPress: () => void;
}

export default function PizzaCard({ pizza, onPress }: PizzaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {pizza.imagenUrl ? (
          <Image
            source={{ uri: pizza.imagenUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>🍕</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nombre} numberOfLines={1}>
          {pizza.nombre}
        </Text>
        <Text style={styles.ingredientes} numberOfLines={2}>
          {pizza.ingredientes}
        </Text>

        {pizza.categoria ? (
          <View style={styles.categoriaBadge}>
            <Text style={styles.categoriaText}>🏷️ {pizza.categoria}</Text>
          </View>
        ) : null}

        <View style={styles.detailsRow}>
          <Text style={styles.tamano}>📏 {pizza.tamano}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Stock: {pizza.stock}</Text>
          </View>
          <Text style={styles.precio}>S/ {pizza.precio}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Ver detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    width: 110,
    height: 150,
  },
  image: {
    width: 110,
    height: 150,
  },
  placeholderImage: {
    width: 110,
    height: 150,
    backgroundColor: COLORS.cream,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  ingredientes: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 6,
    lineHeight: 16,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tamano: {
    fontSize: 11,
    color: COLORS.gray,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stockBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  stockText: {
    fontSize: 11,
    color: COLORS.green,
    fontWeight: "600",
  },
  precio: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "bold",
  },
  categoriaBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  categoriaText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
