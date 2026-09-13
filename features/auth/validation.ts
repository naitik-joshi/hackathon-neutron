import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(256),
});

export const signUpSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address.").max(254),
    password: z
      .string()
      .min(8, "Use at least 8 characters for your password.")
      .max(256),
    confirmPassword: z.string().max(256),
    intent: z.enum(["student", "researcher"]).default("student"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type AuthField = "email" | "password" | "confirmPassword" | "intent";
export type AuthActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<AuthField, string[]>>;
};
