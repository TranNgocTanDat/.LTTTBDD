import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
}

const NotificationScreen = () => {
    const navigation = useNavigation();

    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Đơn hàng đã được xác nhận',
            message: 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.',
            timestamp: '10 phút trước',
        },
        {
            id: '2',
            title: 'Mã khuyến mãi mới',
            message: 'Nhập mã SALE10 để được giảm giá 10% đơn hàng.',
            timestamp: '1 giờ trước',
        },
        {
            id: '3',
            title: 'Thông báo hệ thống',
            message: 'Hệ thống sẽ bảo trì vào 00:00 hôm nay.',
            timestamp: 'Hôm qua',
        },
    ]);

    const handleClearAll = () => {
        Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa tất cả thông báo?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: () => setNotifications([]),
            },
        ]);
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={styles.notificationItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.timestamp}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primaryBlackHex} barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearText}>Xóa tất cả</Text>
                </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có thông báo nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </View>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondaryLightGreyHex,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.primaryBlackHex,
        paddingVertical: SPACING.space_15,
        paddingHorizontal: SPACING.space_20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    clearText: {
        color: COLORS.primaryOrangeHex,
        fontWeight: '600',
    },
    notificationItem: {
        backgroundColor: COLORS.primaryWhiteHex,
        marginHorizontal: SPACING.space_20,
        marginVertical: 8,
        padding: 16,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primaryBlackHex,
    },
    notificationMessage: {
        fontSize: 14,
        color: COLORS.primaryGreyHex,
        marginTop: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: COLORS.primaryGreyHex,
        marginTop: 6,
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.primaryGreyHex,
    },
});
