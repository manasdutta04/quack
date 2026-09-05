import BackgroundTasks
import Foundation

@objc(SignalGlassSync)
class SignalGlassSync: NSObject {
  @objc
  func scheduleBackgroundSync(_ resolve: @escaping (Any) -> Void, rejecter reject: @escaping (String, String, Error?) -> Void) {
    let request = BGAppRefreshTaskRequest(identifier: "com.quack.sync.refresh")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60)
    do { try BGTaskScheduler.shared.submit(request); resolve(true) }
    catch { reject("BG_TASK_SCHEDULE_FAILED", error.localizedDescription, error) }
  }
}
