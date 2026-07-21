# Weltkit quality system

Weltkit is designed for development driven primarily by AI agents. Its quality system aims to reject common forms of low-quality generated code with repeatable evidence before a change can merge.

The goal is quality code that builds and runs locally. Deployment infrastructure, TLS, cloud networking, scaling, and production operations are intentionally outside the current scope.

## Current coverage summary

The final column is intentionally trigger-based. “No action now” means another tool would add more maintenance and noise than useful protection.

| Area                              | Current state          | Current control                                                               | Next worthwhile action and trigger                                                                                  |
| --------------------------------- | ---------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Formatting                        | Strong                 | Prettier passes and is a hard gate.                                           | No action now. Add a rule only if a recurring formatting escape appears.                                            |
| Type safety                       | Strong                 | Strict TypeScript and Svelte warnings fail CI.                                | Add runtime schemas when untrusted API, form, environment, or persisted data first enters the application.          |
| JavaScript and TypeScript smells  | Strong                 | Type-aware ESLint rejects unsafe patterns and warnings.                       | No extra linter now. Add a focused rule only after the same defect escapes review more than once.                   |
| Svelte mistakes                   | Strong                 | Compiler diagnostics and recommended Svelte rules are enforced.               | No action now. Revisit only for a framework upgrade or a demonstrated Svelte-specific escape.                       |
| Test discipline                   | Strong                 | Assertions are required; disabled, focused, and skipped tests are rejected.   | No action now. Add a rule only when a repeated shallow-test pattern is identified.                                  |
| Unit and component infrastructure | Strong                 | Vitest server and real-browser component projects are gated.                  | Add another test environment only when real code behaves differently outside the existing Node and browser targets. |
| Feature test breadth              | Partial                | The infrastructure exists, but the starter contains few behaviors.            | Add acceptance tests with every feature, covering its important success, failure, and permission paths.             |
| Numeric coverage                  | Partial                | Global line, function, branch, and statement thresholds are 80 percent.       | Add changed-line coverage when project averages become large enough to hide untested new code.                      |
| Mutation coverage                 | Strong baseline        | Reusable TypeScript logic must reach an 80 percent mutation score.            | Extend mutation targets when meaningful domain or server logic exists outside the current target.                   |
| E2E behavior                      | Partial                | Chromium, Firefox, and WebKit execute the built application.                  | Add only critical user flows as they are implemented; do not create speculative browser tests.                      |
| Accessibility                     | Partial                | Svelte diagnostics and runtime Axe checks cover exercised pages.              | Add scans for each new interactive page, modal, error state, and keyboard workflow.                                 |
| Dead code and dependencies        | Strong                 | Knip rejects unused files, exports, and dependencies.                         | No action now. Configure new entry points only when Knip cannot discover a legitimate framework entry.              |
| Production build                  | Strong                 | The optimized SvelteKit build is mandatory.                                   | Select and test a concrete adapter only when a real deployment target is chosen.                                    |
| Static application security       | Strong baseline        | Semgrep runs pinned general and project-specific rules.                       | Add a project rule after a real security escape or when a new trust boundary introduces a known forbidden pattern.  |
| Dependencies and secrets          | Strong                 | Gitleaks scans tree/history; Trivy blocks High and Critical findings.         | Add license or software inventory policy only before public distribution, customer delivery, or compliance work.    |
| Runtime HTTP security             | Partial                | ZAP passively observes browser-driven application traffic.                    | Add active scanning only after a deployed authentication or API surface makes it materially useful.                 |
| Persisted reports                 | Strong                 | CI uploads quality and security evidence for 14 days.                         | No action now. Increase retention only for audit, regulatory, or incident-response requirements.                    |
| Unified CI command                | Strong                 | `bun run ci` is the shared local and hosted definition of done.               | No action now. Split it only if runtime becomes a demonstrated developer-feedback problem.                          |
| Duplication and complexity        | Strong                 | Complexity, nesting, parameters, and duplication have hard ceilings.          | No extra analyzer now. Add a targeted structural rule only after a recurring design smell bypasses these limits.    |
| Bundle discipline                 | Strong baseline        | JavaScript, CSS, and largest-asset byte budgets are enforced.                 | Create route-specific or timing budgets only when representative product pages and performance requirements exist.  |
| Workflow integrity                | Strong                 | Actionlint validates workflows; actions, runtimes, and containers are pinned. | Add policy only when a new privileged workflow or third-party action expands the attack surface.                    |
| Hosted CI                         | Strong                 | Every pull request runs in a clean GitHub-hosted environment.                 | No action now. Add another platform only when the supported runtime actually requires it.                           |
| Branch governance                 | Strong                 | Pull requests and the required gate protect `main`; force pushes are blocked. | Require human approval when multiple contributors, production access, or irreversible data changes enter scope.     |
| Agent guardrails                  | Strong                 | Agents may not weaken gates, suppress findings, or skip tests.                | Add a guardrail only after an agent uses a new bypass that existing policy or tooling did not catch.                |
| Feature acceptance criteria       | Partial                | Pull requests require behavior and verification evidence.                     | Do this now for every feature: translate the requirement into executable acceptance or regression tests.            |
| Changed-code quality              | Partial                | Every change receives global coverage, mutation, lint, build, and test gates. | Add diff-specific coverage after the codebase grows enough for global percentages to mask a weak patch.             |
| Flake resistance                  | Partial                | Playwright uses controlled CI execution and fails tests classified as flaky.  | Add repeat, seed, clock, or concurrency testing after the first flake or relevant nondeterministic feature appears. |
| Architecture boundaries           | Deferred               | No guessed application layers are enforced.                                   | Add cycle and import-direction rules after stable domain, service, repository, or server boundaries emerge.         |
| Semantic AI review                | Configured, unverified | Codex is a read-only, non-blocking reviewer after deterministic CI.           | Verify it with one live PR now; add no further AI-review tooling unless a distinct review gap is demonstrated.      |
| Deployment infrastructure         | Out of scope           | Local build and behavior are the current quality target.                      | Add deployment checks only after an actual deployment target becomes part of the product requirement.               |

## Quality model

The project uses three kinds of control:

- **Deterministic gates** return the same pass or fail decision for the same code, tool versions, and scanner data. These are allowed to block a merge.
- **Coverage that grows with the product** includes feature tests, E2E flows, and accessibility scenarios. The infrastructure exists, but every new feature must add relevant evidence.
- **Advisory review** uses Codex to look for semantic defects after deterministic CI passes. It is useful, but probabilistic, so it does not block merges.

Passing tools cannot prove that a feature satisfies its requirement. Acceptance criteria and regression tests remain the primary evidence of behavioral correctness.

## Commands

| Command               | Scope                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `bun run verify`      | Static checks, unit/component coverage, mutation tests, production build, and bundle budgets. |
| `bun run verify:full` | `verify` plus direct Playwright E2E tests.                                                    |
| `bun run security`    | Gitleaks, Semgrep, Trivy, and ZAP-proxied browser tests.                                      |
| `bun run ci`          | The complete local and hosted merge gate.                                                     |

Generated evidence is written under `coverage/`, `playwright-report/`, `reports/`, and `test-results/`. GitHub Actions uploads these directories for 14 days even when the gate fails.

## Deterministic controls

### Formatting

**Purpose:** Prevent formatting churn and agent-specific style differences.

**Implementation:** Prettier formats TypeScript, Svelte, JavaScript, JSON, Markdown, YAML, and project configuration. ESLint disables formatting rules that would conflict with Prettier.

**Gate:** `bun run format:check` fails when any tracked source or documentation file differs from the canonical format.

### Type safety

**Purpose:** Reject ambiguous values, unchecked access, inconsistent contracts, and unsafe error handling before execution.

**Implementation:** TypeScript strict mode is supplemented by `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, and `useUnknownInCatchVariables`. Project scripts are checked with a separate TypeScript configuration.

**Gate:** `bun run check` validates Svelte and application types with warnings treated as errors. `bun run check:scripts` validates the quality and security scripts without emitting files.

### JavaScript and TypeScript smells

**Purpose:** Catch unsafe or unclear implementation patterns that still compile.

**Implementation:** ESLint uses the recommended JavaScript rules and type-aware TypeScript rules. Explicit `any`, non-null assertions, inconsistent type imports, and non-exhaustive switches are errors. Unused suppression directives are also errors.

**Gate:** `bun run lint` allows zero warnings.

### Svelte mistakes

**Purpose:** Detect invalid markup, unsafe component patterns, and Svelte-specific mistakes.

**Implementation:** The Svelte compiler, `svelte-check`, and the recommended Svelte ESLint rules are enabled. Project Svelte code is forced into Svelte 5 runes mode. Buttons require an explicit type, and unsafe blank-target links are rejected.

**Gate:** `bun run check` and `bun run lint`.

### Test discipline

**Purpose:** Prevent tests that silently execute without proving anything or that agents disable to obtain a green build.

**Implementation:** Vitest requires assertions. Focused, disabled, commented-out, and unresolved to-do tests are lint errors. Playwright focused and skipped tests are also errors.

**Gate:** `bun run lint`, `bun run test:unit`, and `bun run test:e2e`.

### Unit and component infrastructure

**Purpose:** Exercise reusable logic and rendered Svelte components at the lowest practical level.

**Implementation:** Vitest has a Node-based server project and a real Chromium component project. This avoids pretending that browser component behavior is equivalent to a DOM simulation.

**Gate:** `bun run test:unit`.

### Numeric coverage

**Purpose:** Reject large regions of executable logic that tests never reach.

**Implementation:** Istanbul measures client/shared and server code separately. Lines, functions, branches, and statements each require at least 80 percent coverage. HTML and JSON summaries are preserved.

**Gate:** `bun run test:coverage`.

**Current limit:** Coverage is global rather than changed-line based. A high percentage proves execution, not useful assertions.

### Mutation coverage

**Purpose:** Detect tests that execute code but fail to notice incorrect results.

**Implementation:** Stryker mutates reusable TypeScript logic under `src/lib`, runs related Vitest tests, and requires an 80 percent mutation score. Surviving mutants remain visible in HTML and JSON reports.

**Gate:** `bun run test:mutation`.

**Current limit:** Svelte components and future server-only behavior are not yet mutation targets.

### End-to-end behavior

**Purpose:** Verify complete behavior through a real browser against a built application.

**Implementation:** Playwright builds the application, starts Vite preview on localhost, and runs Chromium and Firefox locally. Hosted CI additionally runs WebKit. CI uses one worker, forbids focused tests, rejects flaky tests, and does not update snapshots.

**Gate:** `bun run test:e2e` locally and `bun run test:e2e:all` when all browser runtimes are available.

**Current limit:** The framework coverage is strong, but the starter application has only a small number of flows. Each feature must add its own acceptance path.

### Accessibility

**Purpose:** Catch rendered accessibility failures that compilation cannot see.

**Implementation:** Playwright uses Axe against the rendered application. Svelte compiler accessibility diagnostics continue to catch static markup issues.

**Gate:** Accessibility assertions run as part of the E2E suite.

**Current limit:** Only visited pages and exercised states are scanned.

### Dead code and dependencies

**Purpose:** Prevent abandoned exports, unused files, and unnecessary packages from accumulating in agent-generated changes.

**Implementation:** Knip analyzes the source graph, entry points, exports, and package manifests.

**Gate:** `bun run knip`.

### Production build

**Purpose:** Ensure code accepted by editors and tests can still be compiled by SvelteKit and Vite.

**Implementation:** The optimized application build runs after static and behavioral checks.

**Gate:** `bun run build`, included in `bun run verify`.

**Current limit:** The project uses `adapter-auto`; a deployment-specific runtime is deliberately not selected yet.

### Static application security

**Purpose:** Reject known dangerous source patterns and security defects before runtime.

**Implementation:** Semgrep runs a hash-locked TypeScript rule pack plus project rules that reject dynamic code execution, disabled TLS verification, and `document.write`. The scanner container is digest-pinned and runs offline after its rule pack is verified.

**Gate:** `bun run security:semgrep` fails on a finding.

### Dependencies and secrets

**Purpose:** Prevent credentials from entering the repository and reject serious known dependency or configuration vulnerabilities.

**Implementation:** Gitleaks scans both the working tree and complete Git history with full redaction. Trivy scans development and production dependencies plus configuration. Scanner images are digest-pinned and containers are removed after use.

**Gate:** `bun run security:gitleaks` fails on any secret. `bun run security:trivy` fails on High or Critical findings while retaining lower-severity findings in its report.

**Determinism note:** The Trivy policy is deterministic, but its vulnerability database is intentionally refreshed. A newly published vulnerability can therefore fail unchanged application code.

### Runtime HTTP security

**Purpose:** Observe the HTTP behavior produced by real browser flows.

**Implementation:** Playwright Chromium runs through a local, digest-pinned ZAP proxy. ZAP waits for passive scanning, emits JSON and HTML reports, and fails on High findings. Its container is constrained and removed after the test.

**Gate:** `bun run test:e2e:security`.

**Current limit:** ZAP sees only exercised browser traffic. Active attacks and broad crawling are outside the local anti-slop goal.

### Persisted reports

**Purpose:** Make failures easy to inspect instead of reducing them to a pass or fail badge.

**Implementation:** Coverage, mutation, duplication, bundle, browser, Gitleaks, Semgrep, Trivy, and ZAP reports are written to ignored directories. GitHub Actions uploads them even when an earlier check fails.

**Gate:** Report creation is part of each owning command; artifact upload uses `if: always()`.

### Unified CI command

**Purpose:** Give humans, agents, and GitHub one definition of done.

**Implementation:** Package scripts compose the same checks used individually. The hosted workflow calls the repository command rather than reimplementing its logic in YAML.

**Gate:** `bun run ci` must exit successfully.

### Duplication and complexity

**Purpose:** Prevent copy-pasted implementations and deeply branching agent-generated functions.

**Implementation:** ESLint limits cyclomatic complexity to 10, nesting depth to 4, and parameters to 4 for application source. JSCPD allows at most 5 percent duplication and ignores tests and generated content.

**Gate:** `bun run lint` and `bun run duplicates`.

### Bundle discipline

**Purpose:** Prevent apparently small changes from adding disproportionate client weight.

**Implementation:** A project script measures built client JavaScript, CSS, and the largest individual asset. Current ceilings are 153,600 JavaScript bytes, 51,200 CSS bytes, and 76,800 bytes for the largest asset.

**Gate:** `bun run check:bundle` fails when a ceiling is exceeded and records the measured assets.

### Workflow integrity

**Purpose:** Prevent broken or ambiguous CI configuration from becoming the only definition of quality.

**Implementation:** Actionlint validates GitHub Actions syntax and expressions. GitHub Actions and scanner containers are pinned to immutable commit or image digests. The Bun and Node versions are explicit.

**Gate:** `bun run check:workflows`.

### Hosted CI

**Purpose:** Reproduce the gate in a clean environment outside an agent's workstation.

**Implementation:** GitHub Actions performs a frozen Bun install, installs all three browser engines, runs `bun run ci`, and uploads evidence. Concurrent runs for the same ref cancel superseded work.

**Gate:** The `Quality and security` job is required on protected `main`.

### Branch governance

**Purpose:** Prevent direct changes from bypassing the evidence-producing workflow.

**Implementation:** GitHub requires pull requests and a current `Quality and security` result. Linear history and resolved review conversations are required; force pushes and branch deletion are blocked.

**Current limit:** Approval count is currently zero. The deterministic gate, rather than mandatory human approval, is the merge authority.

### Agent guardrails

**Purpose:** Stop agents from making the measurement easier instead of improving the code.

**Implementation:** `AGENTS.md` forbids silently lowering thresholds, disabling tests, updating snapshots, suppressing diagnostics, or adding scanner exceptions. The pull request template asks for behavior, test, threshold, and report evidence.

**Gate:** Some rules are enforced by configuration; policy violations that remain syntactically valid require pull request review.

## Coverage that must grow with features

### Feature acceptance criteria

**Purpose:** Prove that implemented behavior matches the requirement rather than merely compiling.

**Current state:** The test infrastructure is ready, but feature correctness cannot be preconfigured. Every feature should translate its acceptance criteria into unit, component, or E2E tests at the narrowest useful level.

**Required practice:** A behavior change without corresponding evidence must be explained in the pull request.

### Changed-code quality

**Purpose:** Prevent new weakly tested code from hiding behind strong historical project averages.

**Current state:** Global coverage, mutation, lint, and build gates apply to every change. Changed-line coverage and diff-specific mutation thresholds are not configured.

**Next trigger:** Add a changed-code gate when the codebase is large enough for global percentages to conceal meaningful untested changes.

### Flake resistance

**Purpose:** Prevent intermittent tests from giving agents an unreliable success signal.

**Current state:** Playwright uses a single CI worker, allows one diagnostic retry, and fails the suite if a test is classified as flaky. CI cannot update snapshots. Unit tests are isolated but are not repeatedly executed with controlled random seeds.

**Next trigger:** Add repeat or seed-based testing after the first intermittent failure, randomized algorithm, clock-dependent behavior, or concurrency-sensitive feature appears.

### Architecture boundaries

**Purpose:** Prevent agents from creating cycles, bypassing layers, or importing server-only code into browser modules.

**Current state:** Deliberately deferred because the starter project has no meaningful application layers. Enforcing guessed boundaries would encode accidental structure as policy.

**Next trigger:** Once routes, services, repositories, or domain modules exist, define allowed dependency directions and make cycle and forbidden-import checks part of `bun run verify`.

## Advisory semantic review

### Codex review

**Purpose:** Look for requirement, authorization, contract, data-loss, concurrency, and error-handling defects that deterministic tools cannot prove.

**Implementation:** Codex runs only for same-repository pull requests and only after the deterministic gate succeeds. It receives a trusted prompt from the base commit, operates read-only without `sudo`, and is asked to report only actionable, high-confidence defects. A separate narrowly privileged job posts its result.

**Merge policy:** Advisory only. Model output is probabilistic and cannot replace deterministic checks or explicit acceptance tests.

**Current state:** `OPENAI_API_KEY` is configured. The enabled review and comment path still needs one live pull request verification before it should be described as proven.

## Deliberately out of scope

Deployment infrastructure, public networking, TLS, domains, scaling, backups, and cloud runtime operations are not measures of local code slop. They should be added only when Weltkit has an actual deployment target.

The project should not accumulate tools speculatively. When a recurring defect escapes the gate, add the smallest deterministic rule or regression test that detects that demonstrated failure mode.
