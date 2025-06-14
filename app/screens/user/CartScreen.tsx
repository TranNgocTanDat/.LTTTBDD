import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/store";
import { COLORS, SPACING } from "../../theme/theme";
import EmptyListAnimation from "../../components/EmtyListAnimation/EmtyListAnimation";
import CartItem from "../../components/CartItem/CartItem";
import PaymentFooter from "../../components/PaymentFooter/PaymentFooter";

const CartScreen = ({ navigation }: any) => {
    const CartList = useStore((state: any) => state.CartList);
    const CartPrice = useStore((state: any) => state.CartPrice);
    const incrementCartItemQuantity = useStore(
        (state: any) => state.incrementCartItemQuantity
    );
    const decrementCartItemQuantity = useStore(
        (state: any) => state.decrementCartItemQuantity
    );
    const calculateCartPrice = useStore(
        (state: any) => state.calculateCartPrice
    );
    const removeFromCart = useStore((state: any) => state.removeFromCart);
    const addToCart = useStore((state: any) => state.addToCart);

    const handlePayment = () => {
        navigation.push("checkout", { amount: CartPrice });
    };

    useEffect(() => {
        if (CartList.length === 0) {
            addToCart({
                id: "1",
                name: "Espresso",
                prices: [{ size: "S", price: "3000", quantity: 1 }],
                image: require("../../assets/image/cangu.jpg"),
                special_ingredient: "Arabica",
                roasted: "Medium",
                type: "Coffee",
                index: 0,
            });

            addToCart({
                id: "2",
                name: "Latte",
                prices: [{ size: "M", price: "4500", quantity: 2 }],
                image: require('../../assets/image/tom.jpg'),
                special_ingredient: "Milk",
                roasted: "Light",
                type: "Coffee",
                index: 1,
            });
        }
    }, []);

    const removeHandler = (id: string, size: string) => {
        removeFromCart(id, size);
        calculateCartPrice();
    };

    useEffect(() => {
        calculateCartPrice();
    }, [CartList]);

    const incrementHandler = (id: string, size: string) => {
        incrementCartItemQuantity(id, size);
        calculateCartPrice();
    };

    const decrementHandler = (id: string, size: string) => {
        decrementCartItemQuantity(id, size);
        calculateCartPrice();
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} />
            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-circle-outline"
                        size={30}
                        color={COLORS.primaryBlackHex}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.screenNameContainer}>
                <Text style={styles.screenNameText}>Giỏ hàng</Text>
                <Text style={styles.screenNameParagraph}>
                    Kiểm tra lại sản phẩm trước khi thanh toán
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                style={styles.bodyContainer}
            >
                {CartList.length === 0 ? (
                    <EmptyListAnimation title={"Giỏ hàng trống"} />
                ) : (
                    <View style={styles.cartItemsContainer}>
                        {CartList.map((item: any) => (
                            <TouchableOpacity key={item.id}>
                                <CartItem
                                    {...item}
                                    incrementCartItemQuantityHandler={incrementHandler}
                                    decrementCartItemQuantityHandler={decrementHandler}
                                    removeFromCartHandler={removeHandler}
                                />
                            </TouchableOpacity>
                        ))}

                    </View>
                )}
            </ScrollView>

            {CartList.length > 0 && (
                <PaymentFooter
                    buttonPressHandler={handlePayment}
                    buttonTitle="Thanh toán"
                    price={{ price: CartPrice, currency: "₫" }}
                />
            )}
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: SPACING.space_20,
        paddingTop: 50,
        paddingBottom: 80,
    },
    TopBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.space_15,
    },
    screenNameContainer: {
        marginBottom: SPACING.space_10,
    },
    screenNameText: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.primaryBlackHex,
        letterSpacing: 0.3,
    },
    screenNameParagraph: {
        marginTop: 4,
        fontSize: 14,
        color: COLORS.primaryGreyHex,
    },
    bodyContainer: {
        flex: 1,
    },
    cartItemsContainer: {
        paddingTop: SPACING.space_10,
        gap: SPACING.space_15,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: SPACING.space_20,
        paddingVertical: SPACING.space_15,
        borderTopWidth: 1,
        borderColor: COLORS.primaryGreyHex,
    },
    totalText: {
        fontSize: 18,
        fontWeight: "500",
        color: COLORS.primaryBlackHex,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primaryBlackHex,
        margin: 10,
    },
});
