#!/usr/bin/env bash
#
# Deploy Eureka to Cloud Run in project eureka-362814.
#
# Idempotent: enables APIs, creates the Artifact Registry repo and Secret
# Manager secrets if missing, builds + pushes the image via Cloud Build, then
# deploys the Cloud Run service. Re-run any time to ship a new revision.
#
# Secret values are read from the environment ONCE to seed Secret Manager; they
# are never committed. Required only the first time (or to rotate a secret):
#
#   SUPABASE_URL=...                 (NEXT_PUBLIC_SUPABASE_URL)
#   SUPABASE_PUBLISHABLE_KEY=...     (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
#   SENTRY_DSN=...                   (public client DSN)
#   SENTRY_AUTH_TOKEN=...            (org:ci token, source-map upload only)
#
# Usage:
#   deploy/deploy.sh               # full path: bootstrap (idempotent) + build + deploy
#   deploy/deploy.sh --seed        # also create/update secrets from the env vars above
#   deploy/deploy.sh --deploy-only # CI path: skip bootstrap, only build + deploy
#
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-eureka-362814}"
REGION="${REGION:-europe-west1}"
REPO="${REPO:-eureka}"
SERVICE="${SERVICE:-eureka-web}"

GCLOUD="${GCLOUD:-$HOME/.google-cloud-sdk/bin/gcloud}"
[ -x "$GCLOUD" ] || GCLOUD="gcloud"

SEED=false
DEPLOY_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --seed)        SEED=true ;;
    --deploy-only) DEPLOY_ONLY=true ;;   # CI: bootstrap already done, just ship
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

echo "▶ project=$PROJECT_ID region=$REGION service=$SERVICE"
"$GCLOUD" config set project "$PROJECT_ID" >/dev/null
# Pin the quota/billing project so client-library calls (e.g. the Cloud Build
# source upload) are attributed to this project rather than defaulting to an
# empty/unexpected consumer — required when running as an impersonated/federated
# service account (CI via Workload Identity, or local impersonation).
"$GCLOUD" config set billing/quota_project "$PROJECT_ID" >/dev/null 2>&1 || true

if ! $DEPLOY_ONLY; then
  echo "▶ enabling APIs"
  "$GCLOUD" services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    cloudresourcemanager.googleapis.com

  echo "▶ ensuring Artifact Registry repo '$REPO'"
  "$GCLOUD" artifacts repositories describe "$REPO" --location "$REGION" >/dev/null 2>&1 || \
    "$GCLOUD" artifacts repositories create "$REPO" \
      --repository-format docker --location "$REGION" \
      --description "Eureka container images"
fi

# --- secrets --------------------------------------------------------------
upsert_secret() {  # name, value
  local name="$1" value="$2"
  if [ -z "$value" ]; then echo "  ! $name: no value provided, skipping"; return; fi
  if "$GCLOUD" secrets describe "$name" >/dev/null 2>&1; then
    printf '%s' "$value" | "$GCLOUD" secrets versions add "$name" --data-file=- >/dev/null
    echo "  ↻ $name: new version added"
  else
    printf '%s' "$value" | "$GCLOUD" secrets create "$name" --replication-policy automatic --data-file=- >/dev/null
    echo "  + $name: created"
  fi
}

if $SEED; then
  echo "▶ seeding secrets from environment"
  upsert_secret eureka-supabase-url              "${SUPABASE_URL:-}"
  upsert_secret eureka-supabase-publishable-key  "${SUPABASE_PUBLISHABLE_KEY:-}"
  upsert_secret eureka-sentry-dsn                "${SENTRY_DSN:-}"
  upsert_secret eureka-sentry-auth-token         "${SENTRY_AUTH_TOKEN:-}"
fi

# --- IAM: let Cloud Build read secrets at build time ----------------------
if ! $DEPLOY_ONLY; then
  PROJECT_NUMBER="$("$GCLOUD" projects describe "$PROJECT_ID" --format='value(projectNumber)')"
  CLOUDBUILD_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
  for s in eureka-supabase-url eureka-supabase-publishable-key eureka-sentry-dsn eureka-sentry-auth-token; do
    "$GCLOUD" secrets add-iam-policy-binding "$s" \
      --member "serviceAccount:${CLOUDBUILD_SA}" \
      --role roles/secretmanager.secretAccessor >/dev/null 2>&1 || true
  done
fi

# --- build + push ---------------------------------------------------------
echo "▶ building + pushing image via Cloud Build"
"$GCLOUD" builds submit --config cloudbuild.yaml \
  --substitutions "_REGION=${REGION},_REPO=${REPO},_SERVICE=${SERVICE}"

# --- deploy ---------------------------------------------------------------
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:latest"
echo "▶ deploying $SERVICE"
"$GCLOUD" run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 --memory 512Mi \
  --min-instances 0 --max-instances 5 \
  --set-env-vars NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1 \
  --set-secrets "SENTRY_DSN=eureka-sentry-dsn:latest"

URL="$("$GCLOUD" run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo "✅ deployed: $URL"
