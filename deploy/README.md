# GCP deployment (Cloud Run)

> 📊 **Illustrated docs with live diagrams:** [`../docs/deployment/index.html`](../docs/deployment/index.html)
> — overview, pipeline, the keyless security model, and tradeoffs. This file is the terse runbook.

Eureka runs on **Google Cloud Run** in project `eureka-362814`, in parallel with
the existing Vercel deployment. Both serve the *same* code and talk to the *same*
Supabase database — Cloud Run only replaces the hosting/runtime layer.

- **Service:** `eureka-web` (region `europe-west1`)
- **Live URL:** https://eureka-web-369713805962.europe-west1.run.app
- **Image:** `europe-west1-docker.pkg.dev/eureka-362814/eureka/eureka-web:latest`
- **Database:** Supabase (unchanged — `lthqyqlislwikgoxmttn.supabase.co`)

## Architecture

```
GitHub repo ──> Cloud Build (cloudbuild.yaml) ──> Artifact Registry ──> Cloud Run
                     │                                                      │
                     └─ build args from Secret Manager          runtime secrets / env
```

- The app is built with Next.js `output: "standalone"` (see `next.config.mjs`)
  and packaged by the root `Dockerfile` (Node 24, multi-stage, runs as non-root).
- `NEXT_PUBLIC_*` values are inlined at **build time**, so Cloud Build pulls them
  from Secret Manager and passes them as `--build-arg`.
- `SENTRY_AUTH_TOKEN` is build-only (source-map upload); the builder stage is
  discarded so it never lands in the published image.
- At **runtime**, Cloud Run injects `SENTRY_DSN` from Secret Manager and sets
  `NODE_ENV=production`. `PORT` (8080) is provided by Cloud Run.

## Secret Manager (the source of truth for env, replacing Vercel's env panel)

| Secret | Used as | When |
|---|---|---|
| `eureka-supabase-url` | `NEXT_PUBLIC_SUPABASE_URL` | build |
| `eureka-supabase-publishable-key` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | build |
| `eureka-sentry-dsn` | `NEXT_PUBLIC_SENTRY_DSN` (build) + `SENTRY_DSN` (runtime) | build + runtime |
| `eureka-sentry-auth-token` | `SENTRY_AUTH_TOKEN` (source-map upload) | build |

Both the Cloud Build SA (`…@cloudbuild`) and the Compute Engine default SA
(`…-compute@developer`, used at build and as the Cloud Run runtime identity) have
`roles/secretmanager.secretAccessor` on these secrets.

## Deploy / redeploy

```sh
# one-liner (idempotent): enable APIs, ensure repo, build, push, deploy
deploy/deploy.sh

# to (re)seed or rotate secrets from your shell first:
SUPABASE_URL=…  SUPABASE_PUBLISHABLE_KEY=…  SENTRY_DSN=…  SENTRY_AUTH_TOKEN=… \
  deploy/deploy.sh --seed
```

Or manually:

```sh
gcloud builds submit --config cloudbuild.yaml \
  --substitutions _REGION=europe-west1,_REPO=eureka,_SERVICE=eureka-web

gcloud run deploy eureka-web \
  --image europe-west1-docker.pkg.dev/eureka-362814/eureka/eureka-web:latest \
  --region europe-west1 --allow-unauthenticated --port 8080 \
  --cpu 1 --memory 512Mi --min-instances 0 --max-instances 5 \
  --set-env-vars NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1 \
  --set-secrets SENTRY_DSN=eureka-sentry-dsn:latest
```

## Verified on first deploy (2026-05-25)

- `/`, `/play`, `/highscores`, `/next-level`, `/game-over`, `/paused` → 200
- `GET /api/highscores` → live Supabase read from Cloud Run
- `POST /api/game` → 201, row written to Supabase (test row removed afterward)
- Static assets (favicon, `_next/static`) served; Sentry tunnel `/monitoring` wired (POST-only)
- Cold-start `/` ≈ 0.44s, warm `/highscores` ≈ 0.13s

## Remaining for the full Vercel → GCP cutover

1. Commit these files (`Dockerfile`, `.dockerignore`, `cloudbuild.yaml`, `deploy/`,
   `next.config.mjs` change) — they are Vercel-safe, so one codebase serves both.
2. (Optional) Add a Cloud Build trigger on push to `master` for continuous deploy.
3. Map the production custom domain to the Cloud Run service (Cloud Run domain
   mapping or a load balancer), then flip DNS.
4. Once GCP has served production traffic cleanly, retire the Vercel project.
