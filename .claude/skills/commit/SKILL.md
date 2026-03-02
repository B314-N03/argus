---
name: commit
description: Validate, commit, and push staged changes with a conventional commit message.
disable-model-invocation: true
---

# Commit

Validate staged changes, generate a conventional commit message, commit, and push.

## Instructions

### Step 1: Stage Changes

Run `git status` to check for staged and unstaged changes.

If there are already staged changes, proceed to Step 2.

If nothing is staged, group the unstaged changes into logical commit packages — files that belong together conceptually (e.g., a component and its test, related refactors across files, a config change and the code that uses it). Present each group to the user with a short description and ask which group to commit. Stage only the approved group.

If there are no changes at all (nothing staged, nothing unstaged), stop and tell the user.

### Step 3: Run Validation (conditional)

Check if any staged files match types covered by validation:

```bash
git diff --cached --name-only | grep -E '\.(ts|tsx|css|scss)$|^src/locales/.*\.json$'
```

If **no** matching files are staged, skip validation and proceed to Step 4.

If matching files **are** staged, run `npm run validate`. If it fails, stop and show the validation errors to the user. Do not commit.

After validation succeeds, re-stage any files that validation modified (e.g., Prettier reformatting). Compare `git diff --name-only` (unstaged changes) against `git diff --cached --name-only` (staged files) — any file in both sets was modified by validation and must be re-staged with `git add`. Only re-stage files that were already staged; do not stage new files.

### Step 4: Generate Commit Message

Analyze the staged diff (`git diff --cached`) and generate a conventional commit message:

```
type(scope): description
```

**Types** (pick the most accurate one):

- `feat` — new feature or functionality
- `fix` — bug fix
- `refactor` — code restructuring without behavior change
- `style` — formatting, whitespace, missing semicolons (no logic change)
- `perf` — performance improvement
- `test` — adding or updating tests
- `docs` — documentation changes
- `chore` — tooling, config, dependencies, build
- `ci` — CI/CD pipeline changes
- `build` — build system or external dependency changes

**Scope** — the area of the codebase affected, in parentheses. Derive from the feature or component name. Examples: `dashboard`, `globe`, `layout`, `api`, `ui`, `settings`, `air`, `naval`, `signals`, `radios`, `indicators`, `styles`. Omit the scope only if the change is truly cross-cutting.

**Rules:**

- Keep the description under 60 characters
- Use imperative mood ("add", "fix", "update", "refactor", "remove")
- Lowercase everything (no capital letter, no period at the end)
- Focus on what changed, not how

Show the proposed commit message to the user and ask for confirmation before committing.

### Step 5: Commit and Push

After user confirms:

1. `git commit -m "<message>"`
2. `git push`

If the branch has no upstream, use `git push -u origin <branch-name>`.

## Failure Handling

| Failure                      | Action                                        |
| ---------------------------- | --------------------------------------------- |
| On `main` or `master` branch | Abort, tell the user to use a feature branch  |
| No changes at all            | Stop, tell the user there's nothing to commit |
| Nothing staged               | Group unstaged changes and propose packages   |
| `npm run validate` fails     | Stop, show errors, do not commit              |
| Push fails (no upstream)     | Retry with `git push -u origin <branch>`      |
| Push fails (other reason)    | Show the error, do not retry                  |

## Notes

- When auto-staging, present logical groups and let the user pick — never stage everything at once
- Re-staging after validation only applies to files that were already staged — do not stage new files
- The commit message is always confirmed by the user before committing
- Validation runs when `.ts`, `.tsx`, `.css`, `.scss`, or locale `.json` files are in the staged set
- Do NOT add Co-Authored-By trailers
