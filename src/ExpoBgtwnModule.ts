import { NativeModule, requireOptionalNativeModule } from 'expo';

import { ExpoBgtwnModuleEvents } from './ExpoBgtwn.types';

declare class ExpoBgtwnModule extends NativeModule<ExpoBgtwnModuleEvents> {
  startForegroundAction(): Promise<number>;
  stopForegroundAction(taskIdentifier: number): Promise<void>;
  forceStopAllForegroundActions(): Promise<void>;
  getBackgroundTimeRemaining(): Promise<number>;
  getForegroundIdentifiers(): Promise<number[]>;
}

// The native side only exists on Apple platforms (UIApplication.beginBackgroundTask).
// On Android and web this resolves to `null` and every export becomes a no-op.
export default requireOptionalNativeModule<ExpoBgtwnModule>('ExpoBgtwn');
