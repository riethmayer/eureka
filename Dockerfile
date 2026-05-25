# syntax=docker/dockerfile:1

# Next.js 16 standalone server for Cloud Run.
# Mirrors the Vercel runtime: Node 24, Supabase over the network, Sentry source maps.

# ---- Base ----------------------------------------------------------------
FROM node:24-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---- Dependencies --------------------------------------------------------
# Yarn 4 is vendored in .yarn/releases and pinned via packageManager; invoke it
# directly so the build never depends on corepack downloading a release.
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
RUN node .yarn/releases/yarn-4.9.1.cjs install --immutable

# ---- Builder -------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* are inlined into the client bundle at build time, so they must
# be present here (not just at runtime).
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
# Build-time only: @sentry/nextjs uses this to upload source maps. The builder
# stage is discarded, so the token never lands in the final image.
ARG SENTRY_AUTH_TOKEN
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN \
    CI=true \
    NODE_ENV=production
RUN node .yarn/releases/yarn-4.9.1.cjs build

# ---- Runner --------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=8080 \
    HOSTNAME=0.0.0.0
# .next/standalone bundles a minimal server + node_modules; static assets and
# public/ are copied alongside it as Next expects.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 8080
CMD ["node", "server.js"]
