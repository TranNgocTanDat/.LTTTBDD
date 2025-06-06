import api from "./api";
import type {
  UserCreationRequest,
  UserResponse,
  UserUpdateRequest,
} from "@/model/User";
import type { APIResponse } from "@/model/APIResponse";


export default {
  // getUsers: () => api.get<APIResponse<UserResponse[]>>("/users"),
  // addUser: (user: UserCreationRequest) => api.post<UserResponse>("/users", user),
  // updateUser: (id: string, user: UserUpdateRequest) => api.put<UserResponse>(`/users/${id}`, user),

  getUsers: async (): Promise<UserResponse[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<APIResponse<UserResponse[]>>("/users", {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
      withCredentials: true,
    });
    console.log(response);
    return response.result; // Trả về mảng người dùng từ `result`
  },

  getMyInfo: async (): Promise<UserResponse> => {
    const token = localStorage.getItem("token");  // Lấy token từ localStorage

    const response = await api.get<APIResponse<UserResponse>>(`/users/myInfo`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Đảm bảo token được gửi chính xác
      },
      withCredentials: true,
    });

    if (response.code === 401) {
      alert("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
      localStorage.removeItem("token");  // Xóa token khi không hợp lệ
      window.location.href = "/login";  // Chuyển hướng về trang đăng nhập
    }
    console.log(response);
    return response.result;  // Trả về dữ liệu người dùng
  },

  addUser: async (user: UserCreationRequest): Promise<UserResponse> => {
    const response = await api.post<APIResponse<UserResponse>>("/auth/signup", user);
    console.log(response);
    return response.result; // Trả về người dùng đã được tạo
  },

  updateUser: async (
    id: string,
    user: UserUpdateRequest
  ): Promise<UserResponse> => {
    const response = await api.put<APIResponse<UserResponse>>(
      `/users/${id}`,
      user
    );
    return response.data.result; // Trả về người dùng đã được cập nhật
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
