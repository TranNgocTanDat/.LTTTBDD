import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import authApi from "../../services/authApi";
import type { RootStackParamList } from "@/routes/Routers";
import * as Animatable from "react-native-animatable";
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "signup">;

const RegisterScreen = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const register = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            Alert.alert("Đăng ký thành công", "Vui lòng kiểm tra email để xác thực tài khoản.");
            navigation.navigate("verify", { email });
        },
        onError: (error: any) => {
            console.log("API Error detail:", JSON.stringify(error?.response?.data, null, 2));
            Alert.alert("Đăng ký thất bại", error?.response?.data?.message || "Lỗi không xác định");
            setIsSubmitting(false);
        },
    });

    const handleRegister = () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        setIsSubmitting(true);
        register.mutate({ username, email, password });
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInUp" duration={800} delay={100}>
                <Text style={styles.title}>Đăng ký tài khoản</Text>
                <Text style={styles.subtitle}>Vui lòng điền đầy đủ thông tin bên dưới</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Họ và tên"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#9ca3af"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    placeholderTextColor="#9ca3af"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    placeholderTextColor="#9ca3af"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    placeholderTextColor="#9ca3af"
                />

                <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Tạo tài khoản</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("login")} style={styles.linkWrap}>
                    <Text style={styles.linkText}>← Quay lại màn hình đăng nhập</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );

};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
        paddingHorizontal: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 10,
        borderColor: "#d1d5db",
        borderWidth: 1,
        marginBottom: 16,
        fontSize: 15,
        color: "#111827",
    },
    button: {
        backgroundColor: "#2563eb",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
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
    linkWrap: {
        marginTop: 28,
        alignItems: "center",
    },
    linkText: {
        color: "#2563eb",
        fontSize: 15,
        fontWeight: "500",
    },
});
