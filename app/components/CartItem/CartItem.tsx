import React from 'react';
import {
  StyleSheet,
  Text,
  View,
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
import type { CartItemResponse } from '@/model/Cart';

interface CartItemProps {
  cartItem: CartItemResponse;
  incrementCartItemQuantityHandler: (id: number) => void;
  decrementCartItemQuantityHandler: (id: number) => void;
  removeFromCartHandler: (id: number) => void;
}

const formatPrice = (price: number) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const CartItem: React.FC<CartItemProps> = ({
  cartItem,
  incrementCartItemQuantityHandler,
  decrementCartItemQuantityHandler,
  removeFromCartHandler,
}) => {
  const {
    id,
    totalPrice,
    product,
    size,
    quantity,
    price,
    currency,
  } = cartItem;

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
      style={styles.CartItemContainer}
    >
      <View style={styles.Row}>
        <Image source={{ uri: product.img }} style={styles.Image} />
        <View style={styles.Info}>
          <Text style={styles.Title}>{product.productName}</Text>
          <Text style={styles.Subtitle}>{product.description || 'No description'}</Text>
          <View style={styles.SizeContainer}>
            <Text style={styles.SizeText}>Size: {size}</Text>
          </View>
        </View>
      </View>

      <View style={styles.Footer}>
        <Text style={styles.PriceText}>
          {currency}
          <Text style={styles.PriceAmount}> {formatPrice(totalPrice)}</Text>
        </Text>

        <View style={styles.QuantityControl}>
          <TouchableOpacity
            style={styles.IconButton}
            onPress={() => decrementCartItemQuantityHandler(id)}
          >
            <Ionicons name="remove" size={FONTSIZE.size_16} color={COLORS.primaryWhiteHex} />
          </TouchableOpacity>
          <Text style={styles.QuantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.IconButton}
            onPress={() => incrementCartItemQuantityHandler(id)}
          >
            <Ionicons name="add" size={FONTSIZE.size_16} color={COLORS.primaryWhiteHex} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.IconButton}
            onPress={() => removeFromCartHandler(id)}
          >
            <Ionicons name="trash-bin" size={18} color={COLORS.primaryWhiteHex} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  CartItemContainer: {
    flex: 1,
    padding: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_25,
    marginBottom: SPACING.space_12,
  },
  Row: {
    flexDirection: 'row',
    gap: SPACING.space_12,
    alignItems: 'center',
  },
  Image: {
    width: 100,
    height: 100,
    borderRadius: BORDERRADIUS.radius_20,
  },
  Info: {
    flex: 1,
  },
  Title: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  Subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  SizeContainer: {
    marginTop: SPACING.space_4,
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  Footer: {
    marginTop: SPACING.space_12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  PriceText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryOrangeHex,
  },
  PriceAmount: {
    color: COLORS.primaryWhiteHex,
  },
  QuantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.space_8,
  },
  IconButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    padding: SPACING.space_8,
    borderRadius: BORDERRADIUS.radius_10,
  },
  QuantityText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
});

export default CartItem;
