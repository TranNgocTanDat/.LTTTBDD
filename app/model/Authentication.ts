import type { UserResponse } from "./User";

export default interface AuthenticationReuquest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  authenticated: boolean;
  token: string;
  userResponse: UserResponse
}

export interface VerifyUserRequest {
  email: string;
  verificationCode: string;
}