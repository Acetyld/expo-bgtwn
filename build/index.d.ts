import type { EventSubscription } from 'expo-modules-core';
import type { ExpirationEventPayload } from './ExpoBgtwn.types';
import ExpoBgtwnModule from './ExpoBgtwnModule';
export * from './ExpoBgtwn.types';
/** Identifier returned on platforms without the native module (Android, web). */
export declare const INVALID_TASK_IDENTIFIER = 0;
/** `true` when the native module is linked (Apple platforms). */
export declare const isAvailable: boolean;
/**
 * Begins an iOS background task so the current async work keeps running for a short
 * while after the app is backgrounded. Resolves to `0` on Android and web.
 */
export declare const startForegroundAction: () => Promise<number>;
/** Ends the background task started with `startForegroundAction()`. */
export declare const stopForegroundAction: (taskIdentifier: number) => Promise<void>;
/** Ends every background task this module still tracks. */
export declare const forceStopAllForegroundActions: () => Promise<void>;
/**
 * Seconds left before iOS suspends the app. Very large while in the foreground.
 * Resolves to `-1` on Android and web.
 */
export declare const getBackgroundTimeRemaining: () => Promise<number>;
/** Identifiers of background tasks that are still running. Empty on Android and web. */
export declare const getForegroundIdentifiers: () => Promise<number[]>;
/**
 * Listens for iOS ending a background task that was not stopped in time.
 * The module already ends the task itself; use this to cancel or persist your work.
 */
export declare function addExpirationListener(listener: (event: ExpirationEventPayload) => void): EventSubscription;
export default ExpoBgtwnModule;
//# sourceMappingURL=index.d.ts.map