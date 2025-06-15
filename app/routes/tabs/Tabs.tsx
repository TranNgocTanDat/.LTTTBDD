import React, { ReactElement } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useStore } from "@/store/store";
import HomeScreen from "@/screens/HomeScreen";
import CartScreen from "@/screens/user/CartScreen";
import UserProfileScreen from "@/screens/profile/UserProfileScreen";
import NotificationScreen from "@/screens/user/NotificationScreen";

import { colors } from "@/constants"; // 🔁 Đảm bảo file này export đúng: primary, muted, white,...
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/routes/Routers";
import type { UserResponse } from "@/model/User";

type Props = NativeStackScreenProps<RootStackParamList, "tab">;

export type TabParamList = {
    home: { user: UserResponse };
    myorder: { user: UserResponse };
    notification: { user: UserResponse };
    user: { user: UserResponse };
};

const Tab = createBottomTabNavigator<TabParamList>();

const Tabs: React.FC<Props> = ({ route }) => {
    const  user  = route.params;

    const cartList = useStore((state) => state.CartList);
    const notificationList = useStore((state) => state.NotificationList);

    const cartCount = cartList?.length || 0;
    const unreadCount = notificationList?.filter((n) => !n.read)?.length || 0;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarStyle: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: colors.white,
                    position: "absolute",
                },
                tabBarIcon: ({ focused }) => {
                    const iconSize = 24;

                    const renderIcon = (icon: ReactElement, badgeCount?: number) => (
                        <View style={{ position: "relative" }}>
                            {icon}
                            {badgeCount && badgeCount > 0 && (
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>
                                        {badgeCount > 99 ? "99+" : badgeCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );

                    switch (route.name) {
                        case "home":
                            return renderIcon(
                                <Entypo
                                    name="home"
                                    size={iconSize}
                                    color={focused ? colors.primary : colors.muted}
                                />
                            );
                        case "myorder":
                            return renderIcon(
                                <Ionicons
                                    name="cart-outline"
                                    size={iconSize}
                                    color={focused ? colors.primary : colors.muted}
                                />,
                                cartCount
                            );
                        case "notification":
                            return renderIcon(
                                <Ionicons
                                    name="notifications"
                                    size={iconSize}
                                    color={focused ? colors.primary : colors.muted}
                                />,
                                unreadCount
                            );
                        case "user":
                            return renderIcon(
                                <AntDesign
                                    name="user"
                                    size={iconSize}
                                    color={focused ? colors.primary : colors.muted}
                                />
                            );
                        default:
                            return null;
                    }
                },
            })}
        >
            <Tab.Screen name="home" component={HomeScreen} initialParams={{ user }} />
            <Tab.Screen name="myorder" component={CartScreen} initialParams={{ user }} />
            <Tab.Screen name="notification" component={NotificationScreen} initialParams={{ user }} />
            <Tab.Screen name="user" component={UserProfileScreen} initialParams={{ user }} />
        </Tab.Navigator>
    );
};

export default Tabs;

const styles = StyleSheet.create({
    badgeContainer: {
        position: "absolute",
        top: -4,
        right: -8,
        backgroundColor: "#e91e63",
        borderRadius: 10,
        paddingHorizontal: 5,
        minWidth: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "bold",
    },
});
