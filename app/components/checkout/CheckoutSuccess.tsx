import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import { COLORS, FONTFAMILY, FONTSIZE } from '../../theme/theme';

interface CheckoutSuccessProps {
    title: string;
    onPress: () => void;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ title, onPress }) => {
    const [showTextAndButton, setShowTextAndButton] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowTextAndButton(true);
        }, 2000); // 1s delay

        return () => clearTimeout(timeout); // cleanup
    }, []);

    return (
        <View style={styles.EmptyCartContainer}>
            <LottieView
                style={styles.LottieStyle}
                source={require('../../lottie/checkoutsucces.json')}
                autoPlay
                loop
            />
            {showTextAndButton && (
                <>
                    <Text style={styles.LottieText}>{title}</Text>
                    <TouchableOpacity style={styles.button} onPress={onPress}>
                        <Text style={styles.buttonText}>Quay lại</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    EmptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        alignSelf: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CheckoutSuccess;
