@AGENTS.md

# Aegis Mobile — Developer Guide

## Stack

- **Expo SDK 56** + **Expo Router 56** (file-based routing, typed routes)
- **React 19** with React Compiler enabled — no manual `memo`/`useCallback`/`useMemo`
- **TypeScript** strict mode
- **pnpm** — always use `pnpm`, never `npm` or `yarn`
- Path alias `@/*` → `src/*`

## Project Structure

```
src/
  app/          # Expo Router screens and layouts (_layout.tsx, index.tsx, …)
  components/   # Shared UI components
  constants/    # Theme tokens, config values
  hooks/        # Custom hooks
assets/         # Images, fonts, icons
```

## Expo Router

- All screens live under `src/app/`. Route segments map directly to file names.
- Layouts use `_layout.tsx`. Shared tab navigation belongs in `app-tabs.tsx`, mounted from the root layout.
- Use typed routes — import `Href` from `expo-router` and avoid raw string paths.
- Platform-specific files: `component.ios.tsx`, `component.android.tsx`, `component.web.tsx`.

## TypeScript

- Strict mode is on. No `any` — use `unknown` with type narrowing, or a proper type.
- Prefer `type` over `interface` for component props.
- Type all hook return values explicitly when they are non-trivial.

## Styling

- Always use `StyleSheet.create` — never inline style objects.
- Use spacing and color tokens from `@/constants/theme` (`Spacing`, `MaxContentWidth`, `BottomTabInset`).
- `SafeAreaView` from `react-native-safe-area-context`, not from `react-native`.

## Components

- One component per file. Default export for screens/layouts, named exports for shared components.
- Keep components small — extract logic into hooks under `src/hooks/`.
- Use `@expo/ui` components for native UI primitives before reaching for custom implementations.

## ESLint

Run `pnpm lint` (`expo lint`) before committing. The project follows `eslint-config-expo` rules:

- No unused variables or imports — remove them, do not comment out.
- React hooks rules apply: call hooks only at the top level of function components.
- `react-hooks/exhaustive-deps` is enforced — include all dependencies or disable the rule with a comment explaining why.
- No implicit `any` from TypeScript (`@typescript-eslint/no-explicit-any`).

## Platform Differences

- Check `Platform.OS` (`'ios' | 'android' | 'web'`) for runtime branching.
- Prefer platform-specific file extensions (`.ios.tsx` etc.) over `Platform.OS` branches when the implementations diverge significantly.
- `expo-device` for physical vs. simulator checks.

## Performance

- React Compiler handles memoisation — do not add `memo`, `useCallback`, or `useMemo` manually unless profiling shows a concrete regression.
- Use `expo-image` instead of the RN `Image` component.
- Animations via `react-native-reanimated` (v4) and `react-native-gesture-handler`.

## API Clients

API clients live under `src/api/`, one file per backend controller:

| File | Controller |
|------|------------|
| `src/api/alert.ts` | `alertApi` — create, end, fetch alerts |
| `src/api/contact.ts` | `contactApi` — add, remove, toggle-alert, list contacts |
| `src/api/user.ts` | `userApi` — register, login |

All clients share the `request<T>` helper in `src/api/client.ts`, which reads the base URL from `EXPO_PUBLIC_API_URL` (falls back to `http://192.168.1.102:5043` for local dev). Set the variable in `.env` locally or via EAS Secrets / Expo web environment variables for other environments.

- Import from the controller file directly: `import { alertApi } from '@/api/alert'`.
- Pass typed request bodies — types are exported from each client file.
- The generic `request<T>` lets callers supply an expected response type: `request<User>('/User/login', ...)`.

## Commands

| Task             | Command              |
| ---------------- | -------------------- |
| Start dev server | `pnpm start`         |
| iOS simulator    | `pnpm ios`           |
| Android emulator | `pnpm android`       |
| Web              | `pnpm web`           |
| Lint             | `pnpm lint`          |
| Reset project    | `pnpm reset-project` |
