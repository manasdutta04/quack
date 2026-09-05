# Progress checkpoint — 2026-09-05

## Completed

- Scaffolded a bare React Native `0.87.0` TypeScript app in the repository root.
- Installed navigation, Zustand, NetInfo, Supabase, Nitro SQLite, Notifee, React Native Video, BlurView, Keychain, FlashList, Gesture Handler, SVG, and Lucide dependencies.
- Replaced the starter screen with Login, Inbox, Chat, and Sync Center flows.
- Added the Signal Glass visual system: iOS-first dark glass chrome, warm apricot accent, calm paper message surface, responsive spacing, and accessible status colors.
- Added a generated bundled login poster at `assets/launch-poster.png`. The development video is still a remote URL and should be replaced with a licensed bundled `.mp4` before release.
- Added local SQLite schema and durable enqueue path with WAL, `synchronous = FULL`, synchronous `BEGIN IMMEDIATE` transaction, outbox, sync cursor, lease, conflict, and sync-run tables.
- Added typed `SyncEngine` APIs, SQLite lease protection, per-conversation ordering query, retry backoff, twelve-attempt halt, manual retry, conflict-resolution entry point, NetInfo/foreground triggers, and Supabase Edge Function adapter.
- Added Supabase migration for profiles, conversations, members, messages, devices, RLS, idempotent `send_message` RPC, and a `sync` Edge Function.
- Added Android `SignalGlassSync` native module and WorkManager worker scaffolding; added iOS BGTaskScheduler registration and Swift bridge scaffolding.
- Added `react-native-config` so `.env` Supabase values are available to native builds, including the Android dotenv hook/manual package registration, with runtime config override support for CI/hosted builds.
- Added `docs/ARCHITECTURE.md`, `.env.example`, updated `README.md`, and runtime asset guidance.

## Verification completed

- `npx tsc --noEmit` passes.
- Android JavaScript release bundle generation passes.
- Android JavaScript release bundle generation still passes after the configuration bridge change.
- Android debug build succeeds with `:app:assembleDebug --no-daemon` when invoked through a short `Q:` drive alias to avoid Windows CMake path-length limits, including the environment bridge. The generated artifact is `android/app/build/outputs/apk/debug/app-debug.apk`.

## Paused / known follow-up

- Direct Android builds from the long workspace path fail in generated Gesture Handler CMake paths; use the short drive alias workaround documented above, or enable a supported Windows long-path policy for the machine/CI environment.
- Current machine has Node `25.1.0`; RN `0.87.0` warns that it expects Node `^22.13.0`, `^24.3.0`, or `>=26.0.0`. Use a supported Node version before relying on a clean CI/native build.
- Supabase credentials, migrations, Edge Function deployment, APNs/FCM credentials, and production push orchestration remain environment setup work.
- The current sync adapter simulates success when Supabase is unconfigured; the configured path calls the Edge Function but still needs full receive/reconciliation wiring.
- iOS build and simulator visual QA have not been run in this Windows environment.
- Tests were intentionally not run, per request.
