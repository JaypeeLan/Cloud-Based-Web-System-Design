import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UserModel } from "../models/User.js";
import { createToken, comparePassword, hashPassword, createPasswordResetToken, hashPasswordResetToken, buildPasswordResetUrl } from "../services/authService.js";
import { success } from "../utils/apiResponse.js";
import { HttpError } from "../utils/httpError.js";

const registerSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["customer", "owner", "admin"]).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const updateProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    location: z.string().min(2).optional(),
    password: z.string().min(8).optional()
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one profile field must be provided"
  });

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8)
});

const forgotPasswordMessage =
  "If that email is registered, password reset instructions have been sent.";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = registerSchema.parse(req.body);
    const existingUser = await UserModel.findOne({ email: payload.email });

    if (existingUser) {
      throw new HttpError(409, "Email is already in use");
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await UserModel.create({
      name: payload.name,
      location: payload.location,
      email: payload.email,
      passwordHash,
      role: payload.role ?? "customer"
    });

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(201).json(
      success(
        {
          token,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            location: user.location
          }
        },
        "User created"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ email: payload.email });

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const validPassword = await comparePassword(payload.password, user.passwordHash);

    if (!validPassword) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.json(
      success({
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) {
      throw new HttpError(401, "Unauthorized");
    }

    const user = await UserModel.findById(req.auth.userId).select("name email role location createdAt");

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    res.json(
      success({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        createdAt: user.createdAt
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) {
      throw new HttpError(401, "Unauthorized");
    }

    if ("role" in req.body) {
      throw new HttpError(403, "Role cannot be changed from profile settings");
    }

    const payload = updateProfileSchema.parse(req.body);
    const updateData: Record<string, unknown> = {};

    if (payload.name) {
      updateData.name = payload.name;
    }

    if (payload.location) {
      updateData.location = payload.location;
    }

    if (payload.password) {
      updateData.passwordHash = await hashPassword(payload.password);
    }

    const user = await UserModel.findByIdAndUpdate(req.auth.userId, updateData, {
      new: true
    }).select("name email role location createdAt");

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    res.json(
      success(
        {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          createdAt: user.createdAt
        },
        "Profile updated"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await UserModel.findOne({ email });

    let resetUrl: string | undefined;

    if (user) {
      const { token, tokenHash, expires } = createPasswordResetToken();
      user.passwordResetToken = tokenHash;
      user.passwordResetExpires = expires;
      await user.save();

      resetUrl = buildPasswordResetUrl(token);
      console.log(`Password reset link for ${email}: ${resetUrl}`);
    }

    const responseData =
      resetUrl && process.env.NODE_ENV !== "production" ? { resetUrl } : null;

    res.json(success(responseData, forgotPasswordMessage));
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const tokenHash = hashPasswordResetToken(token);

    const user = await UserModel.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    user.passwordHash = await hashPassword(password);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json(success(null, "Password reset successful"));
  } catch (error) {
    next(error);
  }
};
