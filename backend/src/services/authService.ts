import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

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

export const createPasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashPasswordResetToken(token);
  const expires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

  return { token, tokenHash, expires };
};

export const hashPasswordResetToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const buildPasswordResetUrl = (token: string) =>
  `${env.CLIENT_URL}/auth/reset-password?token=${token}`;
