/** Payload of `onExpirationEvent`, sent right before iOS ends an unfinished background task. */
export type ExpirationEventPayload = {
    /** Seconds the system still granted when the expiration handler ran. */
    remaining: number;
    /** Identifier returned by `startForegroundAction()`. */
    identifier: number;
};
export type ExpoBgtwnModuleEvents = {
    onExpirationEvent: (event: ExpirationEventPayload) => void;
};
/** @deprecated Use `ExpirationEventPayload`. Kept for 0.1.x imports. */
export type ExpireEventPayload = ExpirationEventPayload;
//# sourceMappingURL=ExpoBgtwn.types.d.ts.map