# ADR-0001: Use Supabase Postgres over Turso SQLite

**Status:** Accepted
**Date:** 2026-04-12
**Deciders:** Jan Riethmayer

## Context

The Eureka game initially used Turso (hosted SQLite via libsql) as its database. As the project moved game state into the database (branch `25-move-game-into-database`), we needed to choose whether to continue with Turso or migrate to a different database provider.

## Decision

Migrate from Turso (SQLite) to **Supabase (Postgres)**.

## Rationale

- **Vercel integration** — Supabase has a native Vercel integration that auto-injects `DATABASE_URL` and `DIRECT_URL` environment variables, simplifying deployment.
- **Free tier** — Supabase's free plan is sufficient for the expected usage (family plays a few times per week).
- **Postgres ecosystem** — Postgres offers richer query capabilities (native JSONB, window functions, timestamptz) compared to SQLite's text-based workarounds.
- **Future optionality** — Supabase provides auth, realtime, storage, and RLS as add-ons if needed later, without switching providers.

## Alternatives Considered

- **Stay with Turso** — Works fine technically, but lacks the Vercel integration and Postgres ecosystem benefits. The `driver: "turso"` option was also being deprecated in newer drizzle-kit versions.
- **PlanetScale / Neon** — Viable Postgres alternatives, but Supabase's free tier and Vercel integration made it the simplest choice.

## Consequences

- All SQLite-specific code (`sqliteTable`, `@libsql/client`, `.all()` queries) was replaced with Postgres equivalents (`pgTable`, `postgres`, standard Drizzle queries).
- Old SQLite migrations were deleted; schema is pushed fresh to Supabase.
- Environment variables changed from `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` to a single `DATABASE_URL`.
