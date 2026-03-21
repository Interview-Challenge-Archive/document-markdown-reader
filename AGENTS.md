# Repository Guidelines

## Project Structure & Module Organization
This repository is a browser-focused document reader that converts various file formats (Word, PDF, HTML, etc.) into Markdown. It uses a **Strategy Pattern** to handle different document formats:

- **src/strategies/**: Contains format-specific implementations (e.g., `WordDocumentImportStrategy`, `PdfDocumentImportStrategy`) extending `DocumentImportStrategy`.
- **src/resolvers/**: Contains the `DocumentReadStrategyResolver` which selects the appropriate strategy based on file extension or MIME type.
- **src/services/**: Core logic for format conversions (`MammothConversionService`, `PdfJsService`, etc.) and utility services (`FileExtensionService`, `MimeTypeService`).
- **src/errors/**: Custom error classes for format-specific failures.

The project uses **Dependency Injection** via `@freshgum/typedi` and `reflect-metadata`. Components are registered as services or strategies and resolved at runtime.

## Build, Test, and Development Commands
- **Build**: `npm run build` (Cleans `dist`, runs Vite build, and generates type declarations).
- **Test**: `npm run test` (Runs all tests once).
- **Watch Tests**: `npm run test:watch` (Runs Vitest in watch mode).
- **Lint**: `npm run lint` (Checks TypeScript files using ESLint).
- **Type Check**: `npm run typecheck` (Runs `tsc` in no-emit mode).
- **Clean**: `npm run clean` (Removes `dist` and `coverage` directories).

## Coding Style & Naming Conventions
- **TypeScript**: Enforced strict mode (`strict: true`).
- **Decorators**: Uses `experimentalDecorators` and `emitDecoratorMetadata` for DI.
- **ESLint**: Modern ESLint flat config (`eslint.config.js`) using `@eslint/js` and `typescript-eslint`.
- **Naming**: Use PascalCase for classes and strategies, camelCase for services and methods. Files should match their primary export.

## Testing Guidelines
- **Framework**: Vitest.
- **Organization**: Test files mirror the `src` directory structure in the `test/` directory.
- **Specs**: Use `describe`, `it`, and `expect` (globals provided in `eslint.config.js`).
- **Run single test**: `npx vitest <path/to/file>.spec.ts`

## Commit & Pull Request Guidelines
- Follow standard git conventions. (Note: Initial repository state, no previous history found).
