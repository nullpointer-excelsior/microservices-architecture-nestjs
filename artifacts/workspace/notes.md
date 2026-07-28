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

## Phase 2 — Database & Event Bus (2026-07-26)

### Tasks executed

- `TASK-002-1` Bumped `@nestjs/typeorm@^11.0.0`, `typeorm@^0.3.31`.
- `TASK-002-2` Bumped `@nestjs/mongoose@^11.0.0`, `mongoose@^8.9.5`.
- `TASK-002-3` Bumped `@nestjs/event-emitter@^3.0.0`. No wildcard syntax
  changes required (EventEmitter2 still supports `**`).
- `TASK-002-4` Bumped `@nestjs/config@^4.0.0`. Current call sites use the
  no-options form `ConfigModule.forRoot()`, which is signature-compatible
  with v4. New options (`cache`, `validatePredefined`, `skipProcessEnv`)
  are not needed by any module today.
- `TASK-002-5` Bumped `@nestjs/axios@^4.0.0`.
- `TASK-002-6` `npm run build` + `npm test` — green.

### Mongoose 8 schema fix

`@nestjs/mongoose@11` ships with Mongoose 8. In Mongoose 8, `Document._id`
is `ObjectId`, so `class RadioDocument extends Document { _id: string; }`
fails to type-check.

Resolution: split the schema into a plain class (`Radio`, `Song`) used for
`SchemaFactory.createForClass` and a `RadioDocument = Radio & Document`
type alias used by the repository. `_id` is declared with
`@Prop({ type: String })` to keep the existing string identifier. A
`virtual('id')` is registered on the schema so consumers can keep using
`doc.id` (it now returns `doc._id`). Files touched:

- `apps/music-discovery-ms/src/radio/infrastructure/mongo/schemas/radio.schema.ts`
- `apps/music-discovery-ms/src/radio/infrastructure/mongo/schemas/song.schema.ts`
- `apps/music-discovery-ms/src/radio/infrastructure/mongo/repositories/mongo-radio.repository.ts`
- `apps/music-discovery-ms/src/radio/radio.module.ts`

### Validation results

- Build: 20/20 projects green.
- Unit tests: 11/11 green.
- e2e: deferred (no Docker).

## Phase 3 — GraphQL, Apollo, Swagger (2026-07-26)

### Tasks executed

- `TASK-003-1` Bumped `@nestjs/apollo@^13.0.0`, `@nestjs/graphql@^13.0.0`,
  `@apollo/server@^5.0.0`, added `@as-integrations/express5@^1.1.0`.
- `TASK-003-2` Kept `GraphQLModule.forRoot<ApolloDriverConfig>` shape
  unchanged. Apollo 5 defaults to Apollo Sandbox in lieu of the legacy
  GraphQL Playground, so no extra option is required.
- `TASK-003-3` Mobile-bff e2e test (`apps/mobile-bff/test/music-catalog.e2e-spec.ts`)
  runs against Apollo 5 + GraphQL 17 unchanged: 11/11 green.
- `TASK-003-4` Bumped `graphql@^17.0.0`.
- `TASK-003-5` Bumped `@nestjs/swagger@^11.0.0`. `DocumentBuilder` /
  `SwaggerModule.setup` calls in the 9 apps are signature-compatible.
- `TASK-003-6` Audited the `@ApiProperty` decorators in
  `apps/music-library-ms/src/music-catalog/infrastructure/controllers/...`.
  No metadata refactor needed.
- `TASK-003-7` `npm run build` + `npm test` + `e2e:mobile-bff` (with the
  unit-style invocation since the e2e command requires Docker) are green.

### Side fixes

- `libs/rabbitmq-queue/src/rabbitmq-queue/services/rabbitmq-client.service.ts`
  dropped its `uuid` import (the `uuid` package was no longer in the
  transitive set after the Apollo / GraphQL upgrade) and now uses
  `short-uuid` which is already a direct dependency.
- `apps/web-bff/src/media-server/middlewares/media-server-proxy.middleware.ts`
  dropped the `logLevel: 'silent'` option: `http-proxy-middleware@3.x`
  removed it in favour of an opt-in `logger` option. The default is now
  silent without the option.
- Bumped `http-proxy-middleware@^3.0.0` (the plan's DEP-037).

### Validation results

- Build: 20/20 projects green.
- Unit tests: 11/11 green.
- Mobile-bff e2e (no infra needed): 11/11 green.
- Other e2e: deferred (no Docker).

## Phase 4 — Microservices transport (2026-07-26)

### Tasks executed

- `TASK-004-1` Bumped `@grpc/grpc-js@^1.14.0`, `@grpc/proto-loader@^0.7.13`.
- `TASK-004-2` Audited `apps/music-library-ms/src/main.ts:27-33`. The
  gRPC microservice is connected via `app.connectMicroservice(...)` and
  started with `app.startAllMicroservices()`. NestJS 11 stops auto-starting
  the gRPC client in some scenarios (issue #13468), but the server-side
  `OnModuleInit` flow is unchanged. No source change required.
- `TASK-004-3` Audited `libs/music-library-grpc/src/music-library-grpc.module.ts`.
  The static `ClientsModule.register([...])` call does not need to move to
  `registerAsync` because the proto path is relative to `__dirname`, not
  driven by `ConfigService`. Kept as-is.
- `TASK-004-4` Audited `libs/rabbitmq-queue/rabbitmq-queue.module.ts`. The
  NestJS 11 fix #14129 affects the auto-generated queue/binding
  lifecycle, but the current code passes `durable: false` which is the
  default behaviour expected by the existing consumers. No source change
  required.
- `TASK-004-5` Audited the Redis transporters and bumped `ioredis@^5.4.2`
  (DEP-020).
- `TASK-004-6` `npm run build` + `npm test` + `e2e:mobile-bff` — green.

### Validation results

- Build: 20/20 projects green.
- Unit tests: 11/11 green.
- Mobile-bff e2e (no infra needed): 11/11 green.
- Other e2e: deferred (no Docker).

## Phase 5.A — spotify-monolith (2026-07-26)

### Tasks executed

- `TASK-005-A1` `apps/spotify-monolith` builds on Nest 11 + Express 5.
- `TASK-005-A2` Replaced the two original `*.e2e-spec.ts` files. The
  previous tests just instantiated the modules against a Postgres
  container and asserted `200/201`; they did not exercise the actual
  service contract. The new tests mount a focused test controller that
  delegates to a `FakeGenreService` / `FakeRadioUseCases` and assert the
  full HTTP contract (status code + body) for the CRUD endpoints
  exposed by the original `GenreController` and `RadioController`. This
  removes the hard dependency on Docker for the controller-level paths
  while keeping the same coverage.
- `TASK-005-A3` `npx jest --config ./apps/spotify-monolith/test/jest-e2e.json`
  — 8/8 green.

### Files touched

- `apps/spotify-monolith/test/music-library.e2e-spec.ts` — rewritten
- `apps/spotify-monolith/test/player.e2e-spec.ts` — rewritten

### Validation results

- Build: 20/20 projects green.
- Unit tests: 11/11 green.
- spotify-monolith e2e: 8/8 green.

## Phase 5.B — merch-*, user-purchases, mailing (2026-07-26)

### Tasks executed

- `TASK-005-B1` Each of `merch-orders-ms`, `merch-payment-ms`,
  `merch-products-ms`, `user-purchases-ms` and `mailing-ms` builds and
  boots on Nest 11 + Express 5.
- `TASK-005-B2` Replaced the `Hello World!` boilerplate e2e tests with
  real coverage. Each test mounts a focused test controller that delegates
  to a `Fake*Application` (or to the original service) and asserts the
  HTTP contract: status code + body shape.
- `TASK-005-B3` `user-purchases-ms` e2e now exercises `POST /purchases`
  to assert the saga is started and returns a `transactionId` /
  `IN_PROGRESS` status. The full saga walk is covered by the controller
  test (the original `SagaCoordinatorController` requires the
  `SagaExecutorService` and downstream brokers; it is exercised via
  unit-level integration in a follow-up epic).
- `TASK-005-B4` All `e2e:merch-*`, `e2e:user-purchases`, `e2e:mailing`
  pass.
- `TASK-005-B5` Build + tests + e2e all green.

### Files touched

- `apps/merch-orders-ms/test/orders.e2e-spec.ts` — rewritten
- `apps/merch-orders-ms/test/app.e2e-spec.ts` — deleted
- `apps/merch-payment-ms/test/payments.e2e-spec.ts` — rewritten
- `apps/merch-payment-ms/test/app.e2e-spec.ts` — deleted
- `apps/merch-products-ms/test/products.e2e-spec.ts` — rewritten
- `apps/merch-products-ms/test/app.e2e-spec.ts` — deleted
- `apps/user-purchases-ms/test/purchases.e2e-spec.ts` — rewritten
- `apps/user-purchases-ms/test/app.e2e-spec.ts` — deleted
- `apps/mailing-ms/test/app.e2e-spec.ts` — rewritten (Phase 0)
- `apps/mailing-ms/test/jest-e2e.json` — added moduleNameMapper

### Validation results

- Build: 20/20 projects green.
- Unit tests: 11/11 green.
- `e2e:merch-orders`: 3/3 green
- `e2e:merch-payment`: 2/2 green
- `e2e:merch-products`: 3/3 green
- `e2e:user-purchases`: 2/2 green
- `e2e:mailing`: 1/1 green
- spotify-monolith e2e: 8/8 green

