import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    StatusBar,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { colors } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import OrderList from "../../components/OrderList/OrderList";
import Spinner from "react-native-loading-spinner-overlay";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import { RootStackParamList } from "@/routes/Routers";
import { TabParamList } from "@/routes/tabs/Tabs"; // Bạn cần export TabParamList từ file Tabs hoặc copy type này vào
import { Order } from "./MyOrderDetailScreen";

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, "myorder">,
    NativeStackScreenProps<RootStackParamList, "myorder">
>;


const MyOrderScreen: React.FC<Props> = ({ navigation, route }) => {
    // Lấy user từ params
    const { user } = route.params;

    const [isloading, setIsloading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);

    // Dữ liệu ảo
    const fakeOrders: Order[] = [
        {
            orderId: "1",
            status: "Delivered",
            createdAt: "2025-06-01",
            items: [
                { productId: { title: "Product A" }, price: 10, quantity: 2 },
                { productId: { title: "Product B" }, price: 29.99, quantity: 1 },
            ],
            country: "",
            city: "",
            shippingAddress: "",
            updatedAt: ""
        },
        {
            orderId: "2",
            status: "",
            country: "",
            city: "",
            shippingAddress: "",
            updatedAt: "",
            items: [],
            createdAt: ""
        },
        {
            orderId: "3",
            status: "",
            country: "",
            city: "",
            shippingAddress: "",
            updatedAt: "",
            items: [],
            createdAt: ""
        },
    ];

    const handleOnRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setOrders(fakeOrders); // vẫn dùng dữ liệu cũ
            setRefreshing(false);
        }, 1000);
    };

    // navigation.navigate("myorderdetail", {
    //     orderDetail: item,
    //     Token: "demo-token"
    // });

    useEffect(() => {
        setOrders(fakeOrders);
    }, []);

    function handleOrderDetail(order: Order): void {
        throw new Error("Function not implemented.");
    }

    return (
        <View style={styles.container}>
            <StatusBar />
            <Spinner
                visible={isloading}
                textContent="Please wait..."
                textStyle={{ color: "#FFF" }}
            />
            <View style={styles.topBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-circle-outline"
                        size={30}
                        color={colors.muted}
                    />
                </TouchableOpacity>
                <View />
                <TouchableOpacity onPress={handleOnRefresh}>
                    <Ionicons name="cart-outline" size={30} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.screenNameContainer}>
                <Text style={styles.screenNameText}>My Orders</Text>
                <Text style={styles.screenNameParagraph}>
                    Your order and your order status
                </Text>
            </View>

            <CustomAlert message={error} type="error" />

            {orders.length === 0 ? (
                <View style={styles.ListContiainerEmpty}>
                    <Text style={styles.secondaryTextSmItalic}>
                        There are no orders placed yet.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1, width: "100%", padding: 20 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />
                    }
                >
                    {orders.map((order) => (
                        <OrderList
                            key={order.orderId}
                            item={order}
                            onPress={() => handleOrderDetail(order)}
                        />
                    ))}
                    <View style={styles.emptyView}></View>
                </ScrollView>
            )}
        </View>
    );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: colors.light,
        alignItems: "center",
        justifyContent: "flex-start",
        flex: 1,
    },
    topBarContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    screenNameContainer: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    screenNameText: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.muted,
    },
    screenNameParagraph: {
        marginTop: 5,
        fontSize: 15,
    },
    emptyView: {
        height: 20,
    },
    ListContiainerEmpty: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    secondaryTextSmItalic: {
        fontStyle: "italic",
        fontSize: 15,
        color: colors.muted,
    },
});
