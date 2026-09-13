import { z } from "zod";

export const interestSchema = z.object({
  project_id: z.uuid(),
  contact_email: z.string().trim().email().max(254).toLowerCase(),
  message: z
    .string()
    .trim()
    .min(20, "Explain your interest in at least 20 characters.")
    .max(2000),
  is_demo: z.boolean(),
});

export function validateInterestInput({
  email,
  message,
}: {
  email: string;
  message: string;
}): { isValid: boolean; errors: { email?: string; message?: string } } {
  const errors: { email?: string; message?: string } = {};

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = "Please provide your contact email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  } else if (trimmedEmail.length > 254) {
    errors.email = "Email address cannot exceed 254 characters.";
  }

  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    errors.message = "Please describe your interest in joining this project.";
  } else if (trimmedMessage.length < 20) {
    errors.message = `Explain your interest in at least 20 characters (${20 - trimmedMessage.length} more needed).`;
  } else if (trimmedMessage.length > 2000) {
    errors.message = "Your statement exceeds the maximum limit of 2000 characters.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
