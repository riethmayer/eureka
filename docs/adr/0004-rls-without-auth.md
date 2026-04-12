# ADR-0004: Row Level Security without authentication

**Status:** Accepted
**Date:** 2026-04-12
**Deciders:** Jan Riethmayer

## Context

Eureka is a public repo using Supabase with a publishable key (visible in client-side code). There is no user authentication — players enter a name via a cookie. We need to follow good security practices without overcomplicating a family game.

## Decision

Enable RLS on all tables using the publishable key only. No service role key in the application.

**Policies:**
- `SELECT` — allow all (highscores are public)
- `INSERT` — allow all (anyone can start a game)
- `UPDATE` — allow only where the request targets an existing game by ID (can only update your own active game)
- `DELETE` — deny all

## Rationale

- **No secret to protect** — the publishable key is designed to be public. A leaked service role key would be far more dangerous than any fake highscore.
- **RLS limits blast radius** — even with the publishable key, an attacker can only insert new games or update existing ones by ID. They cannot delete data or access admin functions.
- **Proportional to the threat** — this is a family game played a few times a week. Full auth (magic links, sessions, JWTs) would add complexity with no real benefit.
- **Upgrade path** — if auth is added later, the RLS policies simply add an `auth.uid()` check. The structure doesn't change.

## Alternatives Considered

- **Service role key in API route** — server-side writes only, RLS blocks all direct writes. Rejected because it introduces a secret that's more dangerous if leaked than the problem it solves.
- **No RLS** — current state. Works, but the publishable key has unrestricted write access to all tables. Not good practice for a public repo.
- **Full auth (Supabase Auth)** — magic links or OAuth for each family member. Overkill for current usage.

## Consequences

- All tables have RLS enabled with explicit policies.
- The publishable key remains the only credential — no secrets in env vars, Vercel config, or 1Password.
- Games can be created by anyone and updated by anyone who knows the game ID (UUIDs are unguessable).
- No data can be deleted through the API.
