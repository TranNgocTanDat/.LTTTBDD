import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../theme/theme";
import { Product } from "../../model/Product";
import productApi from "../../services/productApi";

const ProductDetailsScreen = ({ route, navigation }: any) => {
    const { id } = route.params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const [comments, setComments] = useState<string[]>([
        "Sản phẩm rất tốt!",
        "Đóng gói chắc chắn, giao hàng nhanh.",
    ]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productApi.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
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

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} barStyle="light-content" />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons
                    name="arrow-back-circle-outline"
                    size={32}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>

            <Image source={{ uri: product.img }} style={styles.image} />

            <View style={styles.infoContainer}>
                <Text style={styles.title}>{product.productName}</Text>
                <Text style={styles.price}>
                    ₫{product.price?.toLocaleString("vi-VN") || "N/A"}
                </Text>

                <Text style={styles.description}>
                    {product.description || "Không có mô tả"}
                </Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>

                {/* BÌNH LUẬN */}
                <View style={styles.reviewContainer}>
                    <Text style={styles.reviewTitle}>Đánh giá & Bình luận</Text>

                    {comments.map((comment, index) => (
                        <Text key={index} style={styles.reviewComment}>• {comment}</Text>
                    ))}

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
            </View>
        </ScrollView>
    );
};

export default ProductDetailsScreen;

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
        marginBottom:10,
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
        color: COLORS.primaryGreenHex || "#4CAF50",
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: COLORS.primaryGreyHex || "#ccc",
        marginBottom: 30,
    },
    button: {
        backgroundColor: COLORS.primaryGreenHex || "#4CAF50",
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
    reviewContainer: {
        marginTop: 30,
        marginBottom: 30,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.primaryWhiteHex,
        marginBottom: 10,
    },
    reviewComment: {
        fontSize: 14,
        color: COLORS.primaryGreyHex || "#ccc",
        marginBottom: 5,
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
        backgroundColor: COLORS.primaryGreenHex || "#4CAF50",
        padding: 10,
        borderRadius: 8,
        marginLeft: 8,
    },
});
