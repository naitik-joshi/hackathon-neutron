import { test } from "node:test";
import assert from "node:assert/strict";
import { signInSchema, signUpSchema } from "../features/auth/validation.ts";

test("student signup validates email, password and confirmation", () => {
  const valid = {
    email: " student@example.com ",
    password: "research8",
    confirmPassword: "research8",
  };
  const parsed = signUpSchema.parse(valid);
  assert.equal(parsed.email, "student@example.com");

  for (const patch of [
    { email: "not-an-email" },
    { password: "short", confirmPassword: "short" },
    { confirmPassword: "different8" },
  ]) {
    assert.equal(signUpSchema.safeParse({ ...valid, ...patch }).success, false);
  }
});

test("public signup input cannot carry an application role", () => {
  const parsed = signUpSchema.parse({
    email: "student@example.com",
    password: "research8",
    confirmPassword: "research8",
    role: "admin",
  });
  assert.equal("role" in parsed, false);
});

test("sign in validates credentials without accepting role", () => {
  const parsed = signInSchema.parse({
    email: "researcher@example.com",
    password: "password",
    role: "admin",
  });
  assert.equal("role" in parsed, false);
  assert.equal(
    signInSchema.safeParse({ email: "bad", password: "" }).success,
    false,
  );
});
