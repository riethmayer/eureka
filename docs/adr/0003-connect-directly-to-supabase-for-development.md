# ADR-0003: Connect directly to Supabase for development

**Status:** Accepted
**Date:** 2026-04-12
**Deciders:** Jan Riethmayer

## Context

With the migration to Supabase Postgres, we needed to decide how developers connect to the database during local development: either run a local Supabase instance (via Docker) or connect directly to the hosted Supabase project.

## Decision

Connect directly to the hosted Supabase instance for both development and production.

## Rationale

- **Simplicity** — No local Docker setup, no `supabase start`, no local Postgres to manage. One fewer moving part.
- **Low traffic** — The app is used by family a few times per week. Development traffic on the free plan is negligible.
- **Single source of truth** — Dev and prod share the same schema (on the free plan, there's one project). No risk of local/remote schema drift.
- **Credentials via 1Password** — The connection string is stored in a shared 1Password vault (`op://Eureka/Supabase Database/connection-string`) and loaded via `direnv` + `op` CLI, keeping secrets out of the repo.

## Alternatives Considered

- **Local Supabase via Docker** (`supabase start`) — Full offline development with local Postgres, Auth, Storage. Heavier setup (Docker required), adds complexity for a project with very low usage. Would be worth revisiting if the team grows or the app needs offline development.
- **Local SQLite for dev, Supabase for prod** — Would require maintaining two database configurations and risk schema divergence.

## Consequences

- Developers need `op` CLI installed and access to the shared 1Password vault to get the connection string.
- Development requires an internet connection.
- The `.envrc` uses `op read` to inject `DATABASE_URL` at shell load time.
- If the free plan becomes insufficient, we can add a separate dev project on Supabase or switch to local Supabase.
