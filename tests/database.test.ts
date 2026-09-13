import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const researcher = "a0000000-0000-4000-8000-000000000001";
const other = "a0000000-0000-4000-8000-000000000002";
const admin = "a0000000-0000-4000-8000-000000000003";
const student = "a0000000-0000-4000-8000-000000000004";
const publication = "b0000000-0000-4000-8000-000000000001";
test("PostgreSQL migration, RLS and publication lifecycle", async (t) => {
  const db = new PGlite();
  try {
    // Minimal Supabase Auth contract; application migration and policies are unchanged.
    await db.exec(`create role anon nologin; create role authenticated nologin; create schema auth;
   create table auth.users (id uuid primary key, raw_user_meta_data jsonb default '{}');
   create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
   grant usage on schema auth, public to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;`);
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
    await db.exec(seed);
    assert.deepEqual(
      (
        await db.query<{
          areas: number;
          researchers: number;
          projects: number;
          publications: number;
        }>(
          `select
            (select count(*)::int from research_areas where is_demo) areas,
            (select count(*)::int from researchers where is_demo) researchers,
            (select count(*)::int from projects where is_demo) projects,
            (select count(*)::int from publications where is_demo) publications`,
        )
      ).rows[0],
      { areas: 4, researchers: 4, projects: 4, publications: 6 },
      "demo seed is idempotent",
    );
    await db.exec(
      "insert into research_areas(id,name,slug,description,is_demo) values ('10000000-0000-4000-8000-000000000099','Real record','real-record','Not demo content',false)",
    );
    await db.exec(seed);
    assert.equal(
      (
        await db.query<{ n: number }>(
          "select count(*)::int n from research_areas where id='10000000-0000-4000-8000-000000000099' and not is_demo",
        )
      ).rows[0].n,
      1,
      "seeding does not delete non-demo records",
    );
    await db.exec(
      `insert into auth.users(id,raw_user_meta_data) values ('${researcher}','{"role":"admin"}'),('${other}','{}'),('${admin}','{}'),('${student}','{}');`,
    );
    const role = await db.query<{ role: string }>(
      `select role from profiles where id = '${researcher}'`,
    );
    assert.equal(role.rows[0].role, "student", "metadata cannot grant admin");
    await db.exec(
      `update profiles set role='researcher' where id in ('${researcher}','${other}'); update profiles set role='admin' where id='${admin}';`,
    );
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
    await t.test(
      "anonymous reads only public records and cannot write",
      async () => {
        await asUser(null);
        assert.equal(await count("publications"), 6);
        assert.equal(await count("profiles"), 0);
        await assert.rejects(
          db.exec(
            `insert into publications(title,slug,abstract) values ('Bad','bad','This should never be inserted')`,
          ),
        );
      },
    );
    await t.test("student cannot submit or promote own role", async () => {
      await asUser(student);
      await db.exec(`update profiles set role='admin' where id='${student}'`);
      assert.equal(
        (await db.query<{ role: string }>("select role from profiles")).rows[0]
          .role,
        "student",
      );
      await assert.rejects(
        db.exec(
          `insert into publications(title,slug,abstract,submitted_by) values ('Bad','bad','This should never be inserted','${student}')`,
        ),
      );
    });
    await t.test(
      "researcher submits but cannot publish, spoof owner or edit submitted content",
      async () => {
        await asUser(researcher);
        await db.exec(
          `insert into publications(id,title,slug,abstract,submitted_by,is_demo) values ('${publication}','DEMO DATA — Test output','test-output','DEMO DATA — A real PostgreSQL workflow test publication.','${researcher}',true)`,
        );
        assert.equal(await count("publications"), 7);
        await db.exec(
          `update publications set status='published' where id='${publication}'`,
        );
        assert.equal(
          (
            await db.query<{ status: string }>(
              `select status from publications where id='${publication}'`,
            )
          ).rows[0].status,
          "submitted",
        );
        await db.exec(
          `update publications set title='Unauthorized edit' where id='${publication}'`,
        );
        assert.match(
          (
            await db.query<{ title: string }>(
              `select title from publications where id='${publication}'`,
            )
          ).rows[0].title,
          /DEMO DATA/,
        );
        await assert.rejects(
          db.exec(
            `insert into publications(title,slug,abstract,submitted_by,status) values ('Invalid','invalid','This should never be inserted','${researcher}','published')`,
          ),
        );
        await assert.rejects(
          db.exec(
            `insert into publications(title,slug,abstract,submitted_by) values ('Invalid','spoof','This should never be inserted','${other}')`,
          ),
        );
      },
    );
    await t.test(
      "private publications and their relationships are hidden from other users",
      async () => {
        await asUser(admin);
        await db.exec(
          `insert into publication_projects values ('${publication}','30000000-0000-4000-8000-000000000001')`,
        );
        for (const id of [null, other, student]) {
          await asUser(id);
          assert.equal(await count("publications"), 6);
          assert.equal(await count("publication_projects"), 7);
        }
      },
    );
    await t.test(
      "admin review and change requests allow only permitted researcher edits",
      async () => {
        await asUser(admin);
        await assert.rejects(
          db.exec(
            `update publications set status='published' where id='${publication}'`,
          ),
        );
        await db.exec(
          `update publications set status='under_review' where id='${publication}'; update publications set status='changes_requested' where id='${publication}';`,
        );
        await asUser(other);
        await db.exec(
          `update publications set title='Other owner edit' where id='${publication}'`,
        );
        await asUser(admin);
        assert.match(
          (
            await db.query<{ title: string }>(
              `select title from publications where id='${publication}'`,
            )
          ).rows[0].title,
          /DEMO DATA/,
        );
        await asUser(researcher);
        await assert.rejects(
          db.exec(
            `update publications set submitted_by='${other}',status='submitted' where id='${publication}'`,
          ),
        );
        await assert.rejects(
          db.exec(
            `update publications set status='published' where id='${publication}'`,
          ),
        );
        await db.exec(
          `update publications set title='DEMO DATA — Revised output',status='submitted' where id='${publication}'`,
        );
      },
    );
    await t.test(
      "admin publishes with database timestamp; anonymous can immediately read",
      async () => {
        await asUser(admin);
        await db.exec(
          `update publications set status='under_review' where id='${publication}'; update publications set status='published' where id='${publication}';`,
        );
        await asUser(null);
        assert.equal(await count("publications"), 7);
        assert.equal(await count("publication_projects"), 8);
        const result = await db.query<{
          published_at: string;
          is_demo: boolean;
        }>(
          `select published_at,is_demo from publications where id='${publication}'`,
        );
        assert.ok(result.rows[0].published_at);
        assert.equal(result.rows[0].is_demo, true);
      },
    );
    await t.test("all ten application tables have RLS", async () => {
      await asUser(admin);
      const result = await db.query<{ n: number }>(
        "select count(*)::int n from pg_tables where schemaname='public' and rowsecurity",
      );
      assert.equal(result.rows[0].n, 10);
    });
  } finally {
    await db.close();
  }
});
