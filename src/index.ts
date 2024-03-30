import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoBgtwn.web.ts
// and on native platforms to ExpoBgtwn.ts
import ExpoBgtwnModule from './ExpoBgtwnModule';
import ExpoBgtwnView from './ExpoBgtwnView';
import { ChangeEventPayload, ExpoBgtwnViewProps } from './ExpoBgtwn.types';

// Get the native constant value.
export const PI = ExpoBgtwnModule.PI;

export function hello(): string {
  return ExpoBgtwnModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoBgtwnModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoBgtwnModule ?? NativeModulesProxy.ExpoBgtwn);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoBgtwnView, ExpoBgtwnViewProps, ChangeEventPayload };
