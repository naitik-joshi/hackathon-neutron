import { test } from "node:test";
import assert from "node:assert/strict";
import {
  authHref,
  getPostSignInRedirect,
  getPostSignUpRedirect,
  safeRedirectTo,
} from "../lib/auth/redirects.ts";
import { settleLoad } from "../lib/utilities/load-result.ts";
import { submitInterestThroughAction } from "../features/participation/submission.ts";

test("safeRedirectTo accepts only internal relative paths", () => {
  assert.equal(
    safeRedirectTo("/projects/demo?tab=team#get-involved"),
    "/projects/demo?tab=team#get-involved",
  );
  for (const unsafe of [
    "https://example.com",
    "http://example.com",
    "//example.com/path",
    "javascript:alert(1)",
    "/\\example.com",
    "projects/demo",
  ]) {
    assert.equal(safeRedirectTo(unsafe), undefined);
  }
});

test("role redirects cannot be overridden by a public return path", () => {
  const requested = "/projects/demo#get-involved";
  assert.equal(getPostSignInRedirect("student", requested), requested);
  assert.equal(getPostSignInRedirect("researcher", requested), "/researcher");
  assert.equal(getPostSignInRedirect("admin", requested), "/admin");
  assert.equal(getPostSignUpRedirect(requested), requested);
  assert.equal(
    authHref("/auth/sign-in", requested),
    "/auth/sign-in?redirectTo=%2Fprojects%2Fdemo%23get-involved",
  );
});

test("interest submission never reports success without a server action", async () => {
  const result = await submitInterestThroughAction(undefined, new FormData());
  assert.equal(result.success, undefined);
  assert.equal(result.code, "unavailable");
  assert.match(result.error ?? "", /not been saved/i);
});

test("settleLoad keeps successful and failed homepage sources distinct", async () => {
  const [success, failure] = await Promise.all([
    settleLoad(Promise.resolve(["area"]), "Areas unavailable"),
    settleLoad(Promise.reject(new Error("network")), "Projects unavailable"),
  ]);
  assert.deepEqual(success, { ok: true, data: ["area"] });
  assert.deepEqual(failure, { ok: false, message: "Projects unavailable" });
});
