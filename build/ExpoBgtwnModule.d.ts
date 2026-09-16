import { NativeModule } from 'expo';
import { ExpoBgtwnModuleEvents } from './ExpoBgtwn.types';
declare class ExpoBgtwnModule extends NativeModule<ExpoBgtwnModuleEvents> {
    startForegroundAction(): Promise<number>;
    stopForegroundAction(taskIdentifier: number): Promise<void>;
    forceStopAllForegroundActions(): Promise<void>;
    getBackgroundTimeRemaining(): Promise<number>;
    getForegroundIdentifiers(): Promise<number[]>;
}
declare const _default: ExpoBgtwnModule | null;
export default _default;
//# sourceMappingURL=ExpoBgtwnModule.d.ts.map