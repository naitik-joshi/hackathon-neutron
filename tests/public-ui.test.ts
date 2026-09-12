import assert from "node:assert/strict";
import test from "node:test";
import { getInitials } from "../lib/utilities/initials.ts";

test("researcher initials are deterministic and do not expose demo prefixes", () => {
  assert.equal(getInitials("DEMO DATA — Aasha Sharma"), "AS");
  assert.equal(getInitials("Bibek"), "B");
  assert.equal(getInitials("  "), "");
});
