
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNLauncherKitSpec.h"

@interface LauncherKit : NSObject <NativeLauncherKitSpec>
#else
#import <React/RCTBridgeModule.h>

@interface LauncherKit : NSObject <RCTBridgeModule>
#endif

@end
