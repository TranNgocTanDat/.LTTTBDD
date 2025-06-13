import {
    AuthenticationRequest,
    AuthenticationResponse,
    VerifyUserRequest
} from "@/model/Authentication";
import type { APIResponse } from "@/model/APIResponse";
import api from "./api";

export default {
    /**
     * Đăng nhập tài khoản
     */
    login: async (
        request: AuthenticationRequest
    ): Promise<AuthenticationResponse> => {
        const response = await api.post<APIResponse<AuthenticationResponse>>(
            "/auth/login",
            request,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );

        if (!response.result.authenticated) {
            throw new Error("Đăng nhập thất bại");
        }

        return response.result;
    },

    /**
     * Đăng ký tài khoản mới
     */
    register: async (
        request: { username: string; email: string; password: string }
    ): Promise<void> => {
        await api.post("/auth/signup", request, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    /**
     * Xác minh mã xác thực qua email
     */
    verifyUser: async (request: VerifyUserRequest): Promise<void> => {
        await api.post("/auth/verify", request, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    /**
     * Gửi lại mã xác thực (nếu cần)
     */
    resendVerification: async (email: string): Promise<void> => {
        await api.post("/auth/resend", null, {
            params: { email },
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
};
