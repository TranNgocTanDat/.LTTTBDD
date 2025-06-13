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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "signup">;

const RegisterScreen = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigation = useNavigation<NavigationProp>();

    const register = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            Alert.alert("Đăng ký thành công", "Vui lòng kiểm tra email để xác thực tài khoản.");
            navigation.navigate("verify", { email }); // ✅ truyền đúng kiểu { email: string }
        },
        onError: (error: any) => {
            console.log("API Error detail:", JSON.stringify(error?.response?.data, null, 2));
            Alert.alert("Đăng ký thất bại", error?.response?.data?.message || "Lỗi không xác định");
            setIsSubmitting(false);
        },
    });

    const handleRegister = () => {
        if (!username || !email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        setIsSubmitting(true);
        register.mutate({
            username,
            email,
            password,
        })
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>

            <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Đăng ký</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("login")} style={styles.linkWrap}>
                <Text style={styles.linkText}>← Quay lại đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#2563eb",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    linkWrap: {
        marginTop: 24,
        alignItems: "center",
    },
    linkText: {
        color: "#2563eb",
        fontSize: 14,
    },
});
