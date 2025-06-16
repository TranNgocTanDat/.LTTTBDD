import React, { useEffect, useState } from "react";
import {
    View, Text, TextInput, FlatList, TouchableOpacity,
    Modal, Alert, ActivityIndicator, Pressable, Animated, StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import userApi from "@/services/userApi";
import type { UserResponse, UserCreationRequest } from "@/model/User";

const CustomerTab = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState<UserCreationRequest>({
        username: "",
        password: "",
        email: "",
    });

    // Fetch user list
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.getUsers();
            setUsers(data);
        } catch (e) {
            Alert.alert("Lỗi", "Không lấy được danh sách khách hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Open add modal
    const openAddModal = () => {
        setForm({ username: "", password: "", email: "" });
        setModalVisible(true);
    };

    // Save (add user)
    const handleSave = async () => {
        if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
            Alert.alert("Thiếu thông tin", "Nhập đầy đủ Username, Email, Password");
            return;
        }
        try {
            await userApi.addUser({
                username: form.username.trim(),
                password: form.password.trim(),
                email: form.email.trim(),
            });
            setModalVisible(false);
            fetchUsers();
        } catch {
            Alert.alert("Lỗi", "Không lưu được khách hàng");
        }
    };

    // Delete user
    const handleDelete = (id: string) => {
        Alert.alert("Xác nhận xóa", "Bạn chắc chắn muốn xóa khách hàng này?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa", style: "destructive", onPress: async () => {
                    try {
                        await userApi.deleteUser(id);
                        fetchUsers();
                    } catch {
                        Alert.alert("Lỗi", "Không xóa được khách hàng");
                    }
                }
            }
        ]);
    };

    // Search
    const filtered = users.filter(
        u => u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={customerStyles.container}>
            <View style={customerStyles.flexHeader}>
                <Ionicons name="people-outline" size={32} color="#2563eb" style={{ marginRight: 8 }} />
                <Text style={customerStyles.pageTitle}>Quản lý khách hàng</Text>
            </View>
            <TextInput
                placeholder="Tìm kiếm khách hàng (username, email)..."
                placeholderTextColor="#888"
                style={customerStyles.input}
                value={search}
                onChangeText={setSearch}
            />
            <View style={{ flexDirection: "row", paddingHorizontal: 8, marginBottom: 4 }}>
                <Text style={[customerStyles.th, { flex: 1 }]}>Username</Text>
                <Text style={[customerStyles.th, { flex: 1 }]}>Email</Text>
                <Text style={[customerStyles.th, { width: 85 }]}>Hành động</Text>
            </View>
            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => (
                        <Pressable
                            style={({ pressed }) => [
                                customerStyles.tableRow,
                                { backgroundColor: pressed ? "#e0e7ff" : index % 2 === 0 ? "#f6f8fa" : "#f1f5f9" },
                                { elevation: pressed ? 2 : 0 }
                            ]}
                        >
                            <Text style={{ flex: 1, fontWeight: "bold" }}>{item.username}</Text>
                            <Text style={{ flex: 1 }}>{item.email}</Text>
                            <View style={customerStyles.actionCell}>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={customerStyles.iconBtn}>
                                    <Ionicons name="trash" size={20} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 18, color: "#666" }}>Không có khách hàng nào</Text>}
                />
            )}
            <TouchableOpacity style={customerStyles.addBtn} onPress={openAddModal} activeOpacity={0.8}>
                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                <Text style={customerStyles.addBtnText}>Thêm khách hàng</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={customerStyles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Animated.View style={customerStyles.modalBox}>
                        <Text style={customerStyles.modalTitle}>Thêm khách hàng</Text>
                        <TextInput
                            placeholder="Tên đăng nhập"
                            placeholderTextColor="#888"
                            value={form.username}
                            onChangeText={text => setForm(f => ({ ...f, username: text }))}
                            style={customerStyles.input}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#888"
                            value={form.email}
                            onChangeText={text => setForm(f => ({ ...f, email: text }))}
                            style={customerStyles.input}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#888"
                            value={form.password}
                            secureTextEntry
                            onChangeText={text => setForm(f => ({ ...f, password: text }))}
                            style={customerStyles.input}
                        />
                        <View style={customerStyles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[customerStyles.modalBtn, { backgroundColor: "#e5e7eb" }]}>
                                <Text style={{ color: "#222" }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={[customerStyles.modalBtn, { backgroundColor: "#2563eb" }]}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Thêm</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Pressable>
            </Modal>
        </View>
    );
};
export default CustomerTab;
const customerStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9fafb",
    },
    flexHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e293b",
    },
    input: {
        backgroundColor: "#f3f4f6",
        borderRadius: 7,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    th: {
        fontWeight: "700",
        color: "#374151",
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 6,
        marginBottom: 3,
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    actionCell: {
        flexDirection: "row",
        width: 80,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    iconBtn: {
        marginHorizontal: 4,
        padding: 5,
        borderRadius: 6,
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginTop: 18,
        alignSelf: "flex-start",
        elevation: 2,
    },
    addBtnText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 7,
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 22,
        width: 340,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 14,
        color: "#1e293b",
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 18,
    },
    modalBtn: {
        borderRadius: 7,
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginLeft: 10,
    },
});
