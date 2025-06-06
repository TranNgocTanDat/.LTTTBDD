import type { AuthenticationResponse, VerifyUserRequest } from "@/model/Authentication";
import type AuthenticationReuquest from "@/model/Authentication";
import api from "./api";
import type { APIResponse } from "@/model/APIResponse";

export default {
  login: async (
    request: AuthenticationReuquest
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

    // Vì interceptor đã trả về response.data
    if (!response.result.authenticated) {
      throw new Error("Login failed");
    }

    return response.result;
  },

  verifyUser: async (
    request: VerifyUserRequest
  ): Promise<void> => {
     await api.post("/auth/verify", request)
      
  },
};
