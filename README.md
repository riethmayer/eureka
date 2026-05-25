[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/riethmayer/eureka?utm_source=oss&utm_medium=github&utm_campaign=riethmayer%2Feureka&labelColor=171717&color=FF570A&label=CodeRabbit+Reviews)](https://coderabbit.ai)

# Eureka fun project

Eureka is one of many names for the game [**Mahjong Solitaire**](https://en.wikipedia.org/wiki/Mahjong_solitaire).

# Installation

- Use yarn to install packages
- [install the pscale client](https://github.com/planetscale/cli#installation)
- create your own database (free) to run locally and add DATABASE_URL to .env

# Usage

You start the game with `yarn start` and open `localhost:3000`.

# Documentation

![Documentation](Eureka.png "Excalidraw documentation")

# Deployment

Eureka deploys to **Google Cloud Run** (project `eureka-362814`) on every push to
`master`, in parallel with Vercel. The full flow — pipeline, keyless security
model (Workload Identity Federation), and tradeoffs — is documented as an
illustrated mini-site with live diagrams:

➡️ **[`docs/deployment/`](docs/deployment/index.html)** — open `index.html` in a browser

Quick reference: build & deploy with [`deploy/deploy.sh`](deploy/deploy.sh); see
[`deploy/README.md`](deploy/README.md) for the runbook.
