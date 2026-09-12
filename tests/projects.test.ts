import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const admin = "a0000000-0000-4000-8000-000000000003";
const student = "a0000000-0000-4000-8000-000000000004";
const researcher = "a0000000-0000-4000-8000-000000000001";

test("Project directory, relationships and security policies", async (t) => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon nologin;
      create role authenticated nologin;
      create schema auth;
      create table auth.users (id uuid primary key, raw_user_meta_data jsonb default '{}');
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;
      grant usage on schema auth, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
    `);

    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/202609120001_initial_research.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );

    const seed = await readFile(
      new URL("../supabase/seed.sql", import.meta.url),
      "utf8",
    );
    await db.exec(seed);

    await db.exec(`
      insert into auth.users(id, raw_user_meta_data) values
        ('${researcher}', '{}'),
        ('${admin}', '{}'),
        ('${student}', '{}');
      update profiles set role='researcher' where id='${researcher}';
      update profiles set role='admin' where id='${admin}';
    `);

    async function asUser(id: string | null) {
      await db.exec(
        `reset role; select set_config('request.jwt.claim.sub','${id ?? ""}',false); set role ${id ? "authenticated" : "anon"};`,
      );
    }

    await t.test("anonymous can read public projects and connected relations", async () => {
      await asUser(null);
      const projects = await db.query<{ id: string; slug: string; is_demo: boolean }>(
        "select id, slug, is_demo from projects where slug = 'demo-accessible-learning'",
      );
      assert.equal(projects.rows.length, 1);
      assert.equal(projects.rows[0].slug, "demo-accessible-learning");
      assert.equal(projects.rows[0].is_demo, true);

      const areaLinks = await db.query(
        "select * from project_research_areas where project_id = '30000000-0000-4000-8000-000000000001'",
      );
      assert.equal(areaLinks.rows.length, 1);

      const researcherLinks = await db.query(
        "select * from researcher_projects where project_id = '30000000-0000-4000-8000-000000000001'",
      );
      assert.equal(researcherLinks.rows.length, 1);

      const publicationLinks = await db.query(
        "select * from publication_projects where project_id = '30000000-0000-4000-8000-000000000001'",
      );
      assert.equal(publicationLinks.rows.length, 1);
    });

    await t.test("anonymous and students cannot insert or modify projects", async () => {
      await asUser(null);
      await assert.rejects(
        db.exec(
          "insert into projects(title, slug, summary, status) values ('Unauthorized', 'unauthorized', 'Test', 'proposed')",
        ),
      );

      await asUser(student);
      await assert.rejects(
        db.exec(
          "insert into projects(title, slug, summary, status) values ('Student Project', 'student-proj', 'Test', 'proposed')",
        ),
      );

      // Non-admin update matches 0 rows under RLS
      const updateRes = await db.query(
        "update projects set title = 'Hacked' where slug = 'demo-accessible-learning'",
      );
      assert.equal(updateRes.affectedRows, 0);

      // Confirm title was unchanged
      const checkRes = await db.query<{ title: string }>(
        "select title from projects where slug = 'demo-accessible-learning'",
      );
      assert.equal(checkRes.rows[0].title, "DEMO DATA — Accessible Learning");
    });

    await t.test("admin can create and update project records", async () => {
      await asUser(admin);
      const newProjectId = "30000000-0000-4000-8000-000000000099";
      await db.exec(`
        insert into projects(id, title, slug, summary, status, is_demo)
        values ('${newProjectId}', 'NepalNLP Initiative', 'nepalnlp-initiative', 'Devanagari dialect processing', 'ongoing', true);
      `);

      const res = await db.query<{ title: string; status: string }>(
        `select title, status from projects where id = '${newProjectId}'`,
      );
      assert.equal(res.rows[0].title, "NepalNLP Initiative");
      assert.equal(res.rows[0].status, "ongoing");

      // Anonymous should immediately be able to read it
      await asUser(null);
      const anonRead = await db.query<{ title: string }>(
        `select title from projects where id = '${newProjectId}'`,
      );
      assert.equal(anonRead.rows.length, 1);
    });
  } finally {
    await db.close();
  }
});
