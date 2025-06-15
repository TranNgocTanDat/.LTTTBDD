import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  GestureResponderEvent,
} from "react-native";
import React from "react";
import { colors } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { ProductResponse } from "../../model/Product";

interface ProductCardProps {
  product: ProductResponse;
  onPress: (event: GestureResponderEvent) => void;
  onPressSecondary: (event: GestureResponderEvent) => void;
  cardSize?: "small" | "large";
}

// Cắt chuỗi an toàn
const truncate = (str: string, maxLength: number) => {
  return str?.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

const ProductCard: React.FC<ProductCardProps> = ({
                                                   product,
                                                   onPress,
                                                   onPressSecondary,
                                                   cardSize = "small",
                                                 }) => {
  const {
    productName,
    price,
    img,
    stock,
    categoryName,
    description,
  } = product;

  return (
      <TouchableOpacity
          style={[styles.container, { width: cardSize === "large" ? "100%" : 150 }]}
          onPress={onPress}
      >
        <View style={styles.imageContainer}>
          <Image
              source={{
                uri: img || "https://via.placeholder.com/120",
              }}
              style={styles.productImage}
          />
        </View>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.secondaryTextSm}>
              {truncate(productName || "No name", 14)}
            </Text>
            <Text style={styles.categoryText}>{truncate(categoryName, 18)}</Text>
            <Text style={styles.primaryTextSm}>{price}₫</Text>
          </View>
          <View>
            {stock > 0 ? (
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={onPressSecondary}
                >
                  <Ionicons name="cart" size={20} color="white" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.iconContainerDisable} disabled>
                  <Ionicons name="cart" size={20} color="white" />
                </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: 150,
    height: 220,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    elevation: 5,
  },
  imageContainer: {
    backgroundColor: colors.light,
    width: "100%",
    height: 140,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingBottom: 0,
  },
  productImage: {
    height: 120,
    width: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  secondaryTextSm: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.dark,
  },
  categoryText: {
    fontSize: 12,
    color: colors.muted,
  },
  primaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerDisable: {
    backgroundColor: colors.muted,
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
