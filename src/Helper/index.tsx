/**
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.1.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */
import { NativeModules } from 'react-native';
import { LINKING_ERROR } from '../Utils/helper';
import type {
  LauncherKitHelperProps,
  LaunchParams,
} from '../Interfaces/helper';
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
   * Launches an application with optional intent parameters.
   *
   * @example
   * // Launch Google Maps with location
   * launchApplication('com.google.android.apps.maps', {
   *   action: IntentAction.VIEW,
   *   data: 'geo:37.7749,-122.4194?z=16'
   * });
   *
   * @example
   * // Launch emulator with ROM
   * launchApplication('com.explusalpha.MdEmu', {
   *   action: IntentAction.VIEW,
   *   data: 'file:///storage/emulated/0/game.rom',
   *   type: MimeType.GENESIS_ROM
   * });
   *
   * @param bundleId - The package name of the app to launch
   * @param params - Optional parameters for the intent
   * @param params.action - Intent action (e.g., 'android.intent.action.VIEW')
   * @param params.data - URI data to pass to the intent (e.g., 'file://', 'geo:', 'http://')
   * @param params.type - MIME type of the data
   * @param params.extras - Additional key-value pairs to pass as intent extras
   *
   * @returns boolean indicating whether the app was successfully launched
   *
   * @throws Will log error in development if launch fails
   */
  launchApplication: (bundleId: string, params?: LaunchParams): boolean => {
    if (!bundleId) {
      if (__DEV__) console.error('Bundle ID is required');
      return false;
    }
    try {
      LauncherKit.launchApplication(bundleId, params);
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error(
          `Failed to launch application: ${bundleId}`,
          '\nParams:',
          params,
          '\nError:',
          error
        );
      }
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
          if (__DEV__)
            console.error('Error opening set default launcher:', error);
          reject(error);
        });
    }),
};

export default LauncherKitHelper;
