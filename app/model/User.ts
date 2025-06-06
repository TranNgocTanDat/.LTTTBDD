export  interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  verificationCode: string;
  roles: string[];
}

// UserCreationRequest.ts
export  interface UserCreationRequest {
  username: string;
  password: string;
  email: string;
}

// UserResponse.ts
export  interface UserResponse {
  name: any;
  id: string;
  username: string;
  password: string;
  email: string;
  verificationCode: string;
  firstName: string;
  lastName: string;
  dob: string;
  roles: string[];
}

// UserUpdateRequest.ts
export  interface UserUpdateRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
}
