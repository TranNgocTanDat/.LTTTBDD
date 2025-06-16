import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CheckoutSuccess from "@/components/checkout/CheckoutSuccess";
import { RootStackParamList } from "@/routes/Routers";
import { COLORS, SPACING } from "../../theme/theme";
import { useStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import orderApi from "@/services/orderApi";

type CheckoutRouteProp = RouteProp<RootStackParamList, "checkout">;

const paymentMethods = ["Thanh toán khi nhận hàng", "Thẻ tín dụng", "MOMO"];

const paymentMethodMap: Record<string, string> = {
  "Thanh toán khi nhận hàng": "CASH", // nếu bạn có enum này
  "Thẻ tín dụng": "CREDIT_CARD",
  MOMO: "MOMO",
  PayPal: "PAYPAL",
  "Chuyển khoản": "BANKING",
};

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<CheckoutRouteProp>();
  const { order } = route.params;

  console.log("CheckoutScreen cart:", order.id);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const addNotification = useStore((state: any) => state.addNotification);
  const total = order.totalPrice;
  const discountedTotal = (total * (100 - discount)) / 100;

  const selectPaymentMutation = useMutation({
    mutationFn: (method: string) =>
      orderApi.choosePaymentMethod(order.id, method),
    onSuccess: () => console.log(order.id, "Payment method updated successfully"),
    onError: () =>
      Alert.alert("Lỗi", "Không thể cập nhật phương thức thanh toán."),
  });

  const confirmOrderMutation = useMutation({
    mutationFn: () => orderApi.confirmPayment(order.id),
    onSuccess: () => navigation.replace("success"),
    onError: () => Alert.alert("❌ Lỗi", "Không thể xác nhận đơn hàng."),
  });

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedPayment(method);
    const enumValue = paymentMethodMap[method];
    console.log("Selected method enum:", enumValue);
    if (enumValue) {
      selectPaymentMutation.mutate(enumValue);
    } else {
      console.warn("Method không hợp lệ:", method);
    }
  };

  const handleConfirm = () => {
    if (!name || !address || !phone) {
      Alert.alert(
        "❗ Thiếu thông tin",
        "Vui lòng nhập đầy đủ thông tin giao hàng."
      );
      return;
    }

    addNotification({
      id: String(Math.floor(1000 + Math.random() * 9000)),
      title: "Đặt hàng thành công",
      message: `Đơn hàng trị giá ${discountedTotal.toLocaleString(
        "vi-VN"
      )}đ đã được đặt.`,
      date: new Date().toISOString(),
      read: false,
    });

    confirmOrderMutation.mutate();
  };

  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "SALE10") {
      setDiscount(10);
      Alert.alert("✔️ Áp dụng thành công", "Giảm 10% đơn hàng.");
    } else if (code === "FREESHIP") {
      setDiscount(5);
      Alert.alert("✔️ Áp dụng thành công", "Giảm 5% đơn hàng.");
    } else {
      setDiscount(0);
      Alert.alert("❌ Mã không hợp lệ", "Vui lòng kiểm tra lại.");
    }
  };

  const renderProduct = ({ item }: any) => {
    const totalPerItem = item.totalPrice || item.price * item.quantity;
    return (
      <View style={styles.cartItem}>
        <View>
          <Text style={styles.cartItemText}>
            {item.product?.productName || "Không rõ tên sản phẩm"}
          </Text>
          <Text
            style={[
              styles.cartItemText,
              { fontSize: 14, color: COLORS.primaryGreyHex },
            ]}
          >
            {item.quantity} x {parseFloat(item.price).toLocaleString("vi-VN")}đ
          </Text>
        </View>
        <Text style={[styles.cartItemText, { fontWeight: "600" }]}>
          {totalPerItem.toLocaleString("vi-VN")}đ
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.TopBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={COLORS.primaryBlackHex}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Thanh Toán</Text>

      <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
      <FlatList
        data={order.orderItems}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderProduct}
        scrollEnabled={false}
      />

      <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
      <TextInput
        placeholder="Họ và tên"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Địa chỉ"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        placeholder="Số điện thoại"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.sectionTitle}>Mã giảm giá</Text>
      <View style={styles.promoContainer}>
        <TextInput
          placeholder="Nhập mã"
          style={styles.inputPromo}
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.promoButton} onPress={applyPromoCode}>
          <Text style={styles.promoButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.paymentOption,
            selectedPayment === method && styles.selectedPaymentOption,
          ]}
          onPress={() => handleSelectPaymentMethod(method)}
        >
          <View style={styles.paymentRow}>
            {method === "Thẻ tín dụng" && (
              <Entypo
                name="credit-card"
                size={20}
                color={
                  selectedPayment === method
                    ? COLORS.primaryWhiteHex
                    : COLORS.primaryBlackHex
                }
                style={{ marginRight: 10 }}
              />
            )}
            {method === "MOMO" && (
              <MaterialCommunityIcons
                name="cash"
                size={22}
                color={
                  selectedPayment === method
                    ? COLORS.primaryWhiteHex
                    : COLORS.primaryBlackHex
                }
                style={{ marginRight: 10 }}
              />
            )}
            <Text
              style={{
                color:
                  selectedPayment === method
                    ? COLORS.primaryWhiteHex
                    : COLORS.primaryBlackHex,
              }}
            >
              {method}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng cộng:</Text>
        <Text style={styles.totalAmount}>
          {discountedTotal.toLocaleString("vi-VN")}đ
        </Text>
      </View>
      <Text style={styles.deliveryEstimate}>
        Thời gian giao hàng dự kiến: 3-5 ngày
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận đặt hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: SPACING.space_30,
    paddingTop: 50,
  },
  TopBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.space_15,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryBlackHex,
    marginBottom: SPACING.space_20,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.primaryBlackHex,
  },
  input: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: 10,
    padding: 14,
    marginBottom: SPACING.space_15,
    borderWidth: 1,
    borderColor: COLORS.primaryGreyHex,
  },
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: SPACING.space_15,
  },
  inputPromo: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryGreyHex,
  },
  promoButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  promoButtonText: {
    color: COLORS.primaryWhiteHex,
    fontWeight: "600",
  },
  paymentOption: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryGreyHex,
  },
  selectedPaymentOption: {
    backgroundColor: COLORS.primaryOrangeHex,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.space_20,
    marginBottom: SPACING.space_10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.primaryBlackHex,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryBlackHex,
  },
  deliveryEstimate: {
    fontSize: 14,
    color: COLORS.primaryGreyHex,
    marginBottom: SPACING.space_15,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: SPACING.space_10,
  },
  buttonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 16,
    fontWeight: "600",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cartItemText: {
    fontSize: 16,
    color: COLORS.primaryBlackHex,
  },
});
