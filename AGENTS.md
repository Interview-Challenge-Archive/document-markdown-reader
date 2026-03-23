# AI Agents

This document provides guidance for AI agents assisting with development in this repository.

## Project Overview

- **Framework**: Browser-focused document reader library
- **Build Tool**: Vite
- **Testing**: Vitest
- **Language**: TypeScript

## Development Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Code Style

- Follow existing project conventions
- Use ESLint configuration (`eslint.config.js`)
- Respect `.editorconfig` settings
- Keep code modular and reusable

## Architecture Notes

- Source code located in `src/`
- Tests in `test/`
- Custom errors in `src/errors/`
- Document import strategies in `src/strategies/`

## Agent Guidelines

1. **Read before writing**: Always examine existing code before making changes
2. **No inlined comments in README files**: Do not use inline comments that describe what a command does. Instead, use descriptive text followed by the command. For example, instead of `cd examples/javascript/react/vite # Navigate to the example directory`, use `Navigate to the example directory: cd examples/javascript/react/vite`
3. **Test changes**: Run build and tests after modifications
4. **Preserve conventions**: Match existing naming, structure, and patterns
5. **Minimal changes**: Make targeted edits rather than large refactors
6. **Verify paths**: Use absolute paths when reading/writing files
7. **No self-explanatory comments**: Avoid obvious comments
8. **Meaningful comments only**: Add comments only when explaining complex business logic, algorithms, or non-obvious implementation details
9. **Code should be self-documenting**: Write clear, readable code that doesn't require explanatory comments for basic functionality
10. **Custom error classes**: Place all custom errors in `src/errors/` folder
11. **Error message standards**: Custom errors should have built-in messages and only accept relevant parameters
12. **New example validation**: If you add or modify an example, you must validate it with the same Playwright upload flow used in CI before committing
13. **README files are generated**: Do not edit `README.md` or `examples/README.md` by hand. They are auto-generated. If content changes are needed, edit templates in `.github/templates/` (`root-readme.md.ejs` and `examples-readme.md.ejs`) and let workflows regenerate the README files.
14. **New example documentation**: Every new example folder must include its own `README.md`, and it must follow the same structure/style as existing example READMEs in this repository.
15. **PR-only workflow**: Never commit or push directly to `main`. If the current branch is `main` or `dev`, create a feature branch, push it, and open a pull request. If the current branch is already not `main` and not `dev`, do not create an extra branch unless explicitly requested. Merge to `main` only after explicit user approval.
16. **Prefer marketplace actions in workflows**: When updating GitHub Actions workflows, prefer established GitHub Marketplace actions over custom inline shell logic when a suitable action exists.

## Pre-commit Checklist

Always make sure the following checks pass before committing:

1. **Tests are passing** - Run `npm test` to ensure all tests pass
2. **Lint is OK** - Run `npm run lint` to ensure there are no linting errors
3. **Typecheck is OK** - Run `npm run typecheck` to ensure TypeScript type checking passes

All three checks must pass before any commit is made.

## Example CI Validation

When adding a new example under `examples/{language}/{framework}/{tool}`:

1. Install root dependencies and build the package:
   - `npm ci`
   - `npm run build`
2. Install dependencies inside the new example and point it to the local package:
   - `npm pkg set "dependencies.@interview-challenge-archive/document-markdown-reader=file:../../../../"` (run in the example folder)
   - `npm install` (run in the example folder)
3. Run the examples E2E upload test against that exact example from the repository root:
   - `E2E_EXAMPLE_PATH=examples/{language}/{framework}/{tool} E2E_BASE_URL=http://127.0.0.1:4173 E2E_PORT=4173 CI=1 npm run test:e2e:examples -- --reporter=line`
4. Ensure the GitHub Actions workflow `Test examples/ E2E` is green on the PR, because CI runs a matrix for all example folders with `package.json`.

## Error Organization

- **`src/errors/`**: Dedicated folder for all custom error classes
- **Error naming**: Use descriptive names ending with 'Error' (e.g., `InvalidPdfError`)
- **Error parameters**: Accept only relevant data, build messages internally
- **Direct imports**: Import directly from error files unless multiple errors exist

## Supported Document Formats

Do not keep a hardcoded formats list in this file. Read supported formats dynamically:

1. Runtime source of truth (recommended):
   - Build: `npm run build`
   - Print current extensions from library API:
     - `node --input-type=module -e "const { documentMarkdownReader } = await import('./dist/index.js'); console.log(documentMarkdownReader.supportedExtensions); console.log(documentMarkdownReader.acceptedExtensions);"`
2. Source inspection fallback:
   - `rg \"readonly supportedExtensions\" src/strategies`

Use the runtime API values (`supportedExtensions`, `acceptedExtensions`) as the canonical list when documenting or validating format support.
