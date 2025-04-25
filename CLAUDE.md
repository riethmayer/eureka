# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `yarn dev` - Starts the Next.js development server
- **Build**: `yarn build` - Creates production build
- **Start**: `yarn start` - Runs the production build
- **Typecheck**: `yarn type-check` - Runs TypeScript type checking
- **Lint**: `yarn lint` - Runs ESLint
- **Test**: `yarn test` - Runs all tests using Vitest
- **Test Single File**: `yarn test src/path/to/file.test.ts` - Tests specific file
- **Database**: `yarn generate` - Generate Drizzle migrations, `yarn migrate` - Apply migrations

## Code Style Guidelines

- **Types**: Use strict TypeScript with proper type definitions for all functions, components, and state
- **Imports**: Absolute imports using `@/` paths based on module aliases defined in tsconfig.json
- **Components**: React functional components with TypeScript interfaces
- **Styling**: TailwindCSS for all styling, avoid direct CSS
- **Testing**: Vitest with React Testing Library, follow the existing pattern of mocking zustand stores
- **State Management**: Zustand for global state
- **Naming**: camelCase for variables/functions, PascalCase for components/types, use descriptive names
- **Error Handling**: Proper error boundaries and try/catch where needed
- **Early Returns**: Use early returns for conditionals to improve readability
- **Event Handlers**: Prefix event handler functions with "handle" (e.g., handleClick)