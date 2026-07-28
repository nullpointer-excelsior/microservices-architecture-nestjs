---
goal: Migrate the NestJS monorepo (12 apps + 8 libs) from NestJS 10 to NestJS 11.1.x with the full compatible ecosystem (Express 5, TypeORM 11, Mongoose 11, GraphQL 13/Apollo 5, Swagger 11, EventEmitter 3, Config 4, OpenTelemetry 0.221 + nestjs-otel 8) and replacement of broken/boilerplate e2e tests with real coverage.
version: 1.0
date_created: 2026-07-26
last_updated: 2026-07-26
owner: backend-architecture
status: 'Planned'
tags: ['upgrade', 'migration', 'nestjs', 'microservices', 'opentelemetry']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Migrate the entire `microservices-architecture-nestjs` monorepo from NestJS `^10.0.0` to `^11.1.x` (latest stable), upgrading in lockstep every first-party NestJS package, the OpenTelemetry stack, the GraphQL/Apollo driver, TypeORM/Mongoose wrappers, Swagger, Config and the Event Emitter. The plan also includes a **preflight phase** to fix pre-existing bugs discovered during the inventory (broken import, wrong service name, stale `nest-cli.json` entries, broken e2e tests), an **end-to-end validation phase**, and **real e2e tests** for the flows that today only carry `Hello World!` boilerplate.

The migration is executed **entirely on the current branch**, with no PRs, no remote pushes, and no branch switches. Each phase produces **one atomic commit** (source + `package-lock.json` together) and is marked with a tag `nest11-phase-<n>` once the relevant `npm run build`, `npm test` and `e2e:*` scripts are green. Each phase is independently reversible by `git reset --hard nest11-phase-<n>` (or `git revert` if the tag is already past); the tags also serve as bisection anchors. `package.json` `overrides` are used only as a last-resort safety net within a phase.

## 1. Requirements & Constraints

### Functional / Quality

- **REQ-001**: All 12 apps must `npm run build` with NestJS 11.1.x.
- **REQ-002**: All 8 libs must compile, and every `import '@lib/*'` must resolve.
- **REQ-003**: `npm test` (unit) and `npm run e2e:all` (e2e: music-library, mobile-bff, music-discovery) must pass on `node >= 20`.
- **REQ-004**: New e2e tests must be added for `mailing-ms`, `merch-orders-ms`, `merch-payment-ms`, `merch-products-ms`, `user-purchases-ms` and `accounts-ms` (saga flows + REST + integration events). Each must be wired into a new `e2e:<service>` npm script.
- **REQ-005**: Swagger UI must render correctly in the 9 apps that expose it, including after `@nestjs/swagger` 7 → 11.
- **REQ-006**: `/graphql` in `mobile-bff` must respond to introspection and a sample query after the Apollo 4 → 5 + GraphQL 16 → 17 migration.
- **REQ-007**: OpenTelemetry traces must be exported (HTTP, Express, PG, Pino, amqplib) with the same span coverage as before.
- **REQ-008**: No regression in microservices transport behaviour (gRPC server in `music-library-ms`, RMQ producer/consumer in `music-library-ms`, Redis pub/sub in `merch-*`, `user-purchases`, `mailing-ms`, `music-discovery-ms`, `accounts-ms`).
- **REQ-009**: All `LegacyRouteConverter` warnings (`*` wildcards in `forRoutes`) must be eliminated from logs.
- **REQ-010**: The monorepo must declare `engines.node: ">=20"`, a `.nvmrc` and the README must reflect the new Node version.

### Security

- **SEC-001**: No secret values committed; `.env` and `infrastructure/*/docker-compose` are treated as out-of-scope edits.
- **SEC-002**: Dependabot/Renovate advisories addressed by the upgrade (e.g. body-parser, multer 1.x) must be closed.
- **SEC-003**: After migration, `npm audit --omit=dev` must report no `high`/`critical` vulnerabilities introduced by the upgrade.

### Architectural / Style

- **ARC-001**: All 12 apps keep their current API surface (HTTP/GraphQL/gRPC/RMQ/Redis). No behavioural changes are made beyond what NestJS 11 forces.
- **ARC-002**: Hexagonal layout (domain / application / infrastructure) and `@lib/*` aliases are preserved.
- **ARC-003**: Code must stay in English (variables, comments). Match existing per-app folder conventions.
- **ARC-004**: No magic values; constants get descriptive names.
- **ARC-005**: TypeScript stays at `^5.7`. `tsconfig.json` keeps `target: "ES2021"`, `module: "commonjs"`, `emitDecoratorMetadata: true`. We will tighten `strict` only as a separate epic.

### Constraints

- **CON-001**: Execution is **100% local on the current branch**. No new branches are created, no PRs are opened, no remote is touched. The only git operations are `git add`, `git commit` and `git tag`.
- **CON-002**: Each phase must leave the monorepo in a buildable state. A failing `npm run build` or a red `e2e:*` script blocks the phase commit; the next phase does not start until the current one is green and tagged.
- **CON-003**: No deletion of `Hello World!` tests is allowed; they must be replaced by real tests (per the user's chosen option).
- **CON-004**: `package-lock.json` is regenerated with `npm install --ignore-scripts` and committed alongside the source diff in the same phase commit. Rollback = `git reset --hard nest11-phase-<n>` (or `git revert` if the tag is already past).
- **CON-005**: `node_modules` and `dist/` are recreated; they are git-ignored. No hand-edits of generated files.
- **CON-006**: Docker / MinIO / Postgres / Mongo / Redis infrastructure under `infrastructure/local` and `infrastructure/test` must be sufficient to run the new e2e tests.
- **CON-007**: Each phase commit must include: (a) the source diff, (b) the regenerated `package-lock.json`, (c) a dated entry in `artifacts/workspace/notes.md` referencing the phase number, and (d) the tag `nest11-phase-<n>` created on the commit immediately after it passes.

### Guidelines

- **GUD-001**: Apply the smallest possible diff per stage; prefer version bumps + automated codemods over manual rewrites.
- **GUD-002**: When a library has a codemod (e.g. `@nestjs/typeorm` migration notes, Apollo 4 → 5), use it before manual edits.
- **GUD-003**: Prefer `@Inject()` narrowing and intrinsic exceptions (new in v11) only where they improve clarity; do not chase every new API.
- **GUD-004**: Document every behavioural change in `artifacts/workspace/notes.md` with date and stage id.

### Patterns

- **PAT-001**: Dynamic module pattern: `Module.register({ ... })` and `Module.registerAsync({ useFactory, inject, imports })` is preserved.
- **PAT-002**: Domain events use `EventEmitter2` wildcards via `@lib/utils/seedwork` `DomainEventbusModule`. The wildcard listener `'com.clonespotify.discovery.**'` in `apps/music-discovery-ms/src/playlist-catalog/infrastructure/domain-events/domain-event.listener.ts` keeps its current syntax.
- **PAT-003**: Saga pattern: `OrchestationSagaModule` from `@lib/distributed-transactions/user-purchases` is the single source of truth for Redis-pubsub sagas.
- **PAT-004**: e2e tests use `supertest` for HTTP, `mongoose.connect` for Mongo, and `getRepositoryToken(Entity)` + `DataSource.manager.query` for TypeORM cleanup.
- **PAT-005**: BFFs use `http-proxy-middleware` directly, importing `Request, Response, NextFunction` from `express` (Express 5 still exports them).

## 2. Implementation Steps

> **Execution model (local, single branch):** All work happens on the current branch. The standard workflow per phase is:
> 1. Apply the tasks of the phase.
> 2. `npm install --ignore-scripts`.
> 3. `npm run build && npm test && npm run e2e:*` (the relevant subset) — all must be green.
> 4. Update `artifacts/workspace/notes.md` with a dated entry referencing the phase number.
> 5. `git add -A && git commit -m "chore(migration): phase <n> — <short description>"` (one commit per phase).
> 6. `git tag nest11-phase-<n>` on the commit.
>
> **Rollback:** `git reset --hard nest11-phase-<n>` to land on the last green phase. If the tag is already past, `git revert <commit-sha>` instead. **Bisection:** `git checkout nest11-phase-<n>` to land on a known-green state. **Mid-phase fix:** amend the current commit (`git commit --amend`) or add a fixup commit before tagging.
>
> Phases are ordered by **blast radius** (smallest first). The tags created by this plan are listed below.

| Phase | Tag | Working set |
|-------|-----|-------------|
| 0 — Preflight | `nest11-phase-0` | `package.json`, `.nvmrc`, `README.md`, `nest-cli.json`, three bug fixes, new `e2e:*` scripts |
| 1 — NestJS core | `nest11-phase-1` | `package.json`, `package-lock.json`, `apps/web-bff/src/media-server/media-server.module.ts` |
| 2 — DB & Event Bus | `nest11-phase-2` | `package.json`, `package-lock.json` |
| 3 — GraphQL, Apollo, Swagger | `nest11-phase-3` | `package.json`, `package-lock.json`, `apps/mobile-bff/**` |
| 4 — Microservices transport | `nest11-phase-4` | `package.json`, `package-lock.json`, `libs/{rabbitmq-queue,integration-events,music-library-grpc,distributed-transactions}/**` |
| 5 — App-by-app + e2e | `nest11-phase-5a` … `nest11-phase-5d` | one commit per sub-phase (5.A spotify-monolith, 5.B merch/user-purchases/mailing, 5.C DB apps, 5.D BFFs) |
| 6 — OpenTelemetry | `nest11-phase-6` | `package.json`, `package-lock.json`, `libs/shared/src/instrumentation/**` |
| 7 — Final validation | `nest11-phase-7` + `nest11-final` | README, `notes.md`, removal of temporary scripts |

### Implementation Phase 0 — Preflight & Cleanup

- **GOAL-0**: Repair pre-existing bugs and configuration debt so that the upgrade stages run on a clean baseline. Also pin Node 20 and create the artefacts that subsequent phases will commit to.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-000-1 | Create `artifacts/workspace/notes.md` with a "Phase 0 — Preflight" heading. |  |  |
| TASK-000-2 | Add `engines.node: ">=20"` to `package.json` and create `.nvmrc` with content `20`. |  |  |
| TASK-000-3 | Update `README.md` line 88 ("Node 18 o superior") to "Node 20 o superior" and document the upgrade. |  |  |
| TASK-000-4 | Fix `nest-cli.json`: remove the stale root project block pointing to `apps/microservices-architecture-nestjs/src` and the `shared/logger` sub-project at `libs/shared/logger` (neither directory exists). |  |  |
| TASK-000-5 | Fix `merch-products-ms/src/main.ts:32` `serviceName: "music-discovery-ms"` → `"merch-products-ms"`. |  |  |
| TASK-000-6 | Fix broken `import { Saga } from '@lib/utils/sagas'` in `apps/user-purchases-ms/src/purchase/purchase.module.ts:1`. Choose one: (a) restore the `Saga` builder in `libs/utils/src/sagas/index.ts` based on the existing usage in `purchase.module.ts:12-44`, or (b) remove the dead import. Document the choice in `notes.md`. |  |  |
| TASK-000-7 | Add `e2e:<service>` npm scripts for every app that does not have one: `e2e:accounts`, `e2e:mailing`, `e2e:merch-orders`, `e2e:merch-payment`, `e2e:merch-products`, `e2e:user-purchases`, `e2e:web-bff`, `e2e:media`, `e2e:spotify-monolith`. Each script must follow the pattern of `e2e:music-library` (env vars + `jest --config ./apps/<app>/test/jest-e2e.json --maxWorkers 1`). |  |  |
| TASK-000-8 | Replace `apps/mailing-ms/test/app.e2e-spec.ts` so it does not call `createNestApplication()` on a microservice app. Use `ClientsModule.register` + a fake `ClientProxy` that emits the `user-updated` pattern, then assert the side effect (e.g. a Spy on `EmailService.send`). |  |  |
| TASK-000-9 | Run `npm run build` and `npm test` to confirm the preflight does not break anything; record the result in `notes.md`. |  |  |
| TASK-000-10 | `git add -A && git commit -m "chore(migration): phase 0 — preflight & cleanup"` and `git tag nest11-phase-0`. |  |  |

### Implementation Phase 1 — NestJS Core 10 → 11 (no transport/ORM changes yet)

- **GOAL-1**: Bump every official `@nestjs/*` package to the 11.x line that does not require external breaking changes. Verify the build and existing e2e suites pass on Express 5 / `path-to-regexp` 8.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001-1 | In `package.json`, change the version ranges: `@nestjs/{common,core,microservices,platform-express,testing,cli,schematics}` to `^11.0.0`. Keep peer compatibility caps resolved by npm. |  |  |
| TASK-001-2 | Run `npm install --ignore-scripts`. |  |  |
| TASK-001-3 | If any compile error appears, address it: most likely a `path-to-regexp` 8 issue from `'audio/*' / 'cover/*'` in `apps/web-bff/src/media-server/media-server.module.ts:18`. Convert to named wildcards: `'audio/*path'` and `'cover/*path'`. |  |  |
| TASK-001-4 | If any TS error from `NestFactory.create` signature narrowing appears, add explicit type annotation: `NestFactory.create<NestExpressApplication>(ModuleClass)`. |  |  |
| TASK-001-5 | Run `npm run build` for all 12 apps. Fix any new error. |  |  |
| TASK-001-6 | Run `npm test` and `npm run e2e:all` (music-library, mobile-bff, music-discovery). They must pass before moving on. |  |  |
| TASK-001-7 | Add a temporary `npm run check:legacy-routes` script that boots each app and greps the stdout for `LegacyRouteConverter` warnings; record results in `notes.md`. There should be none after TASK-001-3. |  |  |
| TASK-001-8 | `git add -A && git commit -m "chore(migration): phase 1 — bump @nestjs/* core to ^11.1"` and `git tag nest11-phase-1`. |  |  |

### Implementation Phase 2 — Database & Event Bus

- **GOAL-2**: Upgrade TypeORM module, Mongoose module, Event Emitter and Config to their Nest 11-compatible lines. The DB apps are migrated last (Stage 5) but the module bumps happen now so that TypeScript types are consistent everywhere.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-002-1 | Bump `@nestjs/typeorm` to `^11.0.0`, `typeorm` to `^0.3.31` (latest 0.3). Run `npm install --ignore-scripts`. |  |  |
| TASK-002-2 | Bump `@nestjs/mongoose` to `^11.0.0`. `mongoose` is already at `^8.0.1`; align to `^8.9.5` for compatibility. |  |  |
| TASK-002-3 | Bump `@nestjs/event-emitter` to `^3.0.0`. Audit each `@OnEvent` listener: confirm wildcard syntax still works under EventEmitter2 v2 (it does, no code changes expected). |  |  |
| TASK-002-4 | Bump `@nestjs/config` to `^4.0.0`. Check the breaking change in `ConfigModule.forRoot({...})` (cache option, validation schema). Update `apps/music-library-ms/src/music-library-ms.module.ts` and `apps/music-discovery-ms/src/...` where `ConfigModule.forRoot({ isGlobal: true, ... })` is invoked. |  |  |
| TASK-002-5 | Bump `@nestjs/axios` to `^4.0.0` (latest 4.x). |  |  |
| TASK-002-6 | `npm run build` + `npm test` must pass. |  |  |
| TASK-002-7 | `git add -A && git commit -m "chore(migration): phase 2 — bump TypeORM, Mongoose, EventEmitter, Config, Axios"` and `git tag nest11-phase-2`. |  |  |

### Implementation Phase 3 — GraphQL, Apollo, Swagger

- **GOAL-3**: Migrate the GraphQL/Apollo driver and the Swagger setup to their 11.x-compatible lines. Mobile-bff's GraphQL endpoint and the 9 Swagger UIs are the only consumers.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-003-1 | Bump `@nestjs/graphql` to `^13.0.0`, `@nestjs/apollo` to `^13.0.0`, `@apollo/server` to `^5.0.0`, and add `@as-integrations/express5` to `^1.1.0` (required for Apollo 5 + Express 5). |  |  |
| TASK-003-2 | In `apps/mobile-bff/src/mobile-bff.module.ts:19-22`, update the `GraphQLModule.forRoot<ApolloDriverConfig>({ driver: ApolloDriver, autoSchemaFile: ... })` call to also pass `playground: false` (or move to `playground`/`plugins`/Apollo Sandbox). Validate the new Apollo 5 plugin signature. |  |  |
| TASK-003-3 | Adjust `apps/mobile-bff/test/music-catalog.e2e-spec.ts` if the introspection query or response shape changed. |  |  |
| TASK-003-4 | Bump `graphql` to `^17.0.0`. Re-run codemod if any (`graphql-codemod`). |  |  |
| TASK-003-5 | Bump `@nestjs/swagger` to `^11.0.0`. Audit each `DocumentBuilder()` + `SwaggerModule.setup('api', app, document)` call in the 9 apps — most are signature-compatible. |  |  |
| TASK-003-6 | In the 9 Swagger apps, replace any `@ApiProperty` decorator that lost a property in the v11 metadata refactor (the change is minimal but verify on `apps/music-library-ms/src/music-catalog/infrastructure/controllers/...`). |  |  |
| TASK-003-7 | `npm run build` + `npm test` + `npm run e2e:mobile-bff` must pass. |  |  |
| TASK-003-8 | `git add -A && git commit -m "feat(migration): phase 3 — Apollo 5 + GraphQL 17 + Swagger 11"` and `git tag nest11-phase-3`. |  |  |

### Implementation Phase 4 — Microservices Transport

- **GOAL-4**: Verify and tighten the gRPC, RMQ and Redis transports under `@nestjs/microservices` 11. Apply the new `status`/`unwrap` helpers only where they improve clarity (no forced refactor).

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004-1 | Bump `@nestjs/microservices` to `^11.0.0` (already pulled by Phase 1; confirm). Bump `@grpc/grpc-js` to `^1.14.0` and `@grpc/proto-loader` to `^0.7.13`. |  |  |
| TASK-004-2 | Audit `apps/music-library-ms/src/main.ts:27-33` `connectMicroservice({ transport: Transport.GRPC, options: { package: 'catalog', protoPath: ... } })`. The v11 gRPC client no longer auto-starts (bug fix #13468), which is a transparent improvement; confirm the gRPC controller's `OnModuleInit` no longer needs manual start. |  |  |
| TASK-004-3 | Audit `libs/music-library-grpc/src/music-library-grpc.module.ts:8` synchronous `ClientsModule.register([...])`; switch to `registerAsync` only if `useFactory` is needed for env-based config. Otherwise leave as-is. |  |  |
| TASK-004-4 | Audit RMQ: `libs/rabbitmq-queue/src/rabbitmq-queue.module.ts`. v11 fix #14129 changed how auto-generated queues/bindings work; ensure `queueOptions.durable: false` still produces the expected behaviour or move to `durable: true` if appropriate. |  |  |
| TASK-004-5 | Audit Redis transporter options in `libs/integration-events/src/transporters/redis/get-redis-options.ts` and `libs/distributed-transactions/src/user-purchases/orchestation-saga/transporters/pubsub/get-redis-options.ts`. Bump `ioredis` to `^5.4.2`. |  |  |
| TASK-004-6 | `npm run build` + `npm test` + `npm run e2e:all` must pass. |  |  |
| TASK-004-7 | `git add -A && git commit -m "chore(migration): phase 4 — microservices transport (gRPC, RMQ, Redis)"` and `git tag nest11-phase-4`. |  |  |

### Implementation Phase 5 — App-by-app migration on the already-bumped stack

- **GOAL-5**: With the core, ORM, GraphQL, Swagger and microservices packages already on 11.x, migrate each app in increasing blast-radius order, adding the **real e2e tests** as we go. Each app migration is a sub-stage that must leave the build green.

#### 5.A — `spotify-monolith` (in-memory, no transport)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005-A1 | Verify `apps/spotify-monolith/src/main.ts` boots on Nest 11 + Express 5. Fix any new TS error. |  |  |
| TASK-005-A2 | Replace `apps/spotify-monolith/test/{music-library,player}.e2e-spec.ts` so they hit real endpoints (use the existing test infra already in `apps/spotify-monolith/test/`). |  |  |
| TASK-005-A3 | `npm run start:spotify-monolith` and `npm run e2e:spotify-monolith` must pass. |  |  |
| TASK-005-A4 | `git add -A && git commit -m "feat(migration): phase 5a — spotify-monolith + real e2e"` and `git tag nest11-phase-5a`. |  |  |

#### 5.B — In-memory microservices (merch-*, user-purchases, mailing)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005-B1 | For each of `merch-orders-ms`, `merch-payment-ms`, `merch-products-ms`, `user-purchases-ms`, `mailing-ms`: boot the app and verify Redis pub/sub + REST endpoints. |  |  |
| TASK-005-B2 | Add a real e2e test for each `*Controller` REST route and each `@MessagePattern`/`@EventPattern` saga step. Use `ClientsModule.register` with a fake `ClientProxy` per TASK-000-8 pattern. |  |  |
| TASK-005-B3 | For `user-purchases-ms`, add a test that walks the full saga: emit `CreateOrderSaga.TRANSACTION` → assert it forwards to `merch-orders-ms`'s `EventPattern` (mocked) → assert compensation on error. |  |  |
| TASK-005-B4 | `npm run build` + `npm test` + all new `e2e:merch-*`, `e2e:user-purchases`, `e2e:mailing` must pass. |  |  |
| TASK-005-B5 | `git add -A && git commit -m "feat(migration): phase 5b — merch-*, user-purchases, mailing + real e2e"` and `git tag nest11-phase-5b`. |  |  |

#### 5.C — DB-backed services (accounts-ms, media-ms, music-library-ms, music-discovery-ms)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005-C1 | `accounts-ms`: validate `DatabaseModule.register` (TypeORM 11). Add e2e test for `POST /users` + Redis emit on `UserCreatedEvent`. |  |  |
| TASK-005-C2 | `media-ms`: validate S3 streaming code still compiles under Express 5 + `@types/express` ^5. Add e2e tests for `/audio/songs/:id` and `/cover/{artists,albums}/:id` against the local MinIO. |  |  |
| TASK-005-C3 | `music-library-ms`: validate `DatabaseModule.forRootAsync`, gRPC + REST in same process, RMQ producer. Existing e2e tests must still pass. |  |  |
| TASK-005-C4 | `music-discovery-ms`: validate `MongooseModule.forRootAsync` (Mongoose 8 + `@nestjs/mongoose` 11). E2E test for radio collection against the test Mongo (`mongodb://test:test@localhost:27020/test?authSource=admin`). |  |  |
| TASK-005-C5 | `npm run build` + `npm test` + `e2e:accounts`, `e2e:media`, `e2e:music-library`, `e2e:music-discovery` must pass. |  |  |
| TASK-005-C6 | `git add -A && git commit -m "feat(migration): phase 5c — DB-backed services + real e2e"` and `git tag nest11-phase-5c`. |  |  |

#### 5.D — BFFs (mobile-bff, web-bff)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005-D1 | `web-bff`: confirm `forRoutes('audio/*path', 'cover/*path')` no longer warns under `path-to-regexp` 8. Boot the app and hit `/home-library`. |  |  |
| TASK-005-D2 | `mobile-bff`: confirm GraphQL endpoint responds to introspection and a `radios` query after the Apollo 5 migration. Run `e2e:mobile-bff`. |  |  |
| TASK-005-D3 | Add an e2e test for `web-bff` that exercises the `home-library` GET and verifies the proxy is wired (mock the upstream). |  |  |
| TASK-005-D4 | `npm run build` + `npm test` + `e2e:mobile-bff` + `e2e:web-bff` must pass. |  |  |
| TASK-005-D5 | `git add -A && git commit -m "feat(migration): phase 5d — BFFs + real e2e"` and `git tag nest11-phase-5d`. |  |  |

### Implementation Phase 6 — OpenTelemetry 0.41 → 0.221 + nestjs-otel 5 → 8

- **GOAL-6**: Migrate the OpenTelemetry stack in `libs/shared/instrumentation`. The instrumentation stays opt-in per service (the 5 services that don't call `startOpenTelemetry` are not affected). This is the highest-risk stage and runs **after** everything else compiles, so that any telemetry regression is isolated.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006-1 | Bump all `@opentelemetry/*` to `^0.221.0` (instrumentation-*, exporter-*, sdk-node) and `@opentelemetry/api` to `^1.9.0`. Bump `nestjs-otel` to `^8.0.0`. Run `npm install --ignore-scripts`. |  |  |
| TASK-006-2 | Update `libs/shared/instrumentation/opentelemetry/start-opentelemetry.ts` to use the new `NodeSDK` constructor: `OTLPTraceExporter`, `PeriodicExportingMetricReader` with `OTLPMetricExporter`, `AsyncLocalStorageContextManager`, `Resource({ [SemanticResourceAttributes.SERVICE_NAME]: serviceName, [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion })`. |  |  |
| TASK-006-3 | In `InstrumentationModule` (`libs/shared/src/shared.module.ts`), update the `OpenTelemetryModule.forRoot(...)` call: pass `metrics: { host, port }` if metrics are required; otherwise keep metrics off. Confirm compatibility with nestjs-otel 8. |  |  |
| TASK-006-4 | Re-run each of the 7 services that calls `startOpenTelemetry` and check that a span is exported to the OTLP endpoint. Add a smoke test that creates a single span and asserts it is flushed. |  |  |
| TASK-006-5 | `npm run build` + `npm test` + `npm run e2e:all` must pass. |  |  |
| TASK-006-6 | `git add -A && git commit -m "chore(migration): phase 6 — OTel 0.221 + nestjs-otel 8"` and `git tag nest11-phase-6`. |  |  |

### Implementation Phase 7 — Final Validation & Hardening

- **GOAL-7**: Confirm the whole monorepo behaves identically to Nest 10, document the diff, and remove any temporary scaffolding.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007-1 | Run the full matrix: `npm run build` + `npm test` + `npm run e2e:all` + every new `e2e:<service>` script. Record results in `notes.md`. |  |  |
| TASK-007-2 | Boot `infrastructure/local` via `npm run start:infra` and exercise the spotify-monolith, mobile-bff, web-bff and one saga flow (`user-purchases` → `merch-orders` → `merch-payment`) end-to-end. Capture the trace IDs and confirm they appear in the OTLP collector. |  |  |
| TASK-007-3 | Remove temporary scripts: `check:legacy-routes` (added in Phase 1) once verified empty. |  |  |
| TASK-007-4 | Update `package.json` `description` and `README.md` to reflect Nest 11. Add a "Migration Notes" section linking to `artifacts/workspace/notes.md`. |  |  |
| TASK-007-5 | Final `npm audit --omit=dev` and `npm outdated` snapshot committed to `notes.md`. |  |  |
| TASK-007-6 | Write a one-page release summary at `artifacts/workspace/summary.md` listing all the `nest11-phase-*` tags and pointing reviewers to the diff between `nest11-phase-0` and `nest11-final`. |  |  |
| TASK-007-7 | `git add -A && git commit -m "chore(migration): phase 7 — final validation & hardening"` and `git tag nest11-phase-7`. |  |  |
| TASK-007-8 | `git tag nest11-final` on the same commit. |  |  |

## 3. Alternatives

- **ALT-001**: Big-bang single-commit migration touching all `package.json` versions at once. Rejected: high blast radius, hard to bisect regressions, no rollback other than `git reset --hard` to the pre-migration state. We chose phased migration with one commit per phase and tags for bisection.
- **ALT-002**: Skip OpenTelemetry in this migration and leave the SDK at 0.41 + `nestjs-otel` 5.1. Rejected per user's decision: it would leave the repo on a Nest 10-era observability stack and the next bump would be even harder.
- **ALT-003**: Migrate only the leaf apps (BFFs) and leave the saga core in Nest 10. Rejected: defeats the purpose of a monorepo upgrade and would force mixed versions in `package.json` (not viable with a single lockfile).
- **ALT-004**: Replace Swagger with Scalar in this same epic. Rejected: out of scope; it is a separate architectural decision that needs its own PRD.
- **ALT-005**: Rewrite the e2e tests using Testcontainers. Rejected for this plan: introduces a new infra dependency; the existing docker-compose under `infrastructure/test` is sufficient.
- **ALT-006**: Move to Fastify (`@nestjs/platform-fastify` 11) to drop Express 5 migration concerns. Rejected: the BFFs explicitly use `http-proxy-middleware` against Express types; switching adapters is a multi-week refactor unrelated to the Nest version.
- **ALT-007**: Use git branches and PRs for isolation. Rejected per user's feedback: the migration must be completed on the current branch with no remote pushes. We use local commits and tags instead.
- **ALT-008**: Drop the broken `Saga` builder and use a thin `EventPattern` controller (current `SagaCoordinatorController` approach). Considered as a sub-option of TASK-000-6.
- **ALT-009**: Trunk-based development with feature flags. Rejected: it would force runtime versioning of the Nest stack, which is not supported; the per-phase commit model is a better fit for a multi-day framework upgrade.

## 4. Dependencies

### Runtime packages (target versions)

- **DEP-001**: `@nestjs/common@^11.1.0`
- **DEP-002**: `@nestjs/core@^11.1.0`
- **DEP-003**: `@nestjs/microservices@^11.1.0`
- **DEP-004**: `@nestjs/platform-express@^11.1.0`
- **DEP-005**: `@nestjs/config@^4.0.0`
- **DEP-006**: `@nestjs/typeorm@^11.0.0`
- **DEP-007**: `@nestjs/mongoose@^11.0.0`
- **DEP-008**: `@nestjs/graphql@^13.0.0`
- **DEP-009**: `@nestjs/apollo@^13.0.0`
- **DEP-010**: `@nestjs/swagger@^11.0.0`
- **DEP-011**: `@nestjs/event-emitter@^3.0.0`
- **DEP-012**: `@nestjs/axios@^4.0.0`
- **DEP-013**: `@nestjs/cli@^11.0.0`
- **DEP-014**: `@nestjs/schematics@^11.0.0`
- **DEP-015**: `@nestjs/testing@^11.0.0`
- **DEP-016**: `@apollo/server@^5.0.0` + `@as-integrations/express5@^1.1.0`
- **DEP-017**: `graphql@^17.0.0`
- **DEP-018**: `typeorm@^0.3.31`
- **DEP-019**: `mongoose@^8.9.5`
- **DEP-020**: `ioredis@^5.4.2`
- **DEP-021**: `@grpc/grpc-js@^1.14.0`
- **DEP-022**: `rxjs@^7.8.2`
- **DEP-023**: `express@^5.2.1` (transitive)
- **DEP-024**: `path-to-regexp@^8.4.2` (transitive)
- **DEP-025**: `multer@^2.2.0` (transitive; replace 1.x)
- **DEP-026**: `body-parser@^2.3.0` is no longer a direct dep (Express 5 has built-ins)
- **DEP-027**: `nestjs-otel@^8.0.0`
- **DEP-028**: `@opentelemetry/api@^1.9.0`
- **DEP-029**: `@opentelemetry/sdk-node@^0.221.0`
- **DEP-030**: `@opentelemetry/exporter-trace-otlp-proto@^0.221.0`
- **DEP-031**: `@opentelemetry/exporter-metrics-otlp-proto@^0.221.0`
- **DEP-032**: `@opentelemetry/instrumentation-{http,express,pg,pino,amqplib}@^0.221.0`
- **DEP-033**: `@opentelemetry/resources@^2.0.0` + `@opentelemetry/semantic-conventions@^1.27.0`
- **DEP-034**: `typescript@^5.7.0`
- **DEP-035**: `@types/node@^20.0.0`
- **DEP-036**: `@types/express@^5.0.0`
- **DEP-037**: `http-proxy-middleware@^3.0.0` (Express 5 compatibility)

### Dev tools

- **DEP-038**: `eslint@^9.0.0` (optional; Nest 11 dev-deps use it, but the project currently uses 8.x and is left alone in this plan).
- **DEP-039**: `jest@^29.5.0` (kept; no major bump required).
- **DEP-040**: `supertest@^7.0.0` (latest line, no breaking change for our usage; bump opportunistically).

### Internal

- **DEP-041**: All 8 libs in `libs/*` must be re-built (`nest build <lib>`) and their consumers re-imported. The `nest-cli.json` monorepo handles this automatically.
- **DEP-042**: `infrastructure/local` and `infrastructure/test` docker-compose stacks must still start with the same env vars in `.env`.

## 5. Files

### Configuration

- **FILE-001**: `package.json` — version bumps in `dependencies` and `devDependencies`, `engines.node` addition, removal of `@types/express@^4` in favour of `^5`, optional addition of new `e2e:*` scripts.
- **FILE-002**: `package-lock.json` — regenerated on each phase and committed alongside `package.json`; bisection via `git checkout nest11-phase-<n>`.
- **FILE-003**: `nest-cli.json` — Phase 0: remove stale root project block and the `shared/logger` sub-project. Phase 1+: no changes.
- **FILE-004**: `tsconfig.json` — bump `typescript` engine to 5.7 (no `compilerOptions` change required). Consider enabling `strict: true` in a follow-up.
- **FILE-005**: `tsconfig.build.json` — likely unchanged; verify.
- **FILE-006**: `.nvmrc` — new file with content `20`.
- **FILE-007**: `README.md` — Node 18 → 20, link to migration notes.

### Libraries (touched by Phase 1–4 type changes)

- **FILE-008**: `libs/shared/src/instrumentation/opentelemetry/start-opentelemetry.ts` — OTel SDK 2.x constructor.
- **FILE-009**: `libs/shared/src/shared.module.ts` — `OpenTelemetryModule.forRoot` for nestjs-otel 8.
- **FILE-010**: `libs/rabbitmq-queue/src/rabbitmq-queue.module.ts` — RMQ options review (Phase 4).
- **FILE-011**: `libs/integration-events/src/transporters/redis/get-redis-options.ts` — Redis transporter review.
- **FILE-012**: `libs/music-library-grpc/src/music-library-grpc.module.ts` — gRPC client review.
- **FILE-013**: `libs/distributed-transactions/src/user-purchases/orchestation-saga/transporters/{get-user-purchases-microservice-options,pubsub/get-redis-options}.ts` — Redis wildcards option.

### Apps (touched by Phase 5)

- **FILE-014**: `apps/web-bff/src/media-server/media-server.module.ts:18` — wildcard syntax `audio/*` → `audio/*path`.
- **FILE-015**: `apps/merch-products-ms/src/main.ts:32` — fix `serviceName`.
- **FILE-016**: `apps/user-purchases-ms/src/purchase/purchase.module.ts:1` — fix or remove `Saga` import.
- **FILE-017**: `apps/mobile-bff/src/mobile-bff.module.ts:19-22` — GraphQL/Apollo 5 setup.
- **FILE-018**: `apps/spotify-monolith/src/main.ts` — possible `NestExpressApplication` typing.
- **FILE-019**: `apps/music-library-ms/src/music-library-ms.module.ts:11-28` — `ConfigModule.forRoot` v4 changes.
- **FILE-020**: `apps/music-discovery-ms/src/radio/radio.module.ts:13` — `MongooseModule` v11 review.

### New artifacts

- **FILE-021**: `artifacts/workspace/notes.md` — running log per phase; committed on each phase branch.
- **FILE-022**: `artifacts/workspace/summary.md` — final release notes with a list of `nest11-phase-*` tags and a `git log nest11-phase-0..nest11-final --oneline` excerpt.

### E2E tests (new files)

- **FILE-024**: `apps/accounts-ms/test/users.e2e-spec.ts` (replace `Hello World!`).
- **FILE-025**: `apps/mailing-ms/test/app.e2e-spec.ts` (rewritten as microservice test).
- **FILE-026**: `apps/merch-orders-ms/test/orders.e2e-spec.ts` (replace `Hello World!`).
- **FILE-027**: `apps/merch-payment-ms/test/payments.e2e-spec.ts` (replace `Hello World!`).
- **FILE-028**: `apps/merch-products-ms/test/products.e2e-spec.ts` (replace `Hello World!`).
- **FILE-029**: `apps/user-purchases-ms/test/purchases.e2e-spec.ts` (replace `Hello World!` with a full saga walk).
- **FILE-030**: `apps/web-bff/test/app.e2e-spec.ts` (replace `Hello World!`).
- **FILE-031**: `apps/media-ms/test/app.e2e-spec.ts` (replace `Hello World!`).
- **FILE-032**: `apps/spotify-monolith/test/{music-library,player}.e2e-spec.ts` (kept and extended).

## 6. Testing

### Unit

- **TEST-001**: Existing `*.spec.ts` files in `apps/*` and `libs/*` (e.g. `libs/utils/src/seedwork/model.spec.ts`) must pass under Jest 29 + `ts-jest` 29 + TS 5.7.
- **TEST-002**: Add a new unit test for the rewritten `start-opentelemetry.ts` verifying that `NodeSDK` is constructed with the expected resource attributes.
- **TEST-003**: Add a unit test for the `Saga` builder (if TASK-000-7 chose option (a) — restore the builder).

### E2E (per app)

- **TEST-004**: `e2e:spotify-monolith` — REST CRUD on `/songs`, `/albums`, `/artists`, `/playlists`, `/radios`; `EventEmitter` event `library.album.created` reaches the `NewAlbumListener`.
- **TEST-005**: `e2e:music-library` (existing, must still pass) — REST on `/songs|albums|artists|genres`, gRPC on `ArtistService`/`AlbumService`/`SongService`/`GenreService`, RMQ emit on album creation.
- **TEST-006**: `e2e:music-discovery` (existing, must still pass) — REST on `/radios`, `/playlists`, `/user-catalog`; Redis integration event for `user-updated`.
- **TEST-007**: `e2e:mobile-bff` (existing) — GraphQL introspection + `radios` query + `songs` query with mocked `MusicCatalogClient`.
- **TEST-008**: `e2e:web-bff` (new) — `GET /home-library` returning aggregated catalog.
- **TEST-009**: `e2e:accounts` (new) — `POST /users` returns 201 and the `UserCreatedEvent` is published to Redis (asserted via a fake `ClientProxy`).
- **TEST-010**: `e2e:mailing` (rewritten) — Redis microservice receives `user-updated` and the `EmailService.send` is called.
- **TEST-011**: `e2e:media` (new) — `GET /audio/songs/:id` returns binary content (mocked S3 client) and `GET /cover/{artists,albums}/:id` returns image bytes.
- **TEST-012**: `e2e:merch-orders` (new) — `POST /orders` 202 and a `CreateOrderSaga.TRANSACTION` event is emitted; `PATCH /orders/status` 200.
- **TEST-013**: `e2e:merch-payment` (new) — `POST /payments` and saga transaction/compensation round-trip.
- **TEST-014**: `e2e:merch-products` (new) — `GET /products`, `GET /products/:sku`; `UpdateStockSaga` + `DeliverySaga` happy path.
- **TEST-015**: `e2e:user-purchases` (new) — full saga: emit `CreateOrderSaga.TRANSACTION` → assert it reaches all downstream mock saga controllers → on `CreatePaymentSaga.ERROR` assert `CreateOrderCompensation` and `UpdateStockCompensation` are emitted.

### Integration

- **TEST-016**: Start `infrastructure/local` and exercise the BFF → microservice path manually via `curl`/REST. Capture the OTLP trace IDs.
- **TEST-017**: Run `npm audit --omit=dev` after each stage and assert no new high/critical CVE.

### Regression

- **TEST-018**: Run the full matrix `npm run build && npm test && npm run e2e:all && npm run e2e:spotify-monolith && npm run e2e:web-bff && npm run e2e:media && npm run e2e:accounts && npm run e2e:mailing && npm run e2e:merch-orders && npm run e2e:merch-payment && npm run e2e:merch-products && npm run e2e:user-purchases` in Phase 7 and confirm green.

## 7. Risks & Assumptions

### Risks

- **RISK-001**: NestJS 11 ships Express 5 + `path-to-regexp` 8. The `LegacyRouteConverter` auto-fixes most patterns but emits warnings; if those warnings hide a real bug, the auto-conversion may pick a different parameter name (`path`, `splat`, etc.) than the handler expects.
- **RISK-002**: `@nestjs/graphql` 13 + `@apollo/server` 5 + GraphQL 17 is the largest semantic-version jump in the plan. The mobile-bff's resolvers use `@Resolver(of => ...)` and `@Query(returns => ...)` which are stable, but the `autoSchemaFile` generated types may shift.
- **RISK-003**: OpenTelemetry 0.41 → 0.221 is a 4-major-version jump. The `OTLPMetricExporter`, `PeriodicExportingMetricReader` and `Resource` shape changed. The `nestjs-otel` 8 wrapper may not accept the same options as 5.x.
- **RISK-004**: The `Saga` builder in `apps/user-purchases-ms` is broken. Restoring it (option a) requires reverse-engineering the API from the call site; if the saga semantics depend on this builder, removing it (option b) would break the orchestrator.
- **RISK-005**: Several e2e tests currently use `createNestApplication()` on a microservice app or are `Hello World!` stubs. Building real tests for 6 services multiplies the test surface that the CI must run; runtime of `e2e:all` may exceed 5 minutes.
- **RISK-006**: `@grpc/grpc-js` 1.14 changed default keepalive behaviour; this can cause long-lived gRPC streams in `music-library-ms` to drop under load. Mitigation: keep server-side `keepalive` and `keepaliveTimeMs` explicit.
- **RISK-007**: Node 20 LTS is required; macOS/Linux dev machines on Node 18 will be unable to run the new code locally until `.nvmrc` is honoured.
- **RISK-008**: `body-parser` is no longer a direct dep under Express 5; if any custom middleware relied on it (none found in the inventory, but verify), it will fail at runtime.
- **RISK-009**: `http-proxy-middleware` 2.x may emit deprecation warnings or break on Express 5. Bumping to 3.x is the safe path but the BFF middlewares were written against the 2.x API.
- **RISK-010**: `@nestjs/event-emitter` 3 changed how wildcard events propagate. The listener `'com.clonespotify.discovery.**'` in `apps/music-discovery-ms` may stop receiving events if the EventEmitter2 internal delimiter handling changed.
- **RISK-011**: `multer` 2.x (transitive bump) is incompatible with `@types/multer` 1.x. The project does not currently use file uploads (per inventory), but if Swagger file decorators are added, they would need a type bump.

### Assumptions

- **ASSUMPTION-001**: The 7 OpenTelemetry-instrumented services all run on Linux/Docker desktop and can reach the OTLP collector defined in `.env`. If no OTLP endpoint is available, the SDK should fail soft (it does today) and not break boot.
- **ASSUMPTION-002**: `infrastructure/local` and `infrastructure/test` compose files are kept in sync with the migrated code. The plan does not edit compose files.
- **ASSUMPTION-003**: The current branch is the target of the migration; no other branches will be created or switched to during execution. All commits and tags are local.
- **ASSUMPTION-004**: The `multer` and `body-parser` bumps only affect transitive code paths; no app in the inventory uses them directly.
- **ASSUMPTION-005**: The 5 services that do not call `startOpenTelemetry` (accounts-ms, merch-orders-ms, merch-payment-ms, user-purchases-ms, spotify-monolith) will not be retro-fitted with OTel in this plan.
- **ASSUMPTION-006**: `@nestjs/axios` 4 is API-compatible with the current usage (`HttpService.get(...).pipe(...)` and `lastValueFrom(...)`).
- **ASSUMPTION-007**: `graphql@17` is API-compatible with the existing GraphQL resolvers in mobile-bff; no schema changes are required.
- **ASSUMPTION-008**: No long-running production deployment is in flight during the migration window; if a hotfix to the current branch is required mid-migration, the active phase commit is amended or a fixup commit is added before tagging.

## 8. Related Specifications / Further Reading

- NestJS 11.0.0 release notes: https://github.com/nestjs/nest/releases/tag/v11.0.0
- NestJS migration guide: https://docs.nestjs.com/migration-guide
- Trilon announcement: https://trilon.io/blog/announcing-nestjs-11-whats-new
- `@nestjs/config` 4.0 breaking changes: https://github.com/nestjs/config/releases/tag/4.0.0
- `@nestjs/cli` 11.0 release notes: https://github.com/nestjs/nest-cli/releases/tag/11.0.0
- `@nestjs/cache-manager` 3.0 release notes (not used here, listed for context): https://github.com/nestjs/cache-manager/releases/tag/3.0.0
- Apollo Server 5 migration: https://www.apollographql.com/docs/apollo-server/migration
- Express 5 release notes: https://expressjs.com/en/changelog/5x.html
- path-to-regexp 8 release notes: https://github.com/pillarjs/path-to-regexp/releases
- OpenTelemetry JS v2 upgrade: https://opentelemetry.io/blog/2025/js-v2/
- nestjs-otel changelog: https://github.com/pragmaticivan/nestjs-otel/releases
- Internal doc: `docs/microservices-communication.md`
- Internal doc: `docs/distributed-transaction-with-saga-patterns.md`
- Internal doc: `docs/domain-events-vs-integration-events.md`
- Internal doc: `docs/distributed-traces.md`
