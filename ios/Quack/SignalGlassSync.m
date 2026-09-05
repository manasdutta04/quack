#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SignalGlassSync, NSObject)
RCT_EXTERN_METHOD(scheduleBackgroundSync:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
