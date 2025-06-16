// Model cho sản phẩm trong đơn hàng
export interface OrderItem {
    id: number;           // ID của OrderItem
    productId: number;    // ID sản phẩm
    productName: string;  // Tên sản phẩm
    totalPrice: number;
    img: string   // Giá tại thời điểm mua
}

// Model chính cho đơn hàng
export interface Order {
    id: number;                 // ID đơn hàng
    userId: number;             // ID người dùng đặt hàng
    totalPrice: number;         // Tổng tiền đơn hàng
    status: string;             // Trạng thái đơn hàng (ví dụ: "PENDING", "PAID", ...)
    paymentMethod?: string;     // Hình thức thanh toán (ví dụ: "COD", "MOMO")
    createdAt: string;          // Thời gian tạo đơn (ISO String)
    paymentAt?: string;         // Thời gian thanh toán (ISO String), có thể undefined nếu chưa thanh toán
    orderItems: OrderItem[];    // Danh sách sản phẩm trong đơn hàng
}

// Dữ liệu gửi lên backend khi tạo hoặc cập nhật đơn hàng
export interface OrderRequest {
    paymentMethod?: string;  // Hình thức thanh toán, nếu có
}

// Dữ liệu backend trả về khi lấy chi tiết đơn hàng
export interface OrderResponse {
    id: number;
    userId: number;
    username: string;
    email: string;
    totalPrice: number;
    status: string;
    paymentMethod?: string;
    createdAt: string;
    paymentAt?: string;
    orderItems: OrderItem[];
}

export class PaymentMethodResponse {
}