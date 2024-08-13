export interface LoginResponse {
  id?: string;
  fullName?: string;
  organizationName?: string;
  email: string;
  createdAt?: Date;
  accessToken: string;
}

export interface response {
  status?: boolean;
  message?: string;
  id?: string;
  fullName?: string;
  organizationName?: string;
  email?: string;
  createdAt?: Date;
}
