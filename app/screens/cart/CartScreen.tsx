import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/store";
import { COLORS, SPACING } from "../../theme/theme";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
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
    useEffect(() => {
        if (CartList.length === 0) {
            addToCart({
                id: "1",
                name: "Espresso",
                prices: [
                    { size: "S", price: "3.00", quantity: 1 },
                ],
                imagelink_square: "https://via.placeholder.com/100",
                special_ingredient: "Arabica",
                roasted: "Medium",
                type: "Coffee",
                index: 0,
            });

            addToCart({
                id: "2",
                name: "Latte",
                prices: [
                    { size: "M", price: "4.50", quantity: 2 },
                ],
                imagelink_square: "https://via.placeholder.com/100",
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

    const handlePayment = () => {
        navigation.push("Payment", { amount: CartPrice });
    };

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
                <Text style={styles.screenNameText}>My Cart</Text>
                <Text style={styles.screenNameParagraph}>
                    Review your items before payment
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                style={styles.bodyContainer}
            >
                {CartList.length === 0 ? (
                    <EmptyListAnimation title={"Cart is Empty"} />
                ) : (
                    <View style={styles.cartItemsContainer}>
                        {CartList.map((item: any) => (
                            <TouchableOpacity
                                key={item.id}
                            >
                                <CartItem
                                    {...item}
                                    incrementCartItemQuantityHandler={incrementHandler}
                                    decrementCartItemQuantityHandler={decrementHandler}
                                    removeFromCartHandler={removeHandler}
                                />
                            </TouchableOpacity>
                        ))}

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalAmount}>{CartPrice}$</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {CartList.length > 0 && (
                <PaymentFooter
                    buttonPressHandler={handlePayment}
                    buttonTitle="Pay"
                    price={{ price: CartPrice, currency: "$" }}
                />
            )}
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondaryLightGreyHex,
        paddingHorizontal: SPACING.space_20,
        paddingTop: 50,
        paddingBottom: 150,
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

