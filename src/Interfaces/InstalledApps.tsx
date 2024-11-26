/**
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.1.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */

export interface AppDetail {
  label: string;
  packageName: string;
  icon: string;
  version?: string;
  accentColor?: string;
}

export interface GetAppsOptions {
  includeVersion: boolean;
  includeAccentColor: boolean;
}

export interface InstalledApps {
  getApps(options?: GetAppsOptions): Promise<AppDetail[]>;
  getSortedApps(options?: GetAppsOptions): Promise<AppDetail[]>;
  startListeningForAppInstallations(callback: (app: AppDetail) => void): void;
  stopListeningForAppInstallations(): void;
  startListeningForAppRemovals(callback: (packageName: string) => void): void;
  stopListeningForAppRemovals(): void;
}
