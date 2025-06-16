// import type { Product, ProductResponse } from "./Product";
// import type { User, UserResponse } from "./User";

// export interface Cart{
//     id: number;
//   totalAmount: number;
//   cartItems: CartItem[];
//   // Nếu bạn cần thông tin người dùng trong frontend
//   user?: User;
// }

// export interface CartItem {
//     id: number;
//     totalPrice: number;
//     product: Product;
//     cart: Cart
//   }

// export interface CartResponse {
//     id: number;
//     totalAmount: number;
//     cartItems: CartItemResponse[];
//   }

// export interface CartItemResponse {
//     id: number;
//     totalPrice: number;
//     product: ProductResponse;
//   }

// export interface CartItemRequest {
//     productId: number; // ID của sản phẩm
// }

import type { Product, ProductResponse } from "./Product";
import type { User, UserResponse } from "./User";

// Giỏ hàng của người dùng
export interface Cart {
  id: number;
  totalAmount: number;
  cartItems: CartItem[];
  user?: User;
}

// Item trong giỏ hàng (dùng cho nội bộ nếu cần đầy đủ thông tin)
export interface CartItem {
  id: number;
  totalPrice: number;
  product: Product;
  quantity: number;
  size: string;
  price: number;
  currency: string;
}

// Dữ liệu trả về từ BE khi lấy giỏ hàng
export interface CartResponse {
  id: number;
  totalAmount: number;
  cartItems: CartItemResponse[];
}

// Dữ liệu trả về từ BE cho mỗi item
export interface CartItemResponse {
  id: number;
  totalPrice: number;
  product: ProductResponse;
  quantity: number;
  size: string;
  price: number;
  currency: string;
}

// Dữ liệu gửi lên khi thêm sản phẩm vào giỏ hàng
export interface CartItemRequest {
  productId: number;
  size: string;
  quantity: number;
  price: number;
  currency: string;
}

