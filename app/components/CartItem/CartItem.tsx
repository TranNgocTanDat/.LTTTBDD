import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageProps,
    Image,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
    BORDERRADIUS,
    COLORS,
    FONTFAMILY,
    FONTSIZE,
    SPACING,
} from '../../theme/theme';

interface CartItemProps {
    id: string;
    name: string;
    image: ImageProps;
    special_ingredient: string;
    roasted: string;
    prices: {
        size: string;
        price: number;
        quantity: number;
        currency: string;
    }[];
    type: string;
    incrementCartItemQuantityHandler: (id: string, size: string) => void;
    decrementCartItemQuantityHandler: (id: string, size: string) => void;
    removeFromCartHandler: (id: string, size: string) => void;
}

const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};


const CartItem: React.FC<CartItemProps> = ({
                                               id,
                                               name,
                                               image,
                                               special_ingredient,
                                               roasted,
                                               prices,
                                               type,
                                               incrementCartItemQuantityHandler,
                                               decrementCartItemQuantityHandler,
                                               removeFromCartHandler,
                                           }) => {
    return (
        <View>
            {prices.length !== 1 ? (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
                    style={styles.CartItemLinearGradient}>
                    <View style={styles.CartItemRow}>
                        <Image source={image} style={styles.CartItemImage} />
                        <View style={styles.CartItemInfo}>
                            <View>
                                <Text style={styles.CartItemTitle}>{name}</Text>
                                <Text style={styles.CartItemSubtitle}>{special_ingredient}</Text>
                            </View>
                            <View style={styles.CartItemRoastedContainer}>
                                <Text style={styles.CartItemRoastedText}>{roasted}</Text>
                            </View>
                        </View>
                    </View>

                    {prices.map((data, index) => (
                        <View key={index.toString()} style={styles.CartItemSizeRowContainer}>
                            <View style={styles.CartItemSizeValueContainer}>
                                <View style={styles.SizeBox}>
                                    <Text style={[
                                        styles.SizeText,
                                        {
                                            fontSize: type === 'Bean' ? FONTSIZE.size_10 : FONTSIZE.size_10,
                                        }
                                    ]}>
                                        {data.size}
                                    </Text>
                                </View>
                                <Text style={styles.SizeCurrency}>
                                    {data.currency}
                                    <Text style={styles.SizePrice}> {formatPrice(data.price)}</Text>
                                </Text>
                            </View>

                            <View style={styles.CartItemSizeValueContainer}>
                                <TouchableOpacity
                                    style={styles.CartItemIcon}
                                    onPress={() => decrementCartItemQuantityHandler(id, data.size)}>
                                    <Ionicons name="remove" size={FONTSIZE.size_16} color={COLORS.primaryWhiteHex} />
                                </TouchableOpacity>
                                <View style={styles.CartItemQuantityContainer}>
                                    <Text style={styles.CartItemQuantityText}>{data.quantity}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.CartItemIcon}
                                    onPress={() => incrementCartItemQuantityHandler(id, data.size)}>
                                    <Ionicons name="add" size={FONTSIZE.size_16} color={COLORS.primaryWhiteHex} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.CartItemIcon}
                                    onPress={() => removeFromCartHandler(id, data.size)}>
                                    <Ionicons name="trash-bin" size={18} color={COLORS.primaryWhiteHex} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </LinearGradient>
            ) : (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#c5c5c5', '#5c5c5c']}
                    style={styles.CartItemSingleLinearGradient}>
                    <Image source={image} style={styles.CartItemSingleImage} />
                    <View style={styles.CartItemSingleInfoContainer}>
                        <View>
                            <Text style={styles.CartItemTitle}>{name}</Text>
                            <Text style={styles.CartItemSubtitle}>{special_ingredient}</Text>
                        </View>
                        <View style={styles.CartItemSingleSizeValueContainer}>
                            <View style={styles.SizeBox}>
                                <Text style={[
                                    styles.SizeText,
                                    {
                                        fontSize: type === 'Bean' ? FONTSIZE.size_10 : FONTSIZE.size_16,
                                    }
                                ]}>
                                    {prices[0].size}
                                </Text>
                            </View>
                            <Text style={styles.SizeCurrency}>
                                {prices[0].currency}
                                <Text style={styles.SizePrice}> {formatPrice(prices[0].price)}</Text>
                            </Text>

                        </View>

                        <View style={styles.CartItemSingleQuantityContainer}>
                            <TouchableOpacity
                                style={styles.CartItemIcon}
                                onPress={() => decrementCartItemQuantityHandler(id, prices[0].size)}>
                                <Ionicons name="remove" size={FONTSIZE.size_16} color={COLORS.primaryWhiteHex} />
                            </TouchableOpacity>
                            <View style={styles.CartItemQuantityContainer}>
                                <Text style={styles.CartItemQuantityText}>{prices[0].quantity}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.CartItemIcon}
                                onPress={() => incrementCartItemQuantityHandler(id, prices[0].size)}>
                                <Ionicons name="add" size={FONTSIZE.size_16} color={COLORS.primaryWhiteHex} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.CartItemIcon}
                                onPress={() => removeFromCartHandler(id, prices[0].size)}>
                                <Ionicons name="trash-bin" size={18} color={COLORS.primaryWhiteHex} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    CartItemLinearGradient: {
        flex: 1,
        gap: SPACING.space_12,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
    },
    CartItemRow: {
        flexDirection: 'row',
        gap: SPACING.space_12,
        flex: 1,
    },
    CartItemImage: {
        height: 110,
        width: 110,
        borderRadius: BORDERRADIUS.radius_20,
    },
    CartItemInfo: {
        flex: 1,
        paddingVertical: SPACING.space_4,
        justifyContent: 'space-between',
    },
    CartItemTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: "#ffffff",
    },
    CartItemSubtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: "#ffffff",
    },
    CartItemRoastedContainer: {
        height: 50,
        width: 120,
        borderRadius: BORDERRADIUS.radius_15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#000000",
    },
    CartItemRoastedText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_10,
        color: "#ffffff",
    },
    CartItemSizeRowContainer: {
        flex: 1,
        alignItems: 'center',
        gap: SPACING.space_20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    CartItemSizeValueContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    SizeBox: {
        backgroundColor: COLORS.primaryBlackHex,
        height: 30,
        width: 90,
        borderRadius: BORDERRADIUS.radius_10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.secondaryLightGreyHex,

    },
    SizeCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },
    SizePrice: {
        color: COLORS.primaryWhiteHex,
    },
    CartItemIcon: {
        backgroundColor: COLORS.primaryOrangeHex,
        padding: SPACING.space_8,
        borderRadius: BORDERRADIUS.radius_10,
    },
    CartItemQuantityContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        width: 80,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
        borderColor: COLORS.primaryOrangeHex,
        alignItems: 'center',
        paddingVertical: SPACING.space_4,
    },
    CartItemQuantityText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryWhiteHex,
    },
    CartItemSingleLinearGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.space_12,
        gap: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
    },
    CartItemSingleImage: {
        height: 150,
        width: 150,
        borderRadius: BORDERRADIUS.radius_20,
    },
    CartItemSingleInfoContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
    },
    CartItemSingleSizeValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    CartItemSingleQuantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
});

export default CartItem;
