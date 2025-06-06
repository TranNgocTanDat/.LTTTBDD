import type { APIResponse } from "@/model/APIResponse";
import type {
  CartItemRequest,
  CartItemResponse,
  CartResponse,
} from "@/model/Cart";
import api from "./api";

export default {
  addToCart: async (request: CartItemRequest): Promise<CartItemResponse> => {
    const token = localStorage.getItem("token");

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
        const token = localStorage.getItem("token");
    
        const response = await api.get<APIResponse<CartResponse>>("/cart", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        });
    
        return response.result;
    },
};
