import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AdminStackParamList } from "../navigation/AdminNavigator";

// Tab sidebar
const tabs: { label: string; route: keyof AdminStackParamList }[] = [
    { label: "Tổng quan", route: "overview" },
    { label: "Hải sản", route: "seafood" },
    { label: "Đơn hàng", route: "orders" },
    { label: "Khách hàng", route: "customers" },
];

const Sidebar = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const route = useRoute();

    return (
        <View style={styles.sidebar}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.route}
                    style={[
                        styles.tabButton,
                        route.name === tab.route && styles.activeTab,
                    ]}
                    onPress={() => navigation.navigate(tab.route)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            route.name === tab.route && styles.activeText,
                        ]}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Sidebar;

const styles = StyleSheet.create({
    sidebar: {
        width: 120,
        backgroundColor: "#e5e7eb",
        paddingVertical: 24,
        borderRightWidth: 1,
        borderColor: "#e5e7eb",
        height: "100%",
    },
    tabButton: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    tabText: {
        fontSize: 14,
        color: "#374151",
    },
    activeTab: {
        backgroundColor: "#dbeafe",
    },
    activeText: {
        color: "#1d4ed8",
        fontWeight: "bold",
    },
});
