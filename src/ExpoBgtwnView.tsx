import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoBgtwnViewProps } from './ExpoBgtwn.types';

const NativeView: React.ComponentType<ExpoBgtwnViewProps> =
  requireNativeViewManager('ExpoBgtwn');

export default function ExpoBgtwnView(props: ExpoBgtwnViewProps) {
  return <NativeView {...props} />;
}
