# ADR-0002: Use Supabase JS Client over Drizzle ORM

**Status:** Accepted (supersedes original ADR-0002)
**Date:** 2026-04-12
**Deciders:** Jan Riethmayer

## Context

When migrating to Supabase Postgres, we initially chose Drizzle ORM with the `postgres-js` driver for database access. However, we discovered that:

1. The direct Postgres connection (`db.<ref>.supabase.co`) resolves to IPv6 only, which is unreachable from many networks.
2. The Supabase connection pooler returned "Tenant or user not found" for this newly created project.
3. The Supabase JS client connects via HTTPS (PostgREST), which works immediately without connection issues.

## Decision

Use the **Supabase JS client** (`@supabase/supabase-js` + `@supabase/ssr`) for all database access. Remove Drizzle ORM, `postgres`, and `drizzle-kit`.

## Rationale

- **It works** — The Supabase JS client connects over HTTPS, bypassing the IPv6 and pooler issues entirely.
- **One client for everything** — Database queries, auth, realtime, and storage all go through one client. No need to maintain two packages.
- **Simplicity** — For 3 tables with basic CRUD operations, a type-safe query builder and migration tooling are overkill. The Supabase dashboard and CLI handle schema management.
- **Negligible overhead** — The ~1-3ms PostgREST overhead per query is irrelevant for an app used by family a few times per week.
- **Vercel integration** — Supabase auto-injects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` via the Vercel integration.

## Alternatives Considered

- **Drizzle ORM with `postgres-js`** — Type-safe query builder with migration tooling, but requires a working direct Postgres or pooler connection. The connection issues made it impractical, and the migration tooling wasn't pulling its weight for this project's scale.

## Consequences

- Database queries use the Supabase REST API, not direct SQL.
- Types are defined manually in `src/types/game.ts` instead of inferred from a Drizzle schema.
- Schema changes are managed via Supabase CLI (`supabase db query --linked`) or the dashboard.
- `drizzle-orm`, `drizzle-kit`, `postgres`, and `@paralleldrive/cuid2` were removed as dependencies.
- Primary keys use Postgres-native `gen_random_uuid()` instead of application-generated CUIDs.
