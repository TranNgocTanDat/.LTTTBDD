import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../constants";
// import UserProfileScreen from "../../screens/profile/UserProfileScreen";
import HomeIconActive from "../../assets/icons/bar_home_icon.png";
import HomeIcon from "../../assets/icons/bar_home_icon.png";
import userIcon from "../../assets/icons/bar_profile_icon.png";
import userIconActive from "../../assets/icons/bar_profile_icon_active.png";
import HomeScreen from "@/screens/HomeScreen";
// import MyOrderScreen from "../../screens/user/MyOrderScreen";
// import CategoriesScreen from "../../screens/user/CategoriesScreen";

type TabParamList = {
  home: { user: any };       // Bạn thay 'any' bằng kiểu user chính xác nếu có
  categories: { user: any };
  myorder: { user: any };
  user: { user: any };
};

const Tab = createBottomTabNavigator<TabParamList>();

type Props = BottomTabScreenProps<TabParamList>;

const Tabs: React.FC<Props> = ({ route }) => {
  // Lấy user từ params route
  const { user } = route.params;

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
                {focused ? (
                  <Image source={HomeIconActive} style={styles.tabIconStyle} />
                ) : (
                  <Image source={HomeIcon} style={styles.tabIconStyle} />
                )}
              </TouchableOpacity>
            );
          } else if (routeName === "categories") {
            return (
              <TouchableOpacity disabled>
                {/* <Ionicons
                  name="ios-apps-sharp"
                  size={29}
                  color={focused ? colors.primary : colors.muted}
                /> */}
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
                {focused ? (
                  <Image source={userIconActive} style={styles.tabIconStyle} />
                ) : (
                  <Image source={userIcon} style={styles.tabIconStyle} />
                )}
              </TouchableOpacity>
            );
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen}  />
      {/* <Tab.Screen name="categories" component={CategoriesScreen} initialParams={{ user }} />
      <Tab.Screen name="myorder" component={MyOrderScreen} initialParams={{ user }} />
      <Tab.Screen name="user" component={UserProfileScreen} initialParams={{ user }} /> */}
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabIconStyle: {
    width: 24, // Mình tăng size icon lên tí cho hợp lý, bạn chỉnh thoải mái
    height: 24,
  },
});
