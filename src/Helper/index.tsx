import { NativeModules } from 'react-native';
import { LINKING_ERROR } from '../Utils/helper';
import type { LauncherKitHelperProps } from '../Interfaces/helper';
import type { BatteryStatus } from '../Interfaces/battery';

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
 * A helper object with utility functions for launching apps and interacting with the launcher on Android devices.
 */
const LauncherKitHelper: LauncherKitHelperProps = {
  /**
   * Launches an app with the given bundle ID.
   *
   * @param bundleId The bundle ID of the app to launch.
   * @returns `true` if the app was successfully launched, `false` otherwise.
   */
  launchApplication: (bundleId: string): boolean => {
    try {
      LauncherKit.launchApplication(bundleId);
      return true;
    } catch (error) {
      if (__DEV__) console.error(error);
      return false;
    }
  },
  /**
   * Opens the settings screen of the device.
   *
   * @returns `true` if the settings screen was successfully opened, `false` otherwise.
   */
  goToSettings: (): void => {
    try {
      LauncherKit.goToSettings();
    } catch (error) {
      if (__DEV__) console.error(error);
    }
  },
  /**
   * Checks if an app with the given bundle ID is installed on the device.
   *
   * @param bundleId The bundle ID of the app to check for.
   * @returns A `Promise` that resolves to `true` if the app is installed, `false` otherwise.
   */
  checkIfPackageInstalled: (bundleId: string): Promise<boolean> =>
    new Promise((resolve) => {
      LauncherKit.isPackageInstalled(bundleId, (installed: boolean) => {
        resolve(installed);
      });
    }),
  /**
   * Checks the default launcher app on the device.
   *
   * @returns The bundle ID of the default launcher app, or an empty string if an error occurs.
   */
  getDefaultLauncherPackageName: (): Promise<string> =>
    new Promise((resolve) => {
      LauncherKit.getDefaultLauncherPackageName()
        .then((packageName: string) => {
          resolve(packageName);
        })
        .catch((error: any) => {
          if (__DEV__)
            console.error(
              'Error getting default launcher package name:',
              error
            );
          resolve('');
        });
    }),
  /**
   * Opens the default alarm app on the device.
   *
   * @returns `true` if the alarm app was successfully opened, `false` otherwise.
   */
  openAlarmApp: (): boolean => {
    try {
      LauncherKit.openAlarmApp();
      return true;
    } catch (error) {
      if (__DEV__) console.error(error);
      return false;
    }
  },
  /**
   * Returns the current battery status of the device.
   * @returns A promise that resolves to a `BatteryStatus` object with the `level` (0-100) and `isCharging` properties.
   * If the `LauncherKit` object is not available, the promise is rejected with a default `BatteryStatus` object with level `0` and `isCharging` set to `false`.
   */
  getBatteryStatus: (): Promise<BatteryStatus> =>
    new Promise((resolve, reject) => {
      if (!LauncherKit) reject({ level: 0, isCharging: false });
      LauncherKit?.getBatteryStatus((level: number, isCharging: boolean) => {
        resolve({ level, isCharging });
      });
    }),
  /**
   * Opens the "Set Default Launcher" screen on the device.
   * @returns A promise that resolves to `true` if the screen was opened successfully, or rejects with `false` if the `LauncherKit` object is not available.
   */
  openSetDefaultLauncher: (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      if (!LauncherKit) reject(false);
      LauncherKit?.openSetDefaultLauncher()
        .then((result: boolean) => {
          resolve(result); // true
        })
        .catch((error: any) => {
          if (__DEV__) console.error('Error opening set default launcher:', error);
          reject(error);
        });
    }),
};

export default LauncherKitHelper;
