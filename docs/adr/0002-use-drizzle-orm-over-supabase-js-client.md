# ADR-0002: Use Drizzle ORM over Supabase JS Client

**Status:** Accepted
**Date:** 2026-04-12
**Deciders:** Jan Riethmayer

## Context

When migrating to Supabase Postgres, we had to choose how the application talks to the database: either continue using Drizzle ORM (with the `postgres-js` driver) or switch to Supabase's own JS client (`@supabase/supabase-js`).

## Decision

Keep **Drizzle ORM** with the `postgres-js` driver for all database access.

## Rationale

- **Minimal migration effort** — The existing codebase already used Drizzle with SQLite. Swapping the dialect from `sqlite` to `postgresql` required only type changes (e.g., `sqliteTable` → `pgTable`), not a full query rewrite.
- **Direct SQL connection** — Drizzle talks directly to Postgres, avoiding the ~1-3ms per-query overhead of Supabase's PostgREST layer.
- **Migration tooling** — Drizzle Kit provides schema diffing, migration generation, and `push` for rapid iteration. The Supabase JS client has no migration story.
- **Type safety from schema** — Drizzle infers TypeScript types directly from the schema definition, keeping types and database in sync without manual effort.
- **Composability** — If Supabase-specific features (auth, realtime, storage) are needed later, the Supabase JS client can be added alongside Drizzle. They are not mutually exclusive.

## Alternatives Considered

- **Supabase JS Client (`@supabase/supabase-js`)** — Provides auth, realtime, and storage through a single client, but requires rewriting all existing queries to use its REST-based API. Not justified when the app only needs database access today.

## Consequences

- Database queries use Drizzle's query builder, not Supabase's REST API.
- The `postgres` npm package is a production dependency (direct TCP connection to Postgres).
- Schema changes are managed via `drizzle-kit generate` / `drizzle-kit push`.
- Supabase-specific features (auth, RLS, realtime) would require adding `@supabase/supabase-js` as a separate dependency if needed in the future.
