import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { ProductResponse } from "@/model/Product";
import { RootStackParamList } from "@/routes/Routers";
import { useStore } from "../../store/store"; // 🟡 Đảm bảo đúng path đến store
type ProductDetailRouteProp = RouteProp<RootStackParamList, "productdetail">;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;
  const navigation = useNavigation();
  const addToCart = useStore((state: any) => state.addToCart);

  const handleAddToCart = () => {
    const newItem = {
      id: product.productId.toString(),
      name: product.productName,
      prices: [
        {
          size: "M", // hoặc cho phép chọn size
          price: product.price.toString(),
          quantity: 1,
        },
      ],
      image: { uri: product.img },
      special_ingredient: product.description,
      roasted: product.categoryName,
      type: product.categoryName,
      index: Math.floor(Math.random() * 1000), // hoặc product.productId
    };

    addToCart(newItem);
    Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
  };

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

        <TouchableOpacity
            style={[
              styles.button,
              product.stock <= 0 ? styles.buttonDisabled : {},
            ]}
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
        >
          <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#e91e63",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
