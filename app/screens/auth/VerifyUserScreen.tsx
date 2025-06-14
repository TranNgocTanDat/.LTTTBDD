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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/routes/Routers";
import authApi from "../../services/authApi";

type Props = NativeStackScreenProps<RootStackParamList, "verify">;

const VerifyUserScreen: React.FC<Props> = ({ navigation, route }) => {
    const [verificationCode, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { email } = route.params;

    const mutation = useMutation({
        mutationFn: authApi.verifyUser,
        onSuccess: () => {
            Alert.alert("Xác thực thành công", "Tài khoản đã được xác thực.");
            navigation.replace("login");
        },
        onError: (error: any) => {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.errors?.join("\n") ||
                "Mã xác thực không hợp lệ hoặc đã hết hạn.";
            Alert.alert("Xác thực thất bại", msg);
            setIsSubmitting(false);
        },
    });

    const handleSubmit = () => {
        if (!verificationCode.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập mã xác thực.");
            return;
        }
        setIsSubmitting(true);
        mutation.mutate({ email, verificationCode });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác thực tài khoản</Text>
            <Text style={styles.subtitle}>
                Vui lòng kiểm tra email <Text style={{ fontWeight: "bold" }}>{email}</Text> và nhập mã xác thực.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Nhập mã xác thực"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setCode}
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Xác thực</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
                <Text style={styles.backText}>← Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VerifyUserScreen;

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
    backText: {
        color: "#2563eb",
        fontSize: 14,
    },
});
