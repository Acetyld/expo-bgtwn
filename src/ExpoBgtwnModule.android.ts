// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
export default {
  startForegroundAction: async (): Promise<number> => {
    return 0;
  },
  stopForegroundAction: async (id: number): Promise<void> => {

  },
  forceStopAllForegroundActions: async (): Promise<void> => {

  },
  getBackgroundTimeRemaining: async (): Promise<number> => {
    return 0;
  },
  addExpirationListener: (listener: (event: any) => void) => {
    return {
      remove: () => {},
    };
  },
}
