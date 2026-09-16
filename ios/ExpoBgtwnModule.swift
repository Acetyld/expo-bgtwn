import ExpoModulesCore
import UIKit

private let onExpirationEvent = "onExpirationEvent"

/// Thin wrapper around `UIApplication.beginBackgroundTask(withName:expirationHandler:)`.
///
/// Call `startForegroundAction()` before async work that must survive the user
/// backgrounding the app (queue flush, upload), and `stopForegroundAction(id)` when
/// it finishes. iOS grants roughly 30 seconds; the module emits `onExpirationEvent`
/// and ends the task itself when that budget runs out.
///
/// Uses the Expo Modules API definition DSL on purpose. The SDK 57 Swift macros
/// (`@ExpoModule` / `@JS async`) compiled, but resolving their promises while the app
/// moved to the background crashed Hermes (EXC_BAD_ACCESS in `expo::callFunction`,
/// reproduced twice on iOS 26.5 with expo-modules-core 57.0.18). Revisit on SDK 58.
public final class ExpoBgtwnModule: Module {
  /// Tasks that JS started and has not stopped yet. Only touched on the main queue.
  private var backgroundTaskIdentifiers: [UIBackgroundTaskIdentifier] = []

  public func definition() -> ModuleDefinition {
    Name("ExpoBgtwn")

    Events(onExpirationEvent)

    /// Begins a background task and returns its identifier (`UIBackgroundTaskIdentifier.rawValue`).
    AsyncFunction("startForegroundAction") { () -> Int in
      var identifier: UIBackgroundTaskIdentifier = .invalid
      identifier = UIApplication.shared.beginBackgroundTask(withName: "expo-bgtwn") { [weak self] in
        // Expiration handler (main thread): tell JS, then end the task so the app is not killed.
        guard let self else {
          UIApplication.shared.endBackgroundTask(identifier)
          return
        }
        self.sendEvent(onExpirationEvent, [
          "remaining": UIApplication.shared.backgroundTimeRemaining,
          "identifier": identifier.rawValue,
        ])
        self.forget(identifier)
        UIApplication.shared.endBackgroundTask(identifier)
      }
      if identifier != .invalid {
        self.backgroundTaskIdentifiers.append(identifier)
      }
      return identifier.rawValue
    }
    .runOnQueue(.main)

    /// Ends the background task with the given identifier. No-op for unknown or already ended tasks.
    AsyncFunction("stopForegroundAction") { (taskIdentifier: Int) in
      let identifier = UIBackgroundTaskIdentifier(rawValue: taskIdentifier)
      guard identifier != .invalid, self.forget(identifier) else {
        return
      }
      UIApplication.shared.endBackgroundTask(identifier)
    }
    .runOnQueue(.main)

    /// Ends every background task this module still tracks.
    AsyncFunction("forceStopAllForegroundActions") {
      for identifier in self.backgroundTaskIdentifiers {
        UIApplication.shared.endBackgroundTask(identifier)
      }
      self.backgroundTaskIdentifiers.removeAll()
    }
    .runOnQueue(.main)

    /// Seconds left before iOS suspends the app. `Double.greatestFiniteMagnitude` while in the foreground.
    AsyncFunction("getBackgroundTimeRemaining") { () -> Double in
      UIApplication.shared.backgroundTimeRemaining
    }
    .runOnQueue(.main)

    /// Identifiers of background tasks that are still running.
    AsyncFunction("getForegroundIdentifiers") { () -> [Int] in
      self.backgroundTaskIdentifiers.map(\.rawValue)
    }
    .runOnQueue(.main)
  }

  /// Removes the identifier from the tracked list. Returns `false` when it was not tracked.
  @discardableResult
  private func forget(_ identifier: UIBackgroundTaskIdentifier) -> Bool {
    guard let index = backgroundTaskIdentifiers.firstIndex(of: identifier) else {
      return false
    }
    backgroundTaskIdentifiers.remove(at: index)
    return true
  }
}
