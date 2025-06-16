import type { APIResponse } from "@/model/APIResponse";
import type {
  CartItemRequest,
  CartItemResponse,
  CartResponse,
} from "@/model/Cart";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default {
  addToCart: async (request: CartItemRequest): Promise<CartItemResponse> => {
    const token = await AsyncStorage.getItem("authUser");

    const response = await api.post<APIResponse<CartItemResponse>>(
      "/cart-items",
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.result;
  },
  getCart: async (): Promise<CartResponse> => {
    const token = await AsyncStorage.getItem("authUser");

    const response = await api.get<APIResponse<CartResponse>>("/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("giỏ hàng", response);

    return response.result;
  },
  removeItem: async (cartItemId: number): Promise<void> => {
    const token = await AsyncStorage.getItem("authUser");
    await api.delete(`/cart-items/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  },

  incrementQuantity: async (cartItemId: number): Promise<CartItemResponse> => {
    const token = await AsyncStorage.getItem("authUser");
    const response = await api.put<APIResponse<CartItemResponse>>(
      `/cart-items/${cartItemId}/increase`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    
    );
    console.log("Incremented quantity for item:", response);
    return response.result;
  },

  decrementQuantity: async (cartItemId: number): Promise<CartItemResponse> => {
    const token = await AsyncStorage.getItem("authUser");
    const response = await api.put<APIResponse<CartItemResponse>>(
      `/cart-items/${cartItemId}/decrease`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.result;
  },
};
