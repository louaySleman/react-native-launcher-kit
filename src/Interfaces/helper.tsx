/**
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.0.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */
import type { BatteryStatus } from './battery';
import type { IntentAction, MimeType } from '../Utils/enum';

/**
 * Launch options with optional parameters
 * All fields are optional and can use either enum values or custom strings
 */
export interface LaunchParams {
  action?: IntentAction | string;
  data?: string;
  type?: MimeType | string;
  extras?: Record<string, string>;
}

export interface LauncherKitHelperProps {
  launchApplication(bundleId: string, params?: LaunchParams): void;

  goToSettings(): void;

  checkIfPackageInstalled(bundleId: string): Promise<boolean>;

  getDefaultLauncherPackageName(): Promise<string>;

  openAlarmApp(): void;

  getBatteryStatus(): Promise<BatteryStatus>;

  openSetDefaultLauncher(): Promise<boolean>;
}
