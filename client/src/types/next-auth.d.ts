import "next-auth";
import type { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  }
  interface User{
    id: number;
    name: string,
    phone: string,
    dob: string,
    gender: number,
    provinceId: number,
    districtId: number,
    wardId: number,
    address: string,
    email: string,
    password: string,
    active: number
  }
}

declare module "next-auth/jwt" {
  interface JWT extends User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}