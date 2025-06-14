
import {StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {COLORS, FONTFAMILY, FONTSIZE} from '../../theme/theme';
interface CheckoutSuccessProps {
    title: string;
}

const CheckoutSuccess = ({ title, onPress }: { title: string; onPress: () => void }) => {
    return (
        <View style={styles.EmptyCartContainer}>
            <LottieView
                style={styles.LottieStyle}
                source={require('../../lottie/checkoutsucces.json')}
                autoPlay
                loop
            />
            <Text style={styles.LottieText}>{title}</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    EmptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Thêm dòng này để canh giữa ngang
        backgroundColor: '#fff',
        paddingHorizontal: 24,
    },
    LottieStyle: {
        height: 300,
        width: 300,
    },
    LottieText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryOrangeHex,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: COLORS.primaryOrangeHex,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignSelf: 'center', // đảm bảo canh giữa nếu parent không align
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});


export default CheckoutSuccess;
