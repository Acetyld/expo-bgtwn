// Import the native module. On web, it will be resolved to ExpoBgtwn.web.ts
// and on native platforms to ExpoBgtwn.ts
import { Platform } from "react-native";

import ExpoBgtwnModule from "./ExpoBgtwnModule";
import { EventEmitter, NativeModulesProxy, Subscription } from "expo-modules-core";
import { ExpireEventPayload } from "./ExpoBgtwnModule.types";
const emitter = Platform.OS === 'ios' ? new EventEmitter(
  ExpoBgtwnModule ?? NativeModulesProxy.ExpoForegroundActions
): null;

export const startForegroundAction = async (): Promise<number> => {
  if (Platform.OS !== "ios") {
    return 0;
  }
  return ExpoBgtwnModule.startForegroundAction();
};
export const stopForegroundAction = async (id: number): Promise<void> => {
  await ExpoBgtwnModule.stopForegroundAction(id);
};

export const forceStopAllForegroundActions = async (): Promise<void> => {
  await ExpoBgtwnModule.forceStopAllForegroundActions();
};

export const getBackgroundTimeRemaining = async (): Promise<number> => {
  if (Platform.OS !== "ios") return -1;
  return await ExpoBgtwnModule.getBackgroundTimeRemaining();
};
export function addExpirationListener(
  listener: (event: ExpireEventPayload) => void
): Subscription {

  return emitter ? emitter.addListener("onExpirationEvent", listener): { remove: () => {} };
}
