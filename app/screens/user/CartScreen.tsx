import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/store";
import { COLORS, SPACING } from "../../theme/theme";
import EmptyListAnimation from "../../components/EmtyListAnimation/EmtyListAnimation";
import CartItem from "../../components/CartItem/CartItem";
import PaymentFooter from "../../components/PaymentFooter/PaymentFooter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CartResponse } from "@/model/Cart";
import cartApi from "@/services/cartApi";
import { setCartItems } from "@/redux/cartSlice";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/routes/Routers";
import orderApi from "@/services/orderApi";

const CartScreen = ({ navigation }: any) => {


  const dispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cart.cart);
  const items = cartState?.cartItems || [];

  // Lấy giỏ hàng từ API
  const { data: cart } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    refetchOnWindowFocus: false,
  });

  const createOrderMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: (data) => {
      console.log("Order created successfully:", data)
      navigation.push("checkout", { order: data });
    },
    onError: (error) => {
      console.error("Tạo đơn hàng thất bại:", error);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
    }
  });

  useEffect(() => {
    if (cart) {
      dispatch(setCartItems(cart));
    }
  }, [cart, dispatch]);

    const handlePayment = () => {
        createOrderMutation.mutate();
    };



  const incrementHandler = async (id: number) => {
    await cartApi.incrementQuantity(id);
    const result = await cartApi.getCart();
    dispatch(setCartItems(result)); // Cập nhật redux luôn
  };

  const decrementHandler = async (id: number) => {
    await cartApi.decrementQuantity(id);
    const result = await cartApi.getCart();
    dispatch(setCartItems(result));
  };
    const removeFromCart = async (id: number) => {
        await cartApi.removeItem(id);
        const result = await cartApi.getCart();
        dispatch(setCartItems(result));
    };

  return (
    <View style={styles.container}>
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

      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Giỏ hàng</Text>
        <Text style={styles.screenNameParagraph}>
          Kiểm tra lại sản phẩm trước khi thanh toán
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        style={styles.bodyContainer}
      >
        {items.length === 0 ? (
          <EmptyListAnimation title={"Giỏ hàng trống"} />
        ) : (
          <View style={styles.cartItemsContainer}>
            {items.map((item) => (
              <CartItem
                key={`${item.id}-${item.size}`}
                cartItem={item}
                incrementCartItemQuantityHandler={() =>
                  incrementHandler(item.id)
                }
                decrementCartItemQuantityHandler={() =>
                  decrementHandler(item.id)
                }
                removeFromCartHandler={() => removeFromCart(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {cart && (
        <PaymentFooter
          buttonPressHandler={handlePayment}
          buttonTitle="Thanh toán"
          cart={cart}
        />
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: SPACING.space_20,
    paddingTop: 50,
    paddingBottom: 80,
  },
  TopBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.space_15,
  },
  screenNameContainer: {
    marginBottom: SPACING.space_10,
  },
  screenNameText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryBlackHex,
    letterSpacing: 0.3,
  },
  screenNameParagraph: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.primaryGreyHex,
  },
  bodyContainer: {
    flex: 1,
  },
  cartItemsContainer: {
    paddingTop: SPACING.space_10,
    gap: SPACING.space_15,
  },
});
