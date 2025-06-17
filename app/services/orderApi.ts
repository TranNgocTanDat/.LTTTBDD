// src/api/orderApi.ts
import type { APIResponse } from "@/model/APIResponse";
import type { OrderResponse, PaymentMethodResponse } from "@/model/Order";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const orderApi = {
  /**
   * Tạo đơn hàng mới dựa trên giỏ hàng của user hiện tại.
   * Backend tự lấy user từ context, không cần truyền tham số.
   * @returns OrderResponse
   */
  createOrder: async (): Promise<OrderResponse> => {
    try {
      const response = await api.post<OrderResponse>("/orders");
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },


  choosePaymentMethod: async (
    orderId: number,
    paymentMethod: string
  ): Promise<PaymentMethodResponse> => {
    try {
      const response = await api.put<PaymentMethodResponse>(
        `/orders/${orderId}/payment-method`,
        { paymentMethod }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error choosing payment method:", error);
      throw error;
    }
  },

  /**
   * Xác nhận thanh toán cho đơn hàng.
   * @param orderId ID đơn hàng
   * @returns OrderResponse
   */
  confirmPayment: async (orderId: number): Promise<OrderResponse> => {
    try {
      const response = await api.post<OrderResponse>(
        `/orders/${orderId}/confirm-payment`
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw error;
    }
  },

  /**
   * Lấy toàn bộ đơn hàng của user (hoặc tất cả đơn hàng, tùy backend xử lý).
   * @returns Danh sách OrderResponse[]
   */
  getAllOrders: async (): Promise<OrderResponse[]> => {
    const token = await AsyncStorage.getItem("authUser");
    const response = await api.get<APIResponse<OrderResponse[]>>("/orders", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.result;
  },


  getOrderByUser: async (): Promise<OrderResponse[]> => {
    const token = await AsyncStorage.getItem("authUser");
    const response = await api.get<APIResponse<OrderResponse[]>>(
        "/orders/me",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
    );
    return response.result;
  },
};

export default orderApi;
