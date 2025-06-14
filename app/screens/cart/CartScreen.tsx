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
                                onPress={() =>
                                    navigation.push("Details", {
                                        index: item.index,
                                        id: item.id,
                                        type: item.type,
                                    })
                                }
                            >
                                <CartItem
                                    {...item}
                                    incrementCartItemQuantityHandler={incrementHandler}
                                    decrementCartItemQuantityHandler={decrementHandler}
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
        backgroundColor: COLORS.primaryBlackHex,
        padding: SPACING.space_15,
        paddingBottom: 0,
    },
    TopBarContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    screenNameContainer: {
        marginBottom: 10,
    },
    screenNameText: {
        fontSize: 30,
        fontWeight: "800",
        color: COLORS.primaryWhiteHex,
    },
    screenNameParagraph: {
        marginTop: 10,
        fontSize: 15,
        color: COLORS.primaryGreyHex,
    },
    bodyContainer: {
        flex: 1,
    },
    cartItemsContainer: {
        paddingHorizontal: SPACING.space_20,
        gap: SPACING.space_20,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: COLORS.primaryGreyHex,
        marginTop: 20,
    },
    totalText: {
        fontSize: 16,
        color: COLORS.primaryWhiteHex,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primaryWhiteHex,
    },
});
