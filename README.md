# expo-bgtwn

Keep async work alive for a few seconds after iOS backgrounds the app. A thin Expo Module around
[`UIApplication.beginBackgroundTask(withName:expirationHandler:)`](https://developer.apple.com/documentation/uikit/uiapplication/begintask(withname:expirationhandler:)).

Typical use: a queue flush or upload that started while the app was open and must finish even if
the user swipes away mid-request. iOS grants roughly 30 seconds; the module ends the task itself
when that budget runs out and emits `onExpirationEvent` so you can persist or cancel.

- Apple only (iOS, tvOS). On Android and web every call is a no-op that resolves immediately.
- Expo SDK 57+ (Expo Modules API, definition DSL). For SDK 50 to 56 use `expo-bgtwn@0.1.x`.
- Not a replacement for `expo-background-task` / BGTaskScheduler. This is the short "finish what you started" window, nothing periodic.

## Install

```sh
npx expo install expo-bgtwn
```

Then rebuild the native app (`npx expo prebuild` or `npx expo run:ios`). No config plugin needed.

## API

```ts
import {
  startForegroundAction,
  stopForegroundAction,
  forceStopAllForegroundActions,
  getBackgroundTimeRemaining,
  getForegroundIdentifiers,
  addExpirationListener,
  isAvailable,
} from 'expo-bgtwn';

const id = await startForegroundAction();
try {
  await flushQueue();
} finally {
  await stopForegroundAction(id);
}
```

| Export | Returns | Notes |
| --- | --- | --- |
| `startForegroundAction()` | `Promise<number>` | Begins a background task. `0` on Android/web. |
| `stopForegroundAction(id)` | `Promise<void>` | Ends it. Unknown or already ended ids are ignored. |
| `forceStopAllForegroundActions()` | `Promise<void>` | Ends every task this module still tracks. |
| `getBackgroundTimeRemaining()` | `Promise<number>` | Seconds until suspension. Very large in the foreground. `-1` on Android/web. |
| `getForegroundIdentifiers()` | `Promise<number[]>` | Tasks still running. |
| `addExpirationListener(cb)` | `EventSubscription` | `cb({ remaining, identifier })` fires right before iOS ends an unfinished task. |
| `isAvailable` | `boolean` | `true` when the native module is linked. |

Every `startForegroundAction()` must be paired with `stopForegroundAction()`; iOS terminates apps that leak background tasks.

## Example

`example/` is a CNG Expo 57 app. `cd example && npm install && npx expo run:ios`, tap the button, background the app, and watch the countdown continue until the task expires.

## Changelog

### 0.2.0

- Rewritten for Expo SDK 57: typed `NativeModule` events, `requireOptionalNativeModule` (Android and web become no-ops instead of `Platform.OS` checks), every native call pinned to the main queue.
- Swift side stays on the definition DSL. The SDK 57 macros (`@ExpoModule` / `@JS async`) compiled but crashed Hermes when a promise resolved while the app was moving to the background (EXC_BAD_ACCESS in `expo::callFunction`, iOS 26.5, expo-modules-core 57.0.18). Revisit when the macros leave experimental status in SDK 58.
- New `getForegroundIdentifiers()` export, `isAvailable`, `INVALID_TASK_IDENTIFIER`.
- Expiration handler now also removes the task from the tracked list; `stopForegroundAction` ignores unknown ids.
- `ExpireEventPayload` kept as a deprecated alias of `ExpirationEventPayload`.
- Minimum iOS 16.4, tooling from `create-expo-module@57`.

### 0.1.1

- Initial release (Expo Modules API 1.0 DSL).
