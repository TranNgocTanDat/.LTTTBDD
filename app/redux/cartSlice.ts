// redux/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItemResponse, CartResponse } from "@/model/Cart";

interface CartState {
  items: CartItemResponse[];
  cart: CartResponse | null;
}

const initialState: CartState = {
  items: [],
  cart: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<CartItemResponse>) => {
      const item = action.payload;
      const existing = state.items.find(
        (i) => i.product.productId === item.product.productId
      );

      if (existing) {
        existing.totalPrice += item.totalPrice;
      } else {
        state.items.push(item);
      }
    },
    removeCartItem: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state.cart) {
        state.cart.cartItems = state.cart.cartItems.filter((i) => i.id !== productId);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.cart = null;
    },
    setCartItems: (state, action: PayloadAction<CartResponse>) => {
      state.cart = action.payload;
    },
  },
});

export const { addCartItem, removeCartItem, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
