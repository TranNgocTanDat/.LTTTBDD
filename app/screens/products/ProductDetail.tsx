import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  TextInput,
  FlatList,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RootStackParamList } from "@/routes/Routers";
import productApi from "@/services/productApi";
import { useStore } from "../../store/store";
import { COLORS, SPACING } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import cartApi from "@/services/cartApi";
import { addCartItem } from "@/redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type ProductDetailRouteProp = RouteProp<RootStackParamList, "productdetail">;

const ProductDetailScreen = () => {
  const { productId } = useRoute<ProductDetailRouteProp>().params;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { authenticated } = useSelector((state: RootState) => state.auth);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-detail", productId],
    queryFn: () => productApi.getProductById(productId),
  });

  const { mutate: addToCart } = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data) => {
      dispatch(addCartItem(data));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      console.log("Add to cart success", data);
    },
    onError: (err) => {
      console.error("Add to cart failed", err);
    },
  });

  const handleAddToCart = (productId: number) => {
    if (!authenticated) {
      alert("Please log in to add items to your cart.");
      return;
    }
    addToCart({ productId, quantity: 1, size: "M", currency: "VND", price: 9999 }); // Assuming size is "M" for simplicity
    Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
  };


  const [comments, setComments] = useState<string[]>([
    "Sản phẩm rất tốt!",
    "Đóng gói chắc chắn, giao hàng nhanh.",
  ]);
  const [newComment, setNewComment] = useState("");

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primaryWhiteHex} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm.</Text>
      </View>
    );
  }

  const renderCommentItem = ({ item }: { item: string }) => (
    <Text style={styles.reviewComment}>• {item}</Text>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} barStyle="light-content" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back-circle-outline"
          size={32}
          color={COLORS.primaryWhiteHex}
        />
      </TouchableOpacity>

      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <Image source={{ uri: product.img }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{product.productName}</Text>
              <Text style={styles.price}>
                ₫{product.price?.toLocaleString("vi-VN") || "N/A"}
              </Text>
              <Text style={styles.description}>
                {product.description || "Không có mô tả"}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleAddToCart(product.productId)} 
                disabled={product.stock <= 0}
              >
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>

              <Text style={styles.reviewTitle}>Đánh giá & Bình luận</Text>
            </View>
          </>
        }
        renderItem={renderCommentItem}
        ListFooterComponent={
          <View style={[styles.infoContainer, { marginTop: 10 }]}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Nhập bình luận..."
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  if (newComment.trim()) {
                    setComments([...comments, newComment.trim()]);
                    setNewComment("");
                  }
                }}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryBlackHex,
  },
  backButton: {
    marginTop: 50,
    marginLeft: SPACING.space_15,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: SPACING.space_20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primaryWhiteHex,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primaryGreenHex,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: COLORS.primaryGreyHex,
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.primaryGreenHex,
    padding: SPACING.space_15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primaryWhiteHex,
    marginBottom: 10,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.primaryGreyHex,
    marginBottom: 5,
    paddingHorizontal: SPACING.space_20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    color: COLORS.primaryWhiteHex,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: COLORS.primaryGreenHex,
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
});
