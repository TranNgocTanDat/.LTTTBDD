import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../theme/theme";
import { Product } from "../../model/Product";
import api from "../../services/productApi";
import ProductItem from "../../components/ProductCard/ProductCard";
import ProductCard from "../../components/ProductCard/ProductCard";

const ViewProductScreen = ({ navigation, route }: any) => {
    const { categoryId, categoryName } = route.params;
    console.log(categoryName)

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Không dùng useBottomTabBarHeight nếu không nằm trong BottomTabs
    const tabBarHeight = 60;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProductsByCategory(categoryId);
                console.log("API response:", data); // data là mảng sản phẩm
                setProducts(data); // ✅ gán trực tiếp
            } catch (err) {
                console.error("Error fetching products by category", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} />
            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-circle-outline"
                        size={30}
                        color={COLORS.primaryWhiteHex}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.screenNameContainer}>
                <Text style={styles.screenNameText}>{categoryName}</Text>
                {/*<Text style={styles.screenNameParagraph}>*/}
                {/*    Browse and add to cart*/}
                {/*</Text>*/}
            </View>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={COLORS.primaryWhiteHex}
                    style={{ marginTop: 50 }}
                />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: tabBarHeight,
                        paddingHorizontal: SPACING.space_20,
                        gap: SPACING.space_20,
                    }}
                >
                    {Array.isArray(products) && products.length > 0 ? (
                        <View style={styles.grid}>
                            {products.map((item) => (
                                <TouchableOpacity
                                    key={item.productId}
                                    onPress={() =>
                                        navigation.push("Details", {
                                            id: item.productId,
                                            type: item.productName,
                                        })
                                    }
                                >
                                    <ProductCard
                                        product={item}
                                        onPress={() =>
                                            navigation.push("productdetail", {
                                                id: item.productId,
                                                type: item.productName,
                                            })
                                        }
                                        onPressSecondary={() => {
                                            // thêm vào giỏ tại đây
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: COLORS.primaryWhiteHex }}>
                            No products available in this category.
                        </Text>
                    )}

                </ScrollView>
            )}
        </View>
    );
};

export default ViewProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        padding: SPACING.space_15,
        paddingBottom: 0,
    },
    TopBarContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 50,
    },
    screenNameContainer: {
        marginBottom: 10,
        alignItems: "center",
    },
    screenNameText: {
        fontSize: 30,
        fontWeight: "800",
        color: COLORS.primaryWhiteHex,
        textAlign: "center",
    },
    screenNameParagraph: {
        marginTop: 10,
        fontSize: 15,
        color: COLORS.primaryGreyHex,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: SPACING.space_20,
    },
});
