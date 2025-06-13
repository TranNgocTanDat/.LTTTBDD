import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { colors } from "../../constants";
import HomeIconActive from "../../assets/icons/bar_home_icon.png";
import HomeIcon from "../../assets/icons/bar_home_icon.png";
import userIcon from "../../assets/icons/bar_profile_icon.png";
import userIconActive from "../../assets/icons/bar_profile_icon_active.png";

import HomeScreen from "@/screens/HomeScreen";
// import CategoriesScreen from "../../screens/user/CategoriesScreen";
// import MyOrderScreen from "../../screens/user/MyOrderScreen";
// import UserProfileScreen from "../../screens/profile/UserProfileScreen";

import { RootStackParamList } from "@/routes/Routers";
import { UserResponse } from "@/model/User";
import MyOrderScreen from "@/screens/user/MyOrderScreen";
import CartScreen from "@/screens/cart/CartScreen";

type Props = NativeStackScreenProps<RootStackParamList, "tab">;

export type TabParamList = {
  home: { user: UserResponse };
  categories: { user: UserResponse };
  myorder: { user: UserResponse };
  user: { user: UserResponse };
};

const Tab = createBottomTabNavigator<TabParamList>();

const Tabs: React.FC<Props> = ({ route }) => {
  const  user  = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.white,
          display: "flex",
          position: "absolute",
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,

        tabBarIcon: ({ focused }) => {
          const routeName = route.name;
          if (routeName === "home") {
            return (
              <TouchableOpacity disabled>
                <Image
                  source={focused ? HomeIconActive : HomeIcon}
                  style={styles.tabIconStyle}
                />
              </TouchableOpacity>
            );
          } else if (routeName === "categories") {
            return (
              <TouchableOpacity disabled>
                <Ionicons
                  name="apps"
                  size={28}
                  color={focused ? colors.primary : colors.muted}
                />
              </TouchableOpacity>
            );
          } else if (routeName === "myorder") {
            return (
              <TouchableOpacity disabled>
                <Ionicons
                  name="cart-outline"
                  size={29}
                  color={focused ? colors.primary : colors.muted}
                />
              </TouchableOpacity>
            );
          } else if (routeName === "user") {
            return (
              <TouchableOpacity disabled>
                <Image
                  source={focused ? userIconActive : userIcon}
                  style={styles.tabIconStyle}
                />
              </TouchableOpacity>
            );
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} initialParams={{ user }} />
      {/* <Tab.Screen name="categories" component={CategoriesScreen} initialParams={{ user }} /> */}
      <Tab.Screen name="myorder" component={CartScreen} initialParams={{ user }} />
      {/* <Tab.Screen name="user" component={UserProfileScreen} initialParams={{ user }} /> */}
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabIconStyle: {
    width: 10,
    height: 10,
  },
});
