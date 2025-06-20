import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../model/Product";

interface ProductCardProps {
  product: Product;
  onPress: (event: GestureResponderEvent) => void;
  onPressSecondary: (event: GestureResponderEvent) => void;
}

// Cắt chuỗi an toàn
const truncate = (str: string, maxLength: number) => {
  return str?.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};



const ProductCard: React.FC<ProductCardProps> = ({

  product,
  onPress,
  onPressSecondary,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.img }} style={styles.image} />
      </View>

      <Text style={styles.name}>{product.productName}</Text>

      <View style={styles.rating}>
        {[...Array(4)].map((_, i) => (
          <Ionicons key={i} name="star" size={14} color="#FFD700" />
        ))}
        <Ionicons name="star-outline" size={14} color="#FFD700" />
      </View>

      <View style={styles.details}>
        <Text style={styles.weight}>500g</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={onPressSecondary}
        disabled={product.stock === 0}
      >
        <Ionicons name="add" size={14} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 90, // để ảnh nằm ngoài
    alignItems: "center",
    position: "relative",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  imageWrapper: {
    position: "absolute",
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  name: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
  },

  weight: {
    fontSize: 12,
    color: "#888",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
});
