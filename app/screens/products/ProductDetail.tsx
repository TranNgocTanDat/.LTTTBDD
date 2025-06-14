import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ProductResponse } from "@/model/Product";
import { RootStackParamList } from "@/routes/Routers";

type ProductDetailRouteProp = RouteProp<RootStackParamList, "productdetail">;

const ProductDetailScreen = () => {
    const route = useRoute<ProductDetailRouteProp>();
    const { product } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.img }} style={styles.image} />

      <Text style={styles.title}>{product.productName}</Text>
      <Text style={styles.category}>Thể loại: {product.categoryName}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>Giá: {product.price.toLocaleString()}₫</Text>
      <Text style={styles.stock}>
        Tồn kho: {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
      </Text>
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e91e63",
    marginBottom: 10,
  },
  stock: {
    fontSize: 14,
    color: "#444",
  },
});
