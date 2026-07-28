# Migration Notes — NestJS 10 → 11.1.x

This file is a running log of the NestJS 11 migration. Each phase appends a dated
section with: what changed, validation results, and any follow-up tasks.

## Phase 0 — Preflight (2026-07-26)

Pre-existing bugs fixed, Node 20 baseline, missing `e2e:*` scripts added, and the
broken mailing-ms e2e test was replaced with a real microservice test.

### Tasks executed

- `TASK-000-1` Created `artifacts/workspace/notes.md` (this file).
- `TASK-000-2` Added `engines.node: ">=20"` and created `.nvmrc` with `20`.
- `TASK-000-3` Updated README: Node 18 → 20, link to migration notes.
- `TASK-000-4` Cleaned `nest-cli.json`: removed the stale `apps/microservices-architecture-nestjs`
  root project block and the `shared/logger` sub-project (directories do not exist).
- `TASK-000-5` Fixed `apps/merch-products-ms/src/main.ts:32` service name
  (`music-discovery-ms` → `merch-products-ms`).
- `TASK-000-6` Restored the `Saga` builder in `libs/utils/src/sagas/index.ts`
  based on the call site in `apps/user-purchases-ms/src/purchase/purchase.module.ts`.
  The call uses `Saga.builder().start({...}).step({...})...build()`, so the
  builder was re-implemented with the minimum surface area required. The
  `Saga` import in `purchase.module.ts` is now valid again.
- `TASK-000-7` Added missing `e2e:<service>` npm scripts.
- `TASK-000-8` Replaced the broken `app.e2e-spec.ts` in `mailing-ms` with a
  test that uses `ClientsModule.register` + a fake `ClientProxy` to emit
  the `user-updated` pattern, then asserts the `EmailService.send` side
  effect via a spy.

### Decisions

- **`Saga` builder (TASK-000-6)** — chose option (a): restore the builder.
  The `purchase.module.ts` call site already encodes the saga shape
  (`start` + repeated `step` + `build`), so the minimal re-implementation
  keeps the existing orchestrator intact and the diff minimal.

### Validation

- `npm run build` — passes for all 20 projects (12 apps + 8 libs).
- `npm test` — 11/11 tests pass.
- `npm run e2e:all` — not exercised: `infrastructure/test` requires Docker
  (Postgres, MongoDB, Redis, RabbitMQ); the daemon is unavailable in the
  current sandbox. Per `CON-002`, the phase commit is gated on the build
  and unit tests only; e2e coverage is re-validated in Phase 7 once
  Docker is available.

## Phase 1 — NestJS Core 10 → 11 (2026-07-26)

### Tasks executed

- `TASK-001-1` Bumped `@nestjs/{common,core,microservices,platform-express,testing}`
  to `^11.1.0` and `@nestjs/{cli,schematics}` to `^11.0.0`.
- `TASK-001-2` Installed with `npm install --ignore-scripts --legacy-peer-deps`
  (the remaining `@nestjs/*` packages — `apollo`, `graphql`, `typeorm`, etc. —
  still on the v10 line; their peer range conflicts with the v11 core. The
  `--legacy-peer-deps` flag is the standard resolution at this stage and
  the lockfile is committed alongside the source).
- `TASK-001-3` Updated `apps/web-bff/src/media-server/media-server.module.ts`
  to use the named wildcard `'audio/{*path}'` / `'cover/{*path}'` for
  Express 5 / `path-to-regexp` 8.
- `TASK-001-4` Bumped `@types/express` to `^5.0.0`.
- `TASK-001-5` `npm run build` — passes for all 20 projects.
- `TASK-001-6` `npm test` — 11/11 tests pass.
- `TASK-001-7` Added `check:legacy-routes` script (`scripts/check-legacy-routes.mjs`).
  It greps the source tree for `forRoutes(...)` with unnamed wildcards.
  Current run: **no findings**.

### Validation results

- Build: 20/20 projects green.
- Unit tests: 11/11 green.
- Legacy routes: 0/0.
- e2e: deferred (no Docker); re-validated in Phase 7.

### Notes / follow-ups

- The `build` script in `package.json` was updated to enumerate the projects
  (the previous `nest build` relied on a default `apps/microservices-architecture-nestjs/src`
  root that did not exist and silently failed at `npm run build`).
- `--legacy-peer-deps` is the operative flag throughout the in-progress
  phase. Subsequent phases bump the remaining `@nestjs/*` packages so the
  flag is no longer needed.

