# SIRT — Secure Incident Reporting & Triage (MVP)

A compact full‑stack starter focused on the **API** (Express + TypeScript + Prisma/Postgres) with security-minded defaults (RBAC, CSRF, Helmet), tests, Docker, and CI.

## Quickstart

### Prereqs

- Node 20+
- pnpm (`corepack enable`)
- Docker (optional but recommended)

### Local (without Docker)

```bash
# 1) Install deps
corepack enable
pnpm i


# 2) Start Postgres (use Docker or your own)
docker compose up -d db


# 3) Env
cp apps/api/.env.example apps/api/.env
# update DATABASE_URL if needed


# 4) DB migrate + seed
pnpm -C apps/api prisma:migrate
pnpm -C apps/api prisma:seed


# 5) Run API in dev
pnpm -C apps/api dev
# API at http://localhost:4000
```
