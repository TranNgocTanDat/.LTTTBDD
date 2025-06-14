import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import UserProfileCard from "./components/UserProfileCard";
import { Heart, LogOut, User } from "lucide-react-native";
import { RootStackParamList } from "@/routes/Routers";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabParamList } from "@/routes/tabs/Tabs";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import OptionList from "./components/OptionList";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserResponse } from "@/model/User";
import userApi from "@/services/userApi";
import { logout } from "@/redux/authSlice";
import { RootState } from "@/redux/store";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "user">,
  NativeStackScreenProps<RootStackParamList>
>;

const UserProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  //   const [userInfo, setUserInfo] = useState<User | {}>({});
  //   const { user } = route.params;

  //   const convertToJSON = (obj: any) => {
  //     try {
  //       setUserInfo(JSON.parse(obj));
  //     } catch (e) {
  //       setUserInfo(obj);
  //     }
  //   };

  //   useEffect(() => {
  //     convertToJSON(user);
  //   }, []);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // Lấy trạng thái authenticated từ Redux
  const { authenticated } = useSelector((state: RootState) => state.auth);

  const { data: user } = useQuery<UserResponse>({
    queryKey: ["me"],
    queryFn: userApi.getMyInfo,

    enabled: authenticated, // Chỉ gọi API khi người dùng đã đăng nhập
    refetchOnWindowFocus: false,
  });

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); // Xóa token khỏi localStorage

    queryClient.removeQueries({ queryKey: ["me"] });

    navigation.getParent()?.navigate("/login");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>
      {user && (
        <View style={styles.UserProfileCardContianer}>
          <UserProfileCard Icon={User} user={user} />
        </View>
      )}
      <View style={styles.OptionsContainer}>
        <OptionList
          text="My Account"
          Icon={User}
          iconName="person"
          // onPress={() => navigation.navigate("myaccount", { user: userInfo })}
        />
        <OptionList
          text="Wishlist"
          Icon={Heart}
          iconName="heart"
          // onPress={() => navigation.navigate("mywishlist", { user: userInfo })}
        />
        <OptionList
          text="Logout"
          Icon={LogOut}
          iconName="log-out"
          onPress={async () => {
            await AsyncStorage.removeItem("authUser");
            navigation.replace("login");
          }}
        />
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  UserProfileCardContianer: {
    width: "100%",
    height: "25%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  OptionsContainer: {
    width: "100%",
  },
});
