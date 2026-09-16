import ExpoBgtwnModule from './ExpoBgtwnModule';
export * from './ExpoBgtwn.types';
/** Identifier returned on platforms without the native module (Android, web). */
export const INVALID_TASK_IDENTIFIER = 0;
/** `true` when the native module is linked (Apple platforms). */
export const isAvailable = ExpoBgtwnModule != null;
/**
 * Begins an iOS background task so the current async work keeps running for a short
 * while after the app is backgrounded. Resolves to `0` on Android and web.
 */
export const startForegroundAction = async () => {
    if (!ExpoBgtwnModule) {
        return INVALID_TASK_IDENTIFIER;
    }
    return ExpoBgtwnModule.startForegroundAction();
};
/** Ends the background task started with `startForegroundAction()`. */
export const stopForegroundAction = async (taskIdentifier) => {
    if (!ExpoBgtwnModule || taskIdentifier === INVALID_TASK_IDENTIFIER) {
        return;
    }
    await ExpoBgtwnModule.stopForegroundAction(taskIdentifier);
};
/** Ends every background task this module still tracks. */
export const forceStopAllForegroundActions = async () => {
    if (!ExpoBgtwnModule) {
        return;
    }
    await ExpoBgtwnModule.forceStopAllForegroundActions();
};
/**
 * Seconds left before iOS suspends the app. Very large while in the foreground.
 * Resolves to `-1` on Android and web.
 */
export const getBackgroundTimeRemaining = async () => {
    if (!ExpoBgtwnModule) {
        return -1;
    }
    return ExpoBgtwnModule.getBackgroundTimeRemaining();
};
/** Identifiers of background tasks that are still running. Empty on Android and web. */
export const getForegroundIdentifiers = async () => {
    if (!ExpoBgtwnModule) {
        return [];
    }
    return ExpoBgtwnModule.getForegroundIdentifiers();
};
/**
 * Listens for iOS ending a background task that was not stopped in time.
 * The module already ends the task itself; use this to cancel or persist your work.
 */
export function addExpirationListener(listener) {
    if (!ExpoBgtwnModule) {
        return { remove: () => { } };
    }
    return ExpoBgtwnModule.addListener('onExpirationEvent', listener);
}
export default ExpoBgtwnModule;
//# sourceMappingURL=index.js.map