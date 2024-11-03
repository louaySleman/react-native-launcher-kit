/**
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.0.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */
import { DeviceEventEmitter, NativeModules } from 'react-native';
import type {
  AppDetail,
  GetAppsOptions,
  InstalledApps,
} from '../Interfaces/InstalledApps';
import { LINKING_ERROR } from '../Utils/helper';

const LauncherKit = NativeModules.LauncherKit
  ? NativeModules.LauncherKit
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Object containing functions to retrieve information about installed apps.
 */
const installedApps: InstalledApps = {
  /**
   * Returns an array of all installed apps on the device.
   * @returns An array of `AppDetail` objects representing the installed apps.
   */
  async getApps(options: GetAppsOptions): Promise<AppDetail[]> {
    try {
      const apps =
        (await LauncherKit?.getApps(
          options?.includeVersion || false,
          options?.includeAccentColor || false
        )) || '[]';
      return JSON.parse(apps);
    } catch (error) {
      if (__DEV__) console.error(error); // Log the error to the console if the app is in development mode.
      return []; // Return an empty array if an error occurs
    }
  },
  /**
   * Returns an array of all installed apps on the device, sorted alphabetically by app label.
   * @returns An array of `AppDetail` objects representing the installed apps.
   */
  async getSortedApps(options: GetAppsOptions): Promise<AppDetail[]> {
    try {
      const apps =
        (await LauncherKit?.getApps(
          options?.includeVersion || false,
          options?.includeAccentColor || false
        )) || '[]';
      const tempApps = JSON.parse(apps); // Attempt to parse the JSON data returned by `LauncherKit.getApps()`.
      return tempApps.sort((a: AppDetail, b: AppDetail) =>
        a.label?.toLowerCase().localeCompare(b.label?.toLowerCase())
      ); // Sort the array of apps by app label in alphabetical order, ignoring case.
    } catch (error) {
      if (__DEV__) console.error(error); // Log the error to the console if the app is in development mode.
      return []; // Return an empty array if an error occurs
    }
  },
  startListeningForAppInstallations(callback: (app: AppDetail) => void): void {
    DeviceEventEmitter.addListener('onAppInstalled', (app: string) => {
      callback(JSON.parse(app));
    });
    LauncherKit.startListeningForAppInstallations();
  },

  stopListeningForAppInstallations(): void {
    DeviceEventEmitter.removeAllListeners('onAppInstalled');
    LauncherKit.stopListeningForAppInstallations();
  },
  startListeningForAppRemovals(callback: (packageName: string) => void): void {
    DeviceEventEmitter.addListener('onAppRemoved', (packageName: string) => {
      callback(packageName);
    });
    LauncherKit.startListeningForAppRemovals();
  },

  stopListeningForAppRemovals(): void {
    DeviceEventEmitter.removeAllListeners('onAppRemoved');
    LauncherKit.stopListeningForAppRemovals();
  },
};

export default installedApps;
