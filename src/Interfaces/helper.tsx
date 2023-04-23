import type { BatteryStatus } from './battery';

export interface LauncherKitHelperProps {
  launchApplication(bundleId: string): void;
  goToSettings(): void;
  checkIfPackageInstalled(bundleId: string): Promise<boolean>;
  getDefaultLauncherPackageName(): Promise<string>;
  openAlarmApp(): void;
  getBatteryStatus(): Promise<BatteryStatus>;
  openSetDefaultLauncher(): Promise<boolean>;
}
