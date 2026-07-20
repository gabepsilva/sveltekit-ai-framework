# Weltkit

[![CI](https://github.com/gabepsilva/sveltekit-ai-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/gabepsilva/sveltekit-ai-framework/actions/workflows/ci.yml)

An experimental SvelteKit foundation designed for development driven primarily by AI agents. The repository emphasizes deterministic, reviewable quality gates before application features are added.

## Requirements

- Bun 1.3.9
- Docker with a running daemon
- Chromium, Firefox, and WebKit installed through Playwright

```bash
bun install --frozen-lockfile
bunx playwright install --with-deps chromium firefox webkit
```

## Development

```bash
bun run dev
```

## Quality gates

| Command                   | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `bun run verify`          | Static checks, coverage, mutation tests, build, and budgets.  |
| `bun run test:e2e`        | Local E2E flows in Chromium and Firefox.                      |
| `bun run test:e2e:all`    | Adds WebKit when its host libraries are installed.            |
| `bun run security`        | Gitleaks, Semgrep, Trivy, and ZAP-proxied Chromium.           |
| `bun run ci`              | The complete local and hosted merge gate.                     |
| `bun run test:mutation`   | Measures whether tests detect deliberately introduced faults. |
| `bun run check:workflows` | Validates GitHub Actions workflows with Actionlint.           |

Generated reports are written under `coverage/`, `playwright-report/`, and `reports/`. They are ignored by Git and uploaded by GitHub Actions.

## Pull requests

The `main` branch is protected by the hosted `CI / Quality and security` check. The Codex review job is advisory and runs only after deterministic CI succeeds. It is enabled for same-repository pull requests after the repository secret `OPENAI_API_KEY` is configured.

Repository-specific agent and review rules live in `AGENTS.md`. Workshop setup and the full before/current quality table live in `Basic Start.md`.

Deployment configuration is intentionally deferred until the target environment and SvelteKit adapter are selected.
