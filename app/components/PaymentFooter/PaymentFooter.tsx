import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../../theme/theme";
import { CartResponse } from "@/model/Cart";

interface PaymentFooterProps {
  cart: CartResponse;
  buttonPressHandler: any;
  buttonTitle: string;
}

const PaymentFooter: React.FC<PaymentFooterProps> = ({
  cart,
  buttonPressHandler,
  buttonTitle,
}) => {
  return (
    <View style={styles.PriceFooter}>
      <View style={styles.PriceContainer}>
        <Text style={styles.PriceTitle}>Tổng cộng</Text>
        <Text style={styles.PriceText}>{cart.totalAmount}</Text>
        <Text style={styles.CurrencyText}>VND</Text>
      </View>
      <TouchableOpacity
        style={styles.PayButton}
        onPress={() => buttonPressHandler()}
      >
        <Text style={styles.ButtonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  PriceFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryGreyHex,
  },
  PriceContainer: {
    justifyContent: "center",
  },
  PriceTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    marginBottom: 4,
  },
  PriceText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryBlackHex,
  },
  CurrencyText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryGreyHex,
  },
  PayButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: BORDERRADIUS.radius_20,
  },
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
});

export default PaymentFooter;
