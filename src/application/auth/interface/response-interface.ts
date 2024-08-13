export interface LoginResponse {
  id?: string;
  fullName?: string;
  organizationName?: string;
  email: string;
  createdAt?: Date;
  accessToken: string;
}

export interface SignupResponse {
  id?: string;
  fullName?: string;
  organizationName?: string;
  email: string;
  createdAt?: Date;
}
