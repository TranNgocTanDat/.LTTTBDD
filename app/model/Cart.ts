import type { Product, ProductResponse } from "./Product";
import type { User, UserResponse } from "./User";

export interface Cart{
    id: number;
  totalAmount: number;
  cartItems: CartItem[];
  // Nếu bạn cần thông tin người dùng trong frontend
  user?: User;
}

export interface CartItem {
    id: number;
    totalPrice: number;
    product: Product;
    cart: Cart
  }

export interface CartResponse {
    id: number;
    totalAmount: number;
    cartItems: CartItemResponse[];
  }

export interface CartItemResponse {
    id: number;
    totalPrice: number;
    product: ProductResponse;
  }

export interface CartItemRequest {
    productId: number; // ID của sản phẩm
}

