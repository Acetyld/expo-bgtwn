import { requireOptionalNativeModule } from 'expo';
// The native side only exists on Apple platforms (UIApplication.beginBackgroundTask).
// On Android and web this resolves to `null` and every export becomes a no-op.
export default requireOptionalNativeModule('ExpoBgtwn');
//# sourceMappingURL=ExpoBgtwnModule.js.map