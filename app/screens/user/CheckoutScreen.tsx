import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING } from '../../theme/theme';
import { useStore } from '../../store/store';


import CheckoutSuccess from "@/components/checkout/CheckoutSuccess";

const paymentMethods = ['Thanh toán khi nhận hàng', 'Thẻ tín dụng', 'MoMo'];

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { amount } = route.params as { amount: string };
    const [confirmed, setConfirmed] = useState(false);

    const CartList = useStore((state: any) => state.CartList);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const total = parseFloat(amount);
    const discountedTotal = (total * (100 - discount)) / 100;

    const applyPromoCode = () => {
        const code = promoCode.trim().toUpperCase();
        if (code === 'SALE10') {
            setDiscount(10);
            Alert.alert('Áp dụng mã thành công', 'Đã giảm 10% tổng đơn.');
        } else if (code === 'FREESHIP') {
            setDiscount(5);
            Alert.alert('Áp dụng mã thành công', 'Đã giảm 5% tổng đơn.');
        } else {
            setDiscount(0);
            Alert.alert('Mã không hợp lệ', 'Vui lòng kiểm tra lại mã giảm giá.');
        }
    };



    const handleConfirm = () => {
        if (!name || !address || !phone) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin giao hàng.');
            return;
        }else
            setConfirmed(true);

    };
    if (confirmed) {
        return <CheckoutSuccess title="Đặt hàng thành công" onPress={() => navigation.goBack()}/>;
    }

    const renderProduct = ({ item }: any) => {
        const totalPerItem = item.prices
            .map((p: any) => parseFloat(p.price) * p.quantity)
            .reduce((a: number, b: number) => a + b, 0);

        return (
            <View style={styles.cartItem}>
                <Text style={styles.cartItemText}>{item.name}</Text>
                <Text style={styles.cartItemText}>
                    {parseFloat(totalPerItem.toString()).toLocaleString('vi-VN', {
                        maximumFractionDigits: 0,
                    })}đ
                </Text>

            </View>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} />

            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-circle-outline"
                        size={30}
                        color={COLORS.primaryWhiteHex}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Thanh Toán</Text>

            <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
            <FlatList
                data={CartList}
                keyExtractor={(item) => item.id}
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
                placeholder="Địa chỉ giao hàng"
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
                    placeholder="Nhập mã giảm giá"
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
                    onPress={() => setSelectedPayment(method)}
                >
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
                </TouchableOpacity>
            ))}

            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng cộng:</Text>
                <Text style={styles.totalAmount}>
                    {parseFloat(discountedTotal.toString()).toLocaleString('vi-VN', {
                        maximumFractionDigits: 0,
                    })}đ
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
        backgroundColor: COLORS.secondaryLightGreyHex,
        padding: SPACING.space_30,
        paddingTop: 50,
    },
    TopBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.space_15,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.primaryBlackHex,
        marginBottom: SPACING.space_20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
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
        flexDirection: 'row',
        alignItems: 'center',
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
        fontWeight: '600',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.space_20,
        marginBottom: SPACING.space_10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.primaryBlackHex,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primaryBlackHex,
    },
    deliveryEstimate: {
        fontSize: 14,
        color: COLORS.primaryGreyHex,
        marginBottom: SPACING.space_15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: COLORS.primaryOrangeHex,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: SPACING.space_10,
    },
    buttonText: {
        color: COLORS.primaryWhiteHex,
        fontSize: 16,
        fontWeight: '600',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    cartItemText: {
        fontSize: 16,
        color: COLORS.primaryBlackHex,
    },
});

