import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { reviewSchema } from "../features/submissions/validation.ts";
import { interestSchema } from "../features/participation/validation.ts";

const owner = "a0000000-0000-4000-8000-000000000001";
const other = "a0000000-0000-4000-8000-000000000002";
const admin = "a0000000-0000-4000-8000-000000000003";
const student = "a0000000-0000-4000-8000-000000000004";
const pub = "b0000000-0000-4000-8000-000000000001";
const project = "30000000-0000-4000-8000-000000000001";

test("review reasons and private contact input are validated", () => {
  for (const decision of ["changes_requested", "rejected"]) {
    assert.equal(
      reviewSchema.safeParse({ id: pub, decision, note: "  " }).success,
      false,
    );
    assert.equal(
      reviewSchema.safeParse({ id: pub, decision, note: "Clarify methods" })
        .success,
      true,
    );
  }
  assert.equal(
    reviewSchema.safeParse({ id: "bad", decision: "published" }).success,
    false,
  );
  assert.equal(
    reviewSchema.safeParse({ id: pub, decision: "draft" }).success,
    false,
  );
  assert.equal(
    reviewSchema.safeParse({
      id: pub,
      decision: "published",
      note: "x".repeat(4001),
    }).success,
    false,
  );
  const valid = {
    project_id: project,
    contact_email: " STUDENT@example.com ",
    message: "DEMO DATA — I want to help with this research.",
    is_demo: true,
  };
  assert.equal(
    interestSchema.parse(valid).contact_email,
    "student@example.com",
  );
  for (const patch of [
    { project_id: "bad" },
    { contact_email: "bad" },
    { message: "short" },
    { message: "x".repeat(2001) },
  ]) {
    assert.equal(
      interestSchema.safeParse({ ...valid, ...patch }).success,
      false,
    );
  }
});

test("review transactions and interest privacy use real PostgreSQL RLS", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon nologin; create role authenticated nologin; create schema auth;
      create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;`);
    const dir = new URL("../supabase/migrations/", import.meta.url);
    for (const file of (await readdir(dir))
      .filter((f) => f.endsWith(".sql"))
      .sort()) {
      await db.exec(await readFile(new URL(file, dir), "utf8"));
    }
    await db.exec(
      await readFile(new URL("../supabase/seed.sql", import.meta.url), "utf8"),
    );
    await db.exec(`insert into auth.users(id) values ('${owner}'),('${other}'),('${admin}'),('${student}');
      update profiles set role='researcher' where id in ('${owner}','${other}');
      update profiles set role='admin' where id='${admin}';`);
    async function asUser(id: string | null) {
      await db.exec(
        `reset role; select set_config('request.jwt.claim.sub','${id ?? ""}',false); set role ${id ? "authenticated" : "anon"};`,
      );
    }
    async function count(table: string) {
      return (
        await db.query<{ n: number }>(`select count(*)::int n from ${table}`)
      ).rows[0].n;
    }
    await asUser(owner);
    await db.exec(
      `insert into publications(id,title,slug,abstract,submitted_by,is_demo) values ('${pub}','DEMO DATA — Review test','review-test','DEMO DATA — Testing private feedback history.','${owner}',true)`,
    );
    for (const user of [null, student, owner, other]) {
      await asUser(user);
      await assert.rejects(
        db.exec(`select review_publication('${pub}','under_review','')`),
      );
    }
    await asUser(admin);
    await db.exec(`select review_publication('${pub}','under_review','')`);
    await assert.rejects(
      db.exec(`select review_publication('${pub}','rejected','')`),
    );
    assert.equal(
      (
        await db.query<{ status: string }>(
          `select status from publications where id='${pub}'`,
        )
      ).rows[0].status,
      "under_review",
      "failed note rolls back status",
    );
    assert.equal(await count("publication_reviews"), 1);
    await db.exec(
      `select review_publication('${pub}','changes_requested','DEMO DATA — Clarify the methods')`,
    );
    await assert.rejects(
      db.exec(`select review_publication('${pub}','published','')`),
    );
    assert.equal(
      await count("publication_reviews"),
      2,
      "stale decisions add no history",
    );
    await asUser(owner);
    assert.equal(await count("publication_reviews"), 2);
    await assert.rejects(
      db.exec(`update publication_reviews set note='Tampered'`),
    );
    await assert.rejects(
      db.exec(
        `insert into publication_reviews(publication_id,reviewer_id,decision) values ('${pub}','${owner}','published')`,
      ),
    );
    await db.exec(
      `update publications set status='submitted' where id='${pub}'`,
    );
    await asUser(admin);
    await db.exec(
      `select review_publication('${pub}','under_review',''); select review_publication('${pub}','published','DEMO DATA — Accepted')`,
    );
    const attribution = await db.query<{ reviewer_id: string }>(
      "select reviewer_id from publication_reviews",
    );
    assert.ok(attribution.rows.every((row) => row.reviewer_id === admin));
    for (const user of [null, student, other]) {
      await asUser(user);
      assert.equal(
        await count("publication_reviews"),
        0,
        "reviews remain private after publishing",
      );
    }

    const insertInterest = (
      id: string,
      projectId = project,
      email = "student@example.com",
      message = "DEMO DATA — I want to join this project.",
    ) =>
      db.query(
        "insert into project_interests(project_id,student_id,contact_email,message,is_demo) values ($1,$2,$3,$4,true)",
        [projectId, id, email, message],
      );
    for (const user of [null, owner, admin]) {
      await asUser(user);
      await assert.rejects(insertInterest(student));
    }
    await asUser(student);
    await assert.rejects(insertInterest(other));
    await assert.rejects(insertInterest(student, pub));
    await assert.rejects(insertInterest(student, project, "invalid"));
    await assert.rejects(
      insertInterest(student, project, "student@example.com", "short"),
    );
    await insertInterest(student);
    await assert.rejects(
      insertInterest(student),
      "database deduplicates concurrent/repeated submissions",
    );
    assert.equal(await count("project_interests"), 1);
    await assert.rejects(
      db.exec("update project_interests set student_id = null"),
    );
    await assert.rejects(db.exec("delete from project_interests"));
    for (const user of [null, owner, other]) {
      await asUser(user);
      assert.equal(await count("project_interests"), 0);
    }
    await asUser(admin);
    assert.equal(await count("project_interests"), 1);
    const rls = await db.query<{ n: number }>(
      "select count(*)::int n from pg_tables where schemaname='public' and rowsecurity",
    );
    assert.equal(rls.rows[0].n, 12);
    // Trusted maintenance verifies the documented FK deletion behavior.
    await db.exec(
      `reset role; select set_config('request.jwt.claim.sub','',false); delete from auth.users where id='${admin}'`,
    );
    assert.equal(
      (
        await db.query<{ n: number }>(
          "select count(*)::int n from publication_reviews where reviewer_id is null",
        )
      ).rows[0].n,
      4,
    );
    await db.exec(`delete from auth.users where id='${student}'`);
    assert.equal(await count("project_interests"), 0);
    await db.exec(`delete from publications where id='${pub}'`);
    assert.equal(await count("publication_reviews"), 0);
  } finally {
    await db.close();
  }
});
