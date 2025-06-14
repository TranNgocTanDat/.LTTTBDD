import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/routes/Routers";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

type Props = NativeStackScreenProps<RootStackParamList, "oauth2redirect">;

const OAuth2RedirectScreen: React.FC<Props> = ({ route, navigation }) => {
    const { token } = route.params;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Gọi API lấy user info từ token nếu cần (nếu token không chứa user)
                const res = await fetch("http://localhost:8080/users/myInfo", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const user = await res.json();

                // Lưu redux
                dispatch(loginSuccess({ token, userResponse: user }));
                navigation.replace("tab", user);
            } catch (err) {
                Alert.alert("Lỗi", "Không thể xác thực người dùng.");
                navigation.replace("login");
            }
        };

        fetchUser();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default OAuth2RedirectScreen;
