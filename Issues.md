# Issues and Improvements for Eureka

## Bug Fixes

### Bug: Hidden Layer Tile Selection Logic Not Properly Implemented
**Type**: bug
**Priority**: high
**Description**: In the `allowedforSelection` function in `game-store.ts` (line 151-152), there's a commented TODO about a bug where players can select items in hidden layers. The implementation is incomplete and doesn't properly check for hidden tiles. This can lead to unexpected gameplay behavior.
**Steps to Fix**: Implement proper layer-based tile selection logic that prevents selecting tiles that should be covered by other tiles.

### Bug: Accessibility Issues in Tile Component
**Type**: bug
**Priority**: medium
**Description**: The Tile component in `components/tile/index.tsx` lacks proper accessibility attributes. It uses onClick but doesn't support keyboard navigation or provide proper ARIA attributes.
**Steps to Fix**: Add keyboard navigation support (onKeyDown), tabIndex, aria-label, and appropriate role attributes to the Tile component.

### Bug: Timeout Cleanup in Game Store
**Type**: bug
**Priority**: medium
**Description**: The game store creates timers but may not always properly clean them up in edge cases, potentially causing memory leaks.
**Steps to Fix**: Ensure all timers are properly cleared in all exit paths, especially when the component unmounts or when a game ends prematurely.

## Refactoring

### Refactor: Improve Type Safety in Game Store
**Type**: refactor
**Priority**: medium
**Description**: The game store has several instances of forced non-null assertions (like `state.timer!`) and some any types. This reduces type safety and may lead to runtime errors.
**Steps to Fix**: Replace non-null assertions with proper conditional checks, eliminate any types, and improve type coverage across the codebase.

### Refactor: Hardcoded Tile Position Logic
**Type**: refactor
**Priority**: medium
**Description**: In `components/tile/index.tsx`, there's hardcoded positioning logic with magic numbers for crooked tiles. This makes maintenance difficult and increases the chance of bugs.
**Steps to Fix**: Refactor the positioning logic to be more data-driven, possibly moving the position calculations into the game board layout data.

### Refactor: Extract Game Logic from Store
**Type**: refactor
**Priority**: medium
**Description**: The game store in `zustand/game-store.ts` contains a mix of state management and game logic. This makes it difficult to test and maintain.
**Steps to Fix**: Extract core game logic into separate utility functions that can be tested independently from the store.

## Enhancements

### Feature: Improve Error Handling and User Feedback
**Type**: enhancement
**Priority**: medium
**Description**: Current error handling in `post-game-state.ts` and elsewhere logs to console but doesn't provide user-friendly feedback when operations fail.
**Steps to Fix**: Implement a consistent error handling strategy that provides user-friendly notifications when operations like saving game state fail.

### Feature: Add Unit Tests for Game Logic
**Type**: enhancement
**Priority**: high
**Description**: The codebase has only 3 test files despite complex game logic. Key components like tile selection, game board initialization, and API calls lack test coverage.
**Steps to Fix**: Add comprehensive unit tests for the core game logic, API interactions, and UI components.

### Feature: Add Game State Persistence Mechanism
**Type**: enhancement
**Priority**: medium
**Description**: While the game saves state to the server, it doesn't handle cases where the user refreshes the page or closes/reopens the browser. The game state isn't properly restored.
**Steps to Fix**: Implement a mechanism to restore the game state when the user returns to the game after closing the browser or refreshing the page.

### Feature: Improve Responsive Design
**type**: enhancement
**Priority**: medium
**Description**: The GameBoard component has hardcoded dimensions that may not work well on all devices. As noted in the comments in `game-board/index.tsx`, absolute positioning doesn't allow for responsive layouts.
**Steps to Fix**: Refactor the game board to use responsive units and adapt to different screen sizes while maintaining gameplay integrity.

## Technical Debt

### Tech Debt: Console Logs in Production Code
**Type**: tech-debt
**Priority**: low
**Description**: There are several console.logs in production code, including in critical paths like `saveGameState` in `db/insert-game.ts`.
**Steps to Fix**: Remove or conditional debug logs from production code. Consider using a proper logging library with different log levels.

### Tech Debt: Improve API Error Responses
**Type**: tech-debt
**Priority**: low
**Description**: The API route in `src/app/api/game/route.ts` returns a generic "Internal Server Error" message for all types of errors, making debugging difficult.
**Steps to Fix**: Implement more detailed error responses with appropriate status codes and error messages based on the type of error.

### Tech Debt: Missing Database Indexes
**Type**: tech-debt
**Priority**: medium
**Description**: The database schema in `db/schema.ts` lacks indexes on frequently queried fields like gameId in game_moves and game_snapshots tables.
**Steps to Fix**: Add appropriate indexes to improve query performance, especially for filtering operations.

### Tech Debt: Unused Database Tables
**Type**: tech-debt
**Priority**: low
**Description**: The database schema defines gameMoves and gameSnapshots tables, but there's no evidence they're being used in the application code.
**Steps to Fix**: Either implement functionality using these tables or remove them from the schema to reduce confusion and maintenance overhead.