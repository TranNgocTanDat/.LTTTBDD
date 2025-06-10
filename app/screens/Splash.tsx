import { StyleSheet, Image, View, Text } from "react-native";
import React, { useEffect } from "react";
import { colors } from "../constants";
import logo from "../assets/logo/logo_white.png";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  dashboard: { authUser: any };
  tab: { user: any };
  login: undefined;
};

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "dashboard"
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

const Splash: React.FC<Props> = ({ navigation }) => {
  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("authUser");
      if (value !== null) {
        const user = JSON.parse(value); // convert to json
        if (user.userType === "ADMIN") {
          setTimeout(() => {
            navigation.replace("dashboard", { authUser: user });
          }, 2000);
        } else {
          setTimeout(() => {
            navigation.replace("tab", { user });
          }, 2000);
        }
      } else {
        setTimeout(() => {
          navigation.replace("login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  splashText: {
    color: colors.light,
    fontSize: 50,
    fontWeight: "bold",
  },
  logo: {
    resizeMode: "contain",
    width: 80,
    height: 80,
  },
});
