import ExpoModulesCore
import UIKit

/// Payload of the `onExpirationEvent` event. Fired right before iOS ends a background
/// task that the JS side forgot (or was too slow) to stop.
@Record
struct ExpirationEvent {
  /// Seconds the system still granted when the expiration handler ran.
  var remaining: Double
  /// The identifier returned by `startForegroundAction()`.
  var identifier: Int
}

/// Thin wrapper around `UIApplication.beginBackgroundTask(expirationHandler:)`.
///
/// Call `startForegroundAction()` before async work that must survive the user
/// backgrounding the app (queue flush, upload), and `stopForegroundAction(id)` when
/// it finishes. iOS grants roughly 30 seconds; the module emits `onExpirationEvent`
/// and ends the task itself when that budget runs out.
@ExpoModule("ExpoBgtwn")
public final class ExpoBgtwnModule: Module {
  /// Tasks that JS started and has not stopped yet. Only touched on the main thread
  /// (every `@JS` body hops to `MainActor`; UIKit runs the expiration handler there too).
  private var backgroundTaskIdentifiers: [UIBackgroundTaskIdentifier] = []

  @Event("onExpirationEvent")
  var onExpirationEvent: (ExpirationEvent) -> Void

  /// Begins a background task and returns its identifier (`UIBackgroundTaskIdentifier.rawValue`).
  @JS
  func startForegroundAction() async -> Int {
    return await MainActor.run {
      var identifier: UIBackgroundTaskIdentifier = .invalid
      identifier = UIApplication.shared.beginBackgroundTask(withName: "expo-bgtwn") { [weak self] in
        // Expiration handler: tell JS, then end the task so the app is not killed.
        let remaining = UIApplication.shared.backgroundTimeRemaining
        self?.onExpirationEvent(ExpirationEvent(remaining: remaining, identifier: identifier.rawValue))
        self?.forget(identifier)
        UIApplication.shared.endBackgroundTask(identifier)
      }
      if identifier != .invalid {
        backgroundTaskIdentifiers.append(identifier)
      }
      return identifier.rawValue
    }
  }

  /// Ends the background task with the given identifier. No-op for unknown or already ended tasks.
  @JS
  func stopForegroundAction(_ taskIdentifier: Int) async {
    await MainActor.run {
      let identifier = UIBackgroundTaskIdentifier(rawValue: taskIdentifier)
      guard identifier != .invalid, forget(identifier) else {
        return
      }
      UIApplication.shared.endBackgroundTask(identifier)
    }
  }

  /// Ends every background task this module still tracks.
  @JS
  func forceStopAllForegroundActions() async {
    await MainActor.run {
      for identifier in backgroundTaskIdentifiers {
        UIApplication.shared.endBackgroundTask(identifier)
      }
      backgroundTaskIdentifiers.removeAll()
    }
  }

  /// Seconds left before iOS suspends the app. `Double.greatestFiniteMagnitude` while in the foreground.
  @JS
  func getBackgroundTimeRemaining() async -> Double {
    return await MainActor.run {
      UIApplication.shared.backgroundTimeRemaining
    }
  }

  /// Identifiers of background tasks that are still running.
  @JS
  func getForegroundIdentifiers() async -> [Int] {
    return await MainActor.run {
      backgroundTaskIdentifiers.map(\.rawValue)
    }
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
