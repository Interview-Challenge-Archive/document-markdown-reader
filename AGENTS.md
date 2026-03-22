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

## Pre-commit Checklist

Always make sure the following checks pass before committing:

1. **Tests are passing** - Run `npm test` to ensure all tests pass
2. **Lint is OK** - Run `npm run lint` to ensure there are no linting errors
3. **Typecheck is OK** - Run `npm run typecheck` to ensure TypeScript type checking passes

All three checks must pass before any commit is made.

## Error Organization

- **`src/errors/`**: Dedicated folder for all custom error classes
- **Error naming**: Use descriptive names ending with 'Error' (e.g., `InvalidPdfError`)
- **Error parameters**: Accept only relevant data, build messages internally
- **Direct imports**: Import directly from error files unless multiple errors exist

## Supported Document Formats

- PDF (`.pdf`)
- Word (`.docx`)
- OpenDocument (`.odt`)
- Pages (`.pages`)
- Rich Text Format (`.rtf`)
- HTML (`.html`)
- Markdown (`.md`)
- Plain text (`.txt`)
