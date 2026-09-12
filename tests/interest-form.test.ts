import { test } from "node:test";
import assert from "node:assert/strict";
import { validateInterestInput } from "../features/participation/validation.ts";

test("Interest form client-side validation rules", () => {
  // 1. Valid input
  const valid = validateInterestInput({
    email: "student@islingtoncollege.edu.np",
    message: "I would love to participate and contribute to this NLP research pipeline.",
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});

  // 2. Empty email
  const emptyEmail = validateInterestInput({
    email: "   ",
    message: "I would love to participate and contribute to this NLP research pipeline.",
  });
  assert.equal(emptyEmail.isValid, false);
  assert.equal(
    emptyEmail.errors.email,
    "Please provide your contact email address.",
  );

  // 3. Malformed email
  const malformedEmail = validateInterestInput({
    email: "not-an-email",
    message: "I would love to participate and contribute to this NLP research pipeline.",
  });
  assert.equal(malformedEmail.isValid, false);
  assert.equal(
    malformedEmail.errors.email,
    "Please enter a valid email address.",
  );

  // 4. Excessive email length (> 254 chars)
  const longEmail = validateInterestInput({
    email: "a".repeat(250) + "@test.com",
    message: "I would love to participate and contribute to this NLP research pipeline.",
  });
  assert.equal(longEmail.isValid, false);
  assert.equal(
    longEmail.errors.email,
    "Email address cannot exceed 254 characters.",
  );

  // 5. Empty message
  const emptyMessage = validateInterestInput({
    email: "student@islingtoncollege.edu.np",
    message: "   ",
  });
  assert.equal(emptyMessage.isValid, false);
  assert.equal(
    emptyMessage.errors.message,
    "Please describe your interest in joining this project.",
  );

  // 6. Too short message (< 20 chars)
  const shortMessage = validateInterestInput({
    email: "student@islingtoncollege.edu.np",
    message: "Too short.",
  });
  assert.equal(shortMessage.isValid, false);
  assert.match(shortMessage.errors.message!, /at least 20 characters/);

  // 7. Too long message (> 2000 chars)
  const longMessage = validateInterestInput({
    email: "student@islingtoncollege.edu.np",
    message: "x".repeat(2001),
  });
  assert.equal(longMessage.isValid, false);
  assert.equal(
    longMessage.errors.message,
    "Your statement exceeds the maximum limit of 2000 characters.",
  );
});
