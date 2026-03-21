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
2. **Test changes**: Run build and tests after modifications
3. **Preserve conventions**: Match existing naming, structure, and patterns
4. **Minimal changes**: Make targeted edits rather than large refactors
5. **Verify paths**: Use absolute paths when reading/writing files
6. **No self-explanatory comments**: Avoid obvious comments
7. **Meaningful comments only**: Add comments only when explaining complex business logic, algorithms, or non-obvious implementation details
8. **Code should be self-documenting**: Write clear, readable code that doesn't require explanatory comments for basic functionality
9. **Custom error classes**: Place all custom errors in `src/errors/` folder
10. **Error message standards**: Custom errors should have built-in messages and only accept relevant parameters

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
