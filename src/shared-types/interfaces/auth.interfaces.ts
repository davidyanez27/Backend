import { Company } from "./company.interface";
import { User } from "./user.interfaces";



export interface AuthSignInRequestPayload {
  email: string;
  password: string;
}

export interface AuthSignInResponse {
  user: User;
  token: string;
  company: Company;
}

export interface AuthSignUpRequestPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthForgotPasswordRequestPayload {
  email: string;
}

export interface AuthResetPasswordRequestPayload {
  token: string;
  newPassword: string;
}

export interface AuthChangePasswordRequestPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthState {
  status: "checking" | "authenticated" | "not-authenticated";
  user: User; 
  company: Company; 
  errorMessage?: string | null;
  loading: boolean;
}
