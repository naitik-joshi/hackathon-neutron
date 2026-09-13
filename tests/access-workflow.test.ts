import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import {
  administratorInviteSchema,
  profileRoleSchema,
  researcherAccessRequestSchema,
  researcherAccessReviewSchema,
} from "../features/access/validation.ts";

const applicant = "a1000000-0000-4000-8000-000000000001";
const other = "a1000000-0000-4000-8000-000000000002";
const admin = "a1000000-0000-4000-8000-000000000003";

test("researcher access input and admin decisions are validated", () => {
  const valid = {
    full_name: " Rabin Bam ",
    contact_email: " RABIN@example.com ",
    position: "Lecturer",
    affiliation: "Islington College",
    reason: "I need to submit and maintain institutional research records.",
  };
  const parsed = researcherAccessRequestSchema.parse(valid);
  assert.equal(parsed.full_name, "Rabin Bam");
  assert.equal(parsed.contact_email, "rabin@example.com");
  assert.equal(
    researcherAccessRequestSchema.safeParse({ ...valid, reason: "short" })
      .success,
    false,
  );
  assert.equal(
    researcherAccessReviewSchema.safeParse({
      id: applicant,
      decision: "admin",
    }).success,
    false,
  );
  assert.equal(
    profileRoleSchema.safeParse({ user_id: applicant, role: "owner" }).success,
    false,
  );
});

test("administrator invitations require valid input and explicit promotion confirmation", () => {
  assert.equal(
    administratorInviteSchema.safeParse({
      email: "new-admin@example.com",
      display_name: "Demo Admin",
      mode: "invite",
      confirmed: undefined,
    }).success,
    true,
  );
  assert.equal(
    administratorInviteSchema.safeParse({
      email: "existing@example.com",
      display_name: "",
      mode: "promote",
      confirmed: undefined,
    }).success,
    false,
  );
  assert.equal(
    administratorInviteSchema.safeParse({
      email: "not-an-email",
      display_name: "",
      mode: "invite",
      confirmed: "on",
    }).success,
    false,
  );
});

test("researcher requests and role changes are enforced by PostgreSQL", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon nologin; create role authenticated nologin; create schema auth;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;`);
    const dir = new URL("../supabase/migrations/", import.meta.url);
    for (const file of (await readdir(dir))
      .filter((name) => name.endsWith(".sql"))
      .sort()) {
      await db.exec(await readFile(new URL(file, dir), "utf8"));
    }
    await db.exec(
      `insert into auth.users(id) values ('${applicant}'),('${other}'),('${admin}');
       update profiles set role='admin' where id='${admin}';`,
    );

    async function asUser(id: string | null) {
      await db.exec(
        `reset role; select set_config('request.jwt.claim.sub','${id ?? ""}',false); set role ${id ? "authenticated" : "anon"};`,
      );
    }
    async function countRequests() {
      return (
        await db.query<{ n: number }>(
          "select count(*)::int n from researcher_access_requests",
        )
      ).rows[0].n;
    }

    await asUser(applicant);
    await db.exec(`insert into researcher_access_requests(
      user_id,full_name,contact_email,position,affiliation,reason
    ) values (
      '${applicant}','Rabin Bam','rabin@example.com','Lecturer','Islington College',
      'I need researcher access to submit institutional publications.'
    )`);
    assert.equal(await countRequests(), 1);
    await assert.rejects(
      db.exec(`insert into researcher_access_requests(
        user_id,full_name,contact_email,position,affiliation,reason
      ) values (
        '${applicant}','Rabin Bam','rabin@example.com','Lecturer','Islington College',
        'This duplicate pending request must be rejected by the database.'
      )`),
    );
    await assert.rejects(
      db.exec("update researcher_access_requests set status='approved'"),
    );

    await asUser(other);
    assert.equal(await countRequests(), 0);
    await assert.rejects(
      db.exec(`insert into researcher_access_requests(
        user_id,full_name,contact_email,position,affiliation,reason
      ) values (
        '${applicant}','Spoofed','other@example.com','Lecturer','Elsewhere',
        'This request attempts to impersonate another user account.'
      )`),
    );
    await assert.rejects(
      db.exec(`select admin_set_profile_role('${other}','admin'::app_role)`),
    );

    await asUser(admin);
    const request = await db.query<{ id: string }>(
      "select id from researcher_access_requests where status='pending'",
    );
    const requestId = request.rows[0].id;
    await assert.rejects(
      db.exec(
        `select review_researcher_access_request('${requestId}','invalid','')`,
      ),
    );
    await db.exec(
      `select review_researcher_access_request('${requestId}','approved','Verified affiliation')`,
    );
    assert.equal(
      (
        await db.query<{ role: string }>(
          `select role from profiles where id='${applicant}'`,
        )
      ).rows[0].role,
      "researcher",
    );
    await assert.rejects(
      db.exec(
        `select review_researcher_access_request('${requestId}','rejected','stale')`,
      ),
    );
    await assert.rejects(
      db.exec(`select admin_set_profile_role('${admin}','student'::app_role)`),
    );
    await assert.rejects(
      db.exec(`update profiles set role='student' where id='${admin}'`),
      "direct table access cannot bypass the self-role guard",
    );
    await db.exec(
      `select admin_set_profile_role('${other}','admin'::app_role)`,
    );

    await asUser(applicant);
    assert.equal(await countRequests(), 1);
    const decision = await db.query<{ status: string; reviewed_by: string }>(
      "select status,reviewed_by from researcher_access_requests",
    );
    assert.equal(decision.rows[0].status, "approved");
    assert.equal(decision.rows[0].reviewed_by, admin);

    await asUser(null);
    await assert.rejects(
      db.query("select * from researcher_access_requests"),
      "anonymous visitors have no table grant for private access requests",
    );
  } finally {
    await db.close();
  }
});
