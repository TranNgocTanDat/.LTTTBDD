import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import authApi from "../../services/authApi";

const ForgetPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation();

    const mutation = useMutation({
        mutationFn: authApi.resendVerification,
        onSuccess: () => {
            Alert.alert("Thành công", "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
            navigation.goBack();
        },
        onError: (error: any) => {
            Alert.alert("Thất bại", error?.response?.data?.message || "Có lỗi xảy ra");
            setIsSubmitting(false);
        },
    });

    const handleSubmit = () => {
        if (!email) {
            Alert.alert("Lỗi", "Vui lòng nhập email.");
            return;
        }
        setIsSubmitting(true);
        mutation.mutate(email);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quên mật khẩu</Text>
            <Text style={styles.subtitle}>
                Nhập email bạn đã đăng ký. Chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Gửi liên kết đặt lại</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
                <Text style={styles.linkText}>← Quay lại đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgetPasswordScreen;

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
    backLink: {
        marginTop: 24,
        alignItems: "center",
    },
    linkText: {
        color: "#2563eb",
        fontSize: 14,
    },
});
