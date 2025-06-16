import React, { useEffect, useState } from "react";

import {
    View, Text, StyleSheet, TouchableOpacity, Animated,
    ActivityIndicator, Modal, TextInput, FlatList, Alert, Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductApi from "@/services/productApi";
import CategoryApi from "@/services/categoryApi";
import { ProductRequest, ProductResponse } from "@/model/Product";
import { Category } from "@/model/Category";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/routes/Routers';

import CustomerTab  from "@/admin/components/CustomerTab";

const tabs = [
    { label: "Tổng quan", key: "overview", icon: "bar-chart" },
    { label: "Sản phẩm", key: "seafood", icon: "fish-outline" },
    { label: "Đơn hàng", key: "orders", icon: "cube-outline" },
    { label: "Khách hàng", key: "customers", icon: "people-outline" },
];

const orders = [
    { id: "DH001", status: "Đang xử lý", amount: 500000 },
    { id: "DH002", status: "Hoàn tất", amount: 1200000 },
    { id: "DH003", status: "Đã hủy", amount: 750000 },
];

const customers = [
    { id: "1", name: "Nguyễn Văn A", type: "Khách VIP" },
    { id: "2", name: "Trần Thị B", type: "Mới đăng ký" },
    { id: "3", name: "Phạm C", type: "Đã mua 10 lần" },
];

const AdminDashboardScreen = () => {
    const [selectedTab, setSelectedTab] = useState("overview");
    const [fadeAnim] = useState(new Animated.Value(1));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    // Sản phẩm & danh mục
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal form
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
    const [form, setForm] = useState<{
        productName: string;
        description: string;
        price: string;
        stock: string;
        img: string;
        cate_ID: number;
    }>({
        productName: "",
        description: "",
        price: "",
        stock: "",
        img: "",
        cate_ID: 0,
    });
    const handleLogout = async () => {
        // Xóa token/session nếu có
        await AsyncStorage.removeItem("access_token"); // hoặc key bạn lưu token
        setSidebarOpen(false); // đóng menu
        navigation.reset({
            type: "stack",
            index: 0,
            routes: [{ name: "login" }]
        });
    };
    // Lấy sản phẩm và danh mục
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await ProductApi.getProducts(100, 0);
            setProducts(data);
        } catch {
            Alert.alert("Lỗi", "Không lấy được sản phẩm");
        } finally {
            setLoading(false);
        }
    };
    const fetchCategories = async () => {
        try {
            const data = await CategoryApi.getCategories();
            setCategories(data);
        } catch {
            Alert.alert("Lỗi", "Không lấy được danh mục");
        }
    };
    useEffect(() => {
        if (selectedTab === "seafood") {
            fetchProducts();
            fetchCategories();
        }
    }, [selectedTab]);

    // Xử lý form
    const openEditModal = (product: ProductResponse) => {
        // Mapping categoryName sang cate_ID (vì ProductResponse không có cate_ID)
        const cat = categories.find(c => c.name === product.categoryName);
        setEditingProduct(product);
        setForm({
            productName: product.productName,
            price: product.price ? String(product.price) : "",
            cate_ID: cat?.cate_ID ?? 0,
            description: product.description ?? "",
            stock: product.stock?.toString() ?? "0",
            img: product.img ?? "",
        });
        setModalVisible(true);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setForm({
            productName: "",
            price: "",
            cate_ID: categories.length > 0 ? categories[0].cate_ID : 0,
            description: "",
            stock: "",
            img: "",       // BẮT BUỘC phải là ""
        });
        console.log("Form add:", {
            productName: "",
            price: "",
            cate_ID: categories.length > 0 ? categories[0].cate_ID : 0,
            description: "",
            stock: "",
            img: "",
        });
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!form.productName.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tên sản phẩm!");
            return;
        }
        if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
            Alert.alert("Thiếu thông tin", "Giá sản phẩm phải là số lớn hơn 0!");
            return;
        }
        if (!form.stock.trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
            Alert.alert("Thiếu thông tin", "Tồn kho phải là số, không nhỏ hơn 0!");
            return;
        }
        if (!form.cate_ID || !categories.some(c => c.cate_ID === form.cate_ID)) {
            Alert.alert("Thiếu thông tin", "Vui lòng chọn danh mục hợp lệ!");
            return;
        }

        const productRequest: ProductRequest = {
            productName: form.productName,
            description: form.description ?? "",
            price: Number(form.price),
            stock: Number(form.stock) || 1,
            img: form.img ?? "",
            cate_ID: form.cate_ID,
        };

        try {
            if (editingProduct) {
                await ProductApi.updateProduct(editingProduct.productId, productRequest);
            } else {
                await ProductApi.createProduct(productRequest);
            }
            setModalVisible(false);
            fetchProducts();
        } catch {
            Alert.alert("Lỗi", "Không lưu được sản phẩm");
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert("Xác nhận xóa", "Bạn chắc chắn muốn xóa sản phẩm này?", [
            { text: "Hủy", style: "cancel" },
            { text: "Xóa", style: "destructive", onPress: async () => {
                    try {
                        await ProductApi.deleteProduct(id);
                        fetchProducts();
                    } catch {
                        Alert.alert("Lỗi", "Không xóa được sản phẩm!");
                    }
                }},
        ]);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Hoàn tất":
                return { color: "#22c55e", backgroundColor: "#dcfce7" };
            case "Đã hủy":
                return { color: "#ef4444", backgroundColor: "#fee2e2" };
            default:
                return { color: "#f59e42", backgroundColor: "#fef9c3" };
        }
    };

    const onTabChange = (key: string) => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
            setSelectedTab(key);
            Animated.timing(fadeAnim, { toValue: 1, duration: 170, useNativeDriver: true }).start();
        });
    };

    // ------ MENU 3 GẠCH (HAMBURGER) ------
    const renderMenuModal = () => (
        <Modal
            visible={sidebarOpen}
            animationType="fade"
            transparent
            onRequestClose={() => setSidebarOpen(false)}
        >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSidebarOpen(false)}>
                <View style={styles.menuBox}>
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.menuTabBtn, selectedTab === tab.key && styles.activeTab]}
                            onPress={() => {
                                setSidebarOpen(false);
                                onTabChange(tab.key);
                            }}
                        >
                            <Ionicons
                                name={tab.icon as any}
                                size={22}
                                color={selectedTab === tab.key ? "#2563eb" : "#64748b"}
                                style={{ marginRight: 12 }}
                            />
                            <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {/* Nút Đăng xuất đặt ở cuối menu */}
                    <TouchableOpacity
                        style={[
                            styles.menuTabBtn,
                            { justifyContent: "flex-start", borderTopWidth: 1, borderTopColor: "#e5e7eb", marginTop: 10 }
                        ]}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={22} color="#ef4444" style={{ marginRight: 12 }} />
                        <Text style={[styles.tabText, { color: "#ef4444" }]}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );


    // ------ GIAO DIỆN TỪNG TAB ------
    const renderSeafoodTab = () => (
        <View style={{ flex: 1 }}>
            <View style={styles.flexHeader}>
                <Ionicons name="fish-outline" size={32} color="#0ea5e9" style={{ marginRight: 8 }} />
                <Text style={styles.pageTitle}>Quản lý sản phẩm</Text>
            </View>
            <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>Tên sản phẩm</Text>
                <Text style={[styles.th, { flex: 1 }]}>Giá</Text>
                <Text style={[styles.th, { flex: 1.2 }]}>Danh mục</Text>
                <Text style={[styles.th, { width: 75, textAlign: "center" }]}>Hành động</Text>
            </View>
            {loading ? <ActivityIndicator style={{ marginTop: 24 }} /> : (
                <FlatList
                    data={products}
                    keyExtractor={item => item.productId.toString()}
                    renderItem={({ item, index }) => (
                        <Pressable
                            style={({ pressed }) => [
                                styles.tableRow,
                                { backgroundColor: pressed ? "#e0e7ff" : index % 2 === 0 ? "#f6f8fa" : "#f1f5f9" },
                                { elevation: pressed ? 3 : 0 }
                            ]}
                        >
                            <Text style={{ flex: 2, paddingVertical: 8 }}>{item.productName}</Text>
                            <Text style={{ flex: 1 }}>{item.price?.toLocaleString("vi-VN")}đ</Text>
                            <Text style={{ flex: 1.2 }}>{item.categoryName}</Text>
                            <View style={styles.actionCell}>
                                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
                                    <Ionicons name="pencil" size={20} color="#0ea5e9" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.productId)} style={styles.iconBtn}>
                                    <Ionicons name="trash" size={20} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    )}
                    contentContainerStyle={{ paddingBottom: 18 }}
                />
            )}
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal} activeOpacity={0.8}>
                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                <Text style={styles.addBtnText}>Thêm sản phẩm</Text>
            </TouchableOpacity>
            {/* Modal thêm/sửa */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Animated.View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</Text>
                        <TextInput
                            placeholder="Tên sản phẩm"
                            value={form.productName}
                            onChangeText={text => setForm(f => ({ ...f, productName: text }))}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Mô tả"
                            value={form.description}
                            onChangeText={text => setForm(f => ({ ...f, description: text }))}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Giá"
                            value={form.price ?? ""}
                            placeholderTextColor="#888"
                            onChangeText={text => setForm(f => ({ ...f, price: text }))}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Tồn kho"
                            value={form.stock}
                            placeholderTextColor="#888"
                            onChangeText={text => setForm(f => ({ ...f, stock: text }))}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Link ảnh"
                            placeholderTextColor="#888"
                            value={form.img}
                            onChangeText={text => setForm(f => ({ ...f, img: text }))}
                            style={styles.input}
                        />


                        {/* Danh mục chọn ngang, bấm để chọn */}
                        <View style={[styles.input, { flexDirection: "row", alignItems: "center", backgroundColor: "#fff" }]}>
                            <Text style={{ marginRight: 12 }}>Danh mục:</Text>
                            <FlatList
                                data={categories}
                                horizontal
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        key={item.cate_ID}
                                        style={{
                                            backgroundColor: form.cate_ID === item.cate_ID ? "#2563eb" : "#f1f5f9",
                                            borderRadius: 6,
                                            marginRight: 8,
                                            paddingHorizontal: 10,
                                            paddingVertical: 5,
                                        }}
                                        onPress={() => setForm(f => ({ ...f, cate_ID: item.cate_ID }))}
                                    >
                                        <Text style={{
                                            color: form.cate_ID === item.cate_ID ? "#fff" : "#0f172a",
                                            fontWeight: form.cate_ID === item.cate_ID ? "bold" : "normal",
                                        }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.cate_ID.toString()}
                                showsHorizontalScrollIndicator={false}
                                style={{ flex: 1 }}
                            />
                        </View>
                        {/* Nút hành động */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalBtn, { backgroundColor: "#e5e7eb" }]}>
                                <Text style={{ color: "#222" }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={[styles.modalBtn, { backgroundColor: "#0ea5e9" }]}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>{editingProduct ? "Lưu" : "Thêm"}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Pressable>
            </Modal>
        </View>
    );

    // Nội dung các tab còn lại
    const renderContent = () => {
        switch (selectedTab) {
            case "overview":
                return (
                    <>
                        <View style={styles.rowCenter}>
                            <Text style={styles.pageTitle}>📊 Tổng quan</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Doanh thu hôm nay:</Text>
                            <Text style={styles.cardValue}>12.500.000đ</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Đơn hàng mới:</Text>
                            <Text style={styles.cardValue}>32</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Khách hàng mới:</Text>
                            <Text style={styles.cardValue}>5</Text>
                        </View>
                    </>
                );
            case "seafood":
                return renderSeafoodTab();
            case "orders":
                return (
                    <>
                        <View style={styles.rowCenter}>
                            <Text style={styles.pageTitle}>📦 Quản lý đơn hàng</Text>
                        </View>
                        {orders.map((item) => {
                            const statusStyle = getStatusStyle(item.status);
                            return (
                                <View key={item.id} style={styles.itemRow}>
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.orderId}>#{item.id}</Text>
                                        <Text style={[styles.status, { color: statusStyle.color, backgroundColor: statusStyle.backgroundColor }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                    <Text style={styles.amount}>
                                        {item.amount.toLocaleString("vi-VN")}đ
                                    </Text>
                                </View>
                            );
                        })}
                    </>
                );
            case "customers":
                return (
                    <CustomerTab/>
                );
            default:
                return null;
        }

};
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
            {/* Nút menu nổi ở trên cùng bên trái, nằm trong SafeArea */}
            <View style={styles.topMenuWrapper}>
                <TouchableOpacity style={styles.menuBtn} onPress={() => setSidebarOpen(true)}>
                    <Ionicons name="menu" size={32} color="#0ea5e9" />
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {renderContent()}
            </Animated.View>
            {renderMenuModal()}
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 54,   // Tăng lên 54 hoặc 64 để tránh camera
    },
    topMenuWrapper: {
        position: "absolute",
        top: 32,      // Hoặc 24, 28 tùy ý, càng lớn càng xuống dưới
        left: 16,
        zIndex: 99,
    },
    topBar: {
        flexDirection: "row", alignItems: "center", height: 54, backgroundColor: "#fff",
        elevation: 2, shadowColor: "#000", shadowOpacity: 0.03,
    },
    topBarTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 16,
        color: "#0ea5e9",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.17)",
        justifyContent: "center",
        alignItems: "center",
    },
    menuBox: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 18,
        minWidth: 240,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.13,
        alignItems: "stretch",
    },
    menuTabBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 13,
        paddingHorizontal: 22,
        borderRadius: 9,
        marginBottom: 6,
    },
    activeTab: {
        backgroundColor: "#e0e7ff",
    },
    tabText: {
        fontSize: 17,
        color: "#374151",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#2563eb",
        fontWeight: "bold",
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e293b",
    },
    card: {
        backgroundColor: "#fef9c3",
        padding: 18,
        borderRadius: 14,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#856404",
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#d97706",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f3f4f6",
        borderRadius: 7,
        paddingVertical: 7,
        paddingHorizontal: 8,
        marginBottom: 5,
    },
    th: {
        fontWeight: "700", color: "#374151",
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 6,
        marginBottom: 3,
        paddingHorizontal: 8,
    },
    actionCell: {
        flexDirection: "row",
        width: 75,
        justifyContent: "center",
        alignItems: "center",
    },
    iconBtn: {
        marginHorizontal: 2,
        padding: 4,
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0ea5e9",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 22,
        alignSelf: "flex-start",
        elevation: 2,
    },
    addBtnText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 7,
        fontSize: 15,
    },
    modalBox: {
        backgroundColor: "#fff", borderRadius: 14, padding: 22, width: 340,
        shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
    },
    modalTitle: {
        fontSize: 18, fontWeight: "bold", marginBottom: 14, color: "#1e293b",
    },
    input: {
        backgroundColor: "#f3f4f6",
        borderRadius: 7,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 18,
    },
    modalBtn: {
        borderRadius: 7, paddingHorizontal: 18, paddingVertical: 10,
        marginLeft: 10,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#f1f5f9",
        borderRadius: 9,
        marginBottom: 8,
    },
    orderId: {
        fontWeight: "bold",
        color: "#0f172a",
        fontSize: 15,
        marginRight: 10,
    },
    status: {
        fontSize: 13,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        overflow: "hidden",
        marginRight: 6,
    },
    amount: {
        minWidth: 90,
        textAlign: "right",
        color: "#334155",
        fontWeight: "bold",
        fontSize: 15,
    },
    customerName: {
        fontWeight: "bold",
        color: "#0f172a",
        fontSize: 15,
        flex: 1,
    },
    customerType: {
        color: "#64748b",
        fontSize: 13,
        flex: 1,
    },
    flexHeader: {
        flexDirection: "row", alignItems: "center", marginBottom: 12,
    },

    menuBtn: {
        backgroundColor: "#fff",
        borderRadius: 28,
        padding: 14,
        elevation: 6,
        shadowColor: "#222",
        shadowOpacity: 0.10,
        shadowRadius: 9,
        shadowOffset: { width: 0, height: 2 },
    },
});

export default AdminDashboardScreen;
