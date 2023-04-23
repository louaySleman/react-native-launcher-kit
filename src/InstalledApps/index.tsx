import { NativeModules } from 'react-native';
import type { AppDetail, InstalledApps } from '../Interfaces/InstalledApps';
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
  getApps(): AppDetail[] {
    try {
      return JSON.parse(LauncherKit?.getApps); // Attempt to parse the JSON data returned by `LauncherKit.getApps()`.
    } catch (error) {
      if (__DEV__) console.error(error); // Log the error to the console if the app is in development mode.
      return []; // Return an empty array if an error occurs
    }
  },
  /**
   * Returns an array of all installed apps on the device, sorted alphabetically by app label.
   * @returns An array of `AppDetail` objects representing the installed apps.
   */
  getSortedApps(): AppDetail[] {
    try {
      const tempApps = JSON.parse(LauncherKit?.getApps); // Attempt to parse the JSON data returned by `LauncherKit.getApps()`.
      return tempApps.sort((a: AppDetail, b: AppDetail) =>
        a.label?.toLowerCase().localeCompare(b.label?.toLowerCase())
      ); // Sort the array of apps by app label in alphabetical order, ignoring case.
    } catch (error) {
      if (__DEV__) console.error(error); // Log the error to the console if the app is in development mode.
      return []; // Return an empty array if an error occurs
    }
  },
};

export default installedApps;
