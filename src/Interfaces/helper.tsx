/**
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.0.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */
import type { BatteryStatus } from './battery';

export interface LauncherKitHelperProps {
  launchApplication(bundleId: string, params?: Record<string, string>): void;

  goToSettings(): void;

  checkIfPackageInstalled(bundleId: string): Promise<boolean>;

  getDefaultLauncherPackageName(): Promise<string>;

  openAlarmApp(): void;

  getBatteryStatus(): Promise<BatteryStatus>;

  openSetDefaultLauncher(): Promise<boolean>;
}
