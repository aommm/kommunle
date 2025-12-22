# Agent Guidelines for Kommunle

## Build & Test Commands
- **Start:** `npm start`
- **Build:** `npm run build`
- **Test:** `npm test`
- **Single Test:** `npm test -- <filename>` (e.g., `npm test -- App.test.tsx`)
- **Lint:** `npx eslint src --ext .ts,.tsx`
- **Format:** `npx prettier --write src`

## Code Style & Conventions
- **Framework:** React 17 with TypeScript. Use functional components and hooks.
- **Styling:** Tailwind CSS. Avoid writing raw CSS files unless necessary.
- **Naming:** PascalCase for components (`Game.tsx`), camelCase for functions/vars.
- **State:** Use `useState`, `useMemo`, and custom hooks (`src/hooks/`).
- **I18n:** Use `react-i18next` for all user-facing text.
- **Formatting:** Prettier is enforced via ESLint.
- **Imports:** Absolute imports are not configured; use relative imports.
- **Project Structure:**
  - `src/components/`: UI components
  - `src/hooks/`: Custom React hooks
  - `src/domain/`: Business logic and data models

## Useful Scripts
- **Read High Scores:** `npx ts-node scripts/readHighScores.ts [yyyy-MM-dd]` - Fetches and displays high score data from Firebase for the current day (default) or a specific date. Useful for debugging live data.

