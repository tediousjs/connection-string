# Copilot Instructions

## Build, Test & Lint

```sh
npm run build        # TypeScript compilation (src/ → lib/)
npm test             # Run all tests
npm run lint         # ESLint on src/ and test/
```

Run a single test file:

```sh
npx tsx --test test/parser/connection-string.test.ts
```

Run a single test by name:

```sh
npx tsx --test --test-name-pattern="coerces a boolean" test/connection-string.test.ts
```

## Architecture

This library parses and builds SQL-style connection strings (e.g. `Key=Value;Key2=Value2`).

- **`src/parser/connection-string-parser.ts`** — A character-by-character state machine parser. Handles quoting (`"`, `'`, `{}`), escaped quotes via doubling, and key/value terminators (`=` and `;`).
- **`src/connection-string.ts`** — `ConnectionString` class that wraps the parser output in a `ReadonlyMap<string, string>`. All keys are lowercased. Provides `get()` with optional type coercion (`string`, `number`, `boolean`) and `toSchema()` for mapping parsed values to a typed schema definition.
- **`src/builder/index.ts`** — `build()` function that serializes a `Record<string, value>` back into a connection string, auto-quoting values with `{}` when they contain special characters.
- **`src/schema/mssql-schema.ts`** — Built-in MSSQL schema definition with property aliases (e.g. `Server` → `data source`).

## Conventions

- **Node.js built-in test runner** — Tests use `node:test` (`describe`/`it`) and `node:assert`. No third-party test framework.
- **Fixture-driven parser tests** — Parser tests in `test/parser/` load test cases from JSON fixture files (`test/parser/fixture/`). Add new parser test cases there rather than writing individual test functions.
- **4-space indentation, single quotes, semicolons** — Enforced by `@stylistic/eslint-plugin` via `eslint.config.mjs`.
- **Commit messages:** Follow [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint. Semantic-release uses these to generate automated releases and changelogs, so correct commit types are critical.
  - `fix` — Bug fixes or behavioural corrections. Triggers a **patch** release.
  - `feat` — New backwards-compatible functionality. Triggers a **minor** release.
  - `feat!` (or any type with `!`) — Breaking changes. Triggers a **major** release.
  - `chore`, `ci`, `style`, `test` — **Do not trigger a release.**
  - Only `fix` and `feat` trigger releases. If a change doesn't neatly fit either but still needs to be released, use whichever is most appropriate.
- **Commits and merges:**
  - Commits should be atomic and ideally deployable in isolation — all tests, linting, and commitlinting should pass on each individual commit.
  - PRs are merged using a **merge commit** (no squash-merge or rebase-merge). Each commit in the PR history is preserved.
  - To keep branches up to date with the base branch, **rebase** onto it rather than merging it in.
  - All changes must go through a **pull request** — no direct commits to master.
- **Imports:** Use the `type` keyword for type-only imports (e.g., `import type { Foo } from './bar'`). When importing both types and values from the same module, use a single import with inline `type` (e.g., `import { type Foo, bar } from './baz'`).
- **Node 22** — Target runtime specified in `.nvmrc`.
- **Keeping this file up to date:** If a change affects the architecture, conventions, build process, or any other information documented here, update this file as part of the same PR.
