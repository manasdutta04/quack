# Quack

Quack is an offline-first React Native messaging prototype focused on durable local sends, background sync boundaries, and a calm, iOS-first glass interface.

## Quick start

```bash
npm install
npx pod-install
npx react-native start
```

In another terminal, run `npx react-native run-android` or `npx react-native run-ios`.

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the queue, Supabase setup, platform limitations, and release build guidance. Copy `.env.example` to `.env`, provide Supabase credentials, and rebuild the native app for real network sync; without them, the app uses its local deterministic demo adapter. Runtime `globalThis.__QUACK_CONFIG__` values can override native environment values in CI or hosted builds.
