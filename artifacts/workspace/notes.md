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

Pending Phase 1 (the build is exercised on the upgraded stack).

