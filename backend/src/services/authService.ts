import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AuthTokenPayload = {
  userId: string;
  email: string;
  role: "customer" | "owner" | "admin";
};

export const hashPassword = async (plainTextPassword: string) => bcrypt.hash(plainTextPassword, 12);

export const comparePassword = async (plainTextPassword: string, hash: string) =>
  bcrypt.compare(plainTextPassword, hash);

export const createToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
