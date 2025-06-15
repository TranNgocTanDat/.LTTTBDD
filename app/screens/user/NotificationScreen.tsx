import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../../theme/theme';
import { useStore } from '../../store/store';

const NotificationScreen = () => {
    const navigation = useNavigation<any>();
    const NotificationList = useStore((state) => state.NotificationList);
    const clearAllNotifications = useStore((state) => state.clearAllNotifications);
    const markNotificationAsRead = useStore((state) => state.markNotificationAsRead);
    const handleClearAll = () => {
        if (NotificationList.length === 0) return;
        Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa tất cả thông báo?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: () => clearAllNotifications(),
            },
        ]);
    };

    const formatTime = (isoString: string | undefined | null) => {
        if (!isoString) return 'Không rõ thời gian';

        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Không rõ thời gian';

        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };



    const renderItem = ({ item }: { item: typeof NotificationList[0] }) => (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                item.read && { backgroundColor: COLORS.primaryGreyHex + '20' },
            ]}
            onPress={() => {
                if (!item.read) markNotificationAsRead(item.id);
            }}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{formatTime(item.date)}</Text>
                <Text style={[styles.readStatus, { color: item.read ? 'green' : 'red' }]}>
                    {item.read ? 'Đã đọc' : 'Chưa đọc'}
                </Text>
            </View>
        </TouchableOpacity>
    );



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.primaryOrangeHex} barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearText}>Xóa tất cả</Text>
                </TouchableOpacity>
            </View>

            {NotificationList.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có thông báo nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={NotificationList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </SafeAreaView>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhiteHex,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.primaryOrangeHex,
        paddingVertical: SPACING.space_15,
        paddingHorizontal: SPACING.space_20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    clearText: {
        color: COLORS.primaryWhiteHex,
        fontWeight: '600',
    },
    notificationItem: {
        backgroundColor: COLORS.primaryWhiteHex,
        marginHorizontal: SPACING.space_20,
        marginVertical: 8,
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
    notificationItemRead: {
        backgroundColor: COLORS.primaryGreyHex + '20',
    },
    readStatus: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: 'bold',
    },


});
