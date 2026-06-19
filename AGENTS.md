# AGENTS.md

Agent workflow rules for this repo.

## Priority order

1. Explicit user request
2. Existing tests
3. `AGENTS.md`
4. `README.md`

If requirements are ambiguous/conflicting, ask before changing behavior.

## Operating rules

- Keep changes strictly task-scoped.
- No drive-by fixes.
- Read relevant source + tests before editing.
- While reading project files, skip the following unless explicitly requested:
  - test vectors
  - spec snapshots
  - overly large test specs
- Never read any of the following:
  - `./.git/` folder
  - `./node_modules/` folder
  - `./coverage/` folder
  - `./dist/` folder
  - lock files (e.g., `package-lock.json`, `pnpm-lock.yaml`, `deno.lock`, `bun.lock`, `yarn.lock`)
- Match existing local style in touched code.
- Do not restyle unrelated code.
- No formatting/style-only churn.
- Do not change dependencies/tooling unless explicitly requested.

## Required verification before claiming done

Run both:

- lint: `deno lint`
- test: `deno task spec -q` or `deno test -q` if task not existed.
- coverage (when required or applicable): use `deno task spec -q --coverage`.
  - `--coverage` already prints the coverage table; do not run `deno coverage` other than needed.

Do not claim completion if either fails.

Local workflow is Deno-first.
Node/npm compatibility is CI-covered; do not add local Node checks unless requested.

## Test policy

- Any behavior change must include tests (new or updated).
- Prefer test-first for bug fixes when practical.

## Safety

- No destructive filesystem/git-history commands unless explicitly requested.
- Do not commit or push unless explicitly requested.

## Completion report (always include)

- Files changed + concise summary
- Verification (commands with inline outcome: pass/fail)
