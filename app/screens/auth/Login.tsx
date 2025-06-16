import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthenticationRequest } from "@/model/Authentication";
import authApi from "../../services/authApi";
import { loginSuccess } from "@/redux/authSlice";
import { RootStackParamList } from "@/routes/Routers";
import * as Animatable from "react-native-animatable";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "tab" | "admindashboard">;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(loginSuccess({ token: data.token, userResponse: data.userResponse }));
      const roles = data.userResponse.roles;
      if (roles.includes("ADMIN")) {
        // navigation.replace("dashboard", { authUser: data.userResponse });
        navigation.replace("admindashboard");
      } else {
        navigation.replace("tab", data.userResponse);
      }
    },
    onError: (error: any) => {
      Alert.alert("Đăng nhập thất bại", error?.response?.data?.message || "Có lỗi xảy ra");
      setIsSubmitting(false);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu");
      return;
    }

    setIsSubmitting(true);
    const authRequest: AuthenticationRequest = { email, password };
    login.mutate(authRequest);
  };

  return (
      <View style={styles.container}>
        <Animatable.View animation="fadeInUp" duration={600} delay={100}>
          <Text style={styles.title}>Đăng Nhập</Text>
          <Text style={styles.subtitle}>Vui lòng nhập thông tin để đăng nhập</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={300}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="example@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
            />
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={500}>
          <View style={styles.inputGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TouchableOpacity onPress={() => navigation.navigate("forgetpassword")}>
                <Text style={styles.link}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#9ca3af"
            />
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={700}>
          <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isSubmitting}
          >
            {isSubmitting ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={850}>
          <TouchableOpacity
              style={styles.googleButton}
              onPress={() =>
                  Linking.openURL("https://31b3-42-119-81-92.ngrok-free.app/api/login/oauth2/code/google")
              }
          >
            <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
                }}
                style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Đăng nhập với Google</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={1000}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
              <Text style={[styles.link, { marginLeft: 5 }]}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    fontSize: 15,
    color: "#111827",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  googleButton: {
    marginTop: 16,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleText: {
    fontSize: 14,
    color: "#111827",
  },
  link: {
    color: "#2563eb",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#6b7280",
  },
});
