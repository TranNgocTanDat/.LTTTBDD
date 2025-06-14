import type { UserResponse } from "./User";

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  authenticated: boolean;
  token: string;
  userResponse: UserResponse;
}

export interface VerifyUserRequest {
  email: string;
  verificationCode: string;
}
