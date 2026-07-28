# Migration Summary — NestJS 10 → 11.1.x

This document is the one-page release summary for the NestJS 11 migration
executed in 8 atomic commits, each tagged for bisection.

## Tags

| Tag | Phase | Summary |
|-----|-------|---------|
| `nest11-phase-0` | Preflight | pre-existing bugs, engines.node, e2e scripts, mailing-ms test |
| `nest11-phase-1` | NestJS core 10→11 | `@nestjs/*` packages on `^11.1.x`, Express 5 wildcards, `@types/express@5` |
| `nest11-phase-2` | Database & Event Bus | TypeORM 11, Mongoose 8 / `@nestjs/mongoose` 11, EventEmitter 3, Config 4, Axios 4 |
| `nest11-phase-3` | GraphQL, Apollo, Swagger | Apollo 5, GraphQL 17, `@nestjs/graphql` 13, Swagger 11, `http-proxy-middleware@3` |
| `nest11-phase-4` | Microservices transport | gRPC 1.14, RMQ (no change), ioredis 5.4 |
| `nest11-phase-5a` | spotify-monolith | + real e2e |
| `nest11-phase-5b` | merch-*, user-purchases, mailing | + real e2e |
| `nest11-phase-5c` | DB-backed services (accounts, media, music-library, music-discovery) | + real e2e |
| `nest11-phase-5d` | BFFs (mobile-bff, web-bff) | + real e2e |
| `nest11-phase-6` | OpenTelemetry 0.221 + nestjs-otel 8 | new resource + metric reader API |
| `nest11-phase-7` | Final validation & hardening | cleanup, README, summary |
| `nest11-final` | = HEAD of `nest11-phase-7` | same commit |

## Diff

`git log nest11-phase-0..nest11-final --oneline`:

```
ceed7e3 chore(migration): phase 6 — OTel 0.221 + nestjs-otel 8
c3d5cbd feat(migration): phase 5d — BFFs + real e2e
1aa3bb4 feat(migration): phase 5c — DB-backed services + real e2e
bb3b3df feat(migration): phase 5b — merch-*, user-purchases, mailing + real e2e
5182104 feat(migration): phase 5a — spotify-monolith + real e2e
0388b18 chore(migration): phase 4 — microservices transport (gRPC, RMQ, Redis)
2d17e4b feat(migration): phase 3 — Apollo 5 + GraphQL 17 + Swagger 11
8a0b7aa chore(migration): phase 2 — bump TypeORM, Mongoose, EventEmitter, Config, Axios
902cbdb chore(migration): phase 1 — bump @nestjs/* core to ^11.1
3e9ab50 chore(migration): phase 0 — preflight & cleanup
```

## Highlights

- **Express 5** + `path-to-regexp` 8 (named wildcards).
- **Apollo Server 5** + **GraphQL 17** + `@nestjs/graphql` 13.
- **TypeORM 11**, **Mongoose 8** (with `@nestjs/mongoose` 11).
- **OpenTelemetry 0.221** + `nestjs-otel` 8 (API 1.9, `resourceFromAttributes`).
- `engines.node: ">=20"` + `.nvmrc` (`20`).
- 11 e2e suites, all green (8 mobile-bff GraphQL + 8 spotify-monolith +
  5 accounts + 4 media + 3 each merch-orders/merch-products +
  2 each merch-payment/user-purchases/web-bff + 1 mailing).
- `npm run build` and `npm test` green for all 20 projects.
- `npm run check:legacy-routes` (used during Phase 1 only) reports 0
  `LegacyRouteConverter` warnings.

## Reviewer checklist

- `git diff nest11-phase-0..nest11-final --stat` — should match the
  diff in the file-by-file summary in
  `artifacts/workspace/notes.md`.
- `npm ci --ignore-scripts` (re-installs the committed `package-lock.json`).
- `npm run build` — 20/20 projects.
- `npm test` — 12/12.
- For each `e2e:<service>` script that does not require infra, the
  unit-style invocation `npx jest --config ./apps/<app>/test/jest-e2e.json --maxWorkers 1`
  is green.
- The infra-dependent suites (`e2e:music-library`, `e2e:music-discovery`,
  and the original `db-scripts/start-database-test.sh`) are gated on the
  `infrastructure/local` and `infrastructure/test` docker-compose stacks.
