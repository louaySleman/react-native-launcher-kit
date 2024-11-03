# react-native-launcher-kit

This is a React Native package for Android that provides a set of helper functions for launching apps and interacting
with the launcher. It works with automatic linking on React Native versions 0.60 and higher. For older versions, manual
linking is required.

<p align="left">
  <a href="https://www.npmjs.com/package/react-native-launcher-kit"><img src="https://img.shields.io/badge/npm-v2.0.0-blue"></a>
 <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
</p>

## Installation

```sh
npm install react-native-launcher-kit
```

```sh
yarn add react-native-launcher-kit
```

If you're using React Native 0.60 or higher, the package will be automatically linked for you. For older versions, you
need to manually link the package.

<details>
  <summary>Manual Linking</summary>

  <!-- Content of the dropdown goes here -->

1. In your project directory, run the following command:

```sh
react-native link react-native-launcher-kit
```

2. Open the `android/app/build.gradle` file in your project and add the following line to the `dependencies` section:

```typescript
implementation
project(':react-native-launcher-kit')
```

3. Open the `MainApplication.java` file in your project and add the following import statement:

```java
import com.launcherkit;
```

4. Add the package to the list of packages in the getPackages() method:

```java
protected List<ReactPackage> getPackages(){
  return Arrays.asList(
  new MainReactPackage(),
  new LauncherKit() // <-- Add this line
  );
  }
```

</details>

## Features

The features of the React Native Launcher Kit include:

1. Get all installed apps (sorted and unsorted).
2. Get the current default launcher.
3. Get the current battery percentage and whether the phone is charging or not.
4. Check if a package (bundle ID) is installed.
5. Open system settings.
6. Open "Set as default launcher" screen directly.
7. Open an app using its bundle ID with custom params.
8. Open the alarm app directly.
9. Listen for app installations and removals.
10. Get app version and color accent for each app on the installed app list.

❤️ **Love this project? Consider supporting its development!**
<p align="left">
  <a href="https://www.patreon.com/louaysleman">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" />
  </a>
</p>

## Important Note

Starting with Android 11 (API level 30), you need to add the following permission to your `AndroidManifest.xml` file to query package information:

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES"/>
 ```
**Important Note:** Google Play Store has specific policies regarding the use of `QUERY_ALL_PACKAGES` permission. Your app must have a core functionality that requires querying installed apps to use this permission. You may need to provide justification during the app review process. Make sure your app's use case complies with the Google Play Policy.

This permission is required for the following features in this package:

- Getting installed apps list
- Checking if a specific package is installed
- Listening for app installations and removals

## Demo
<p>
   <img width="200" src="https://raw.githubusercontent.com/louaySleman/react-native-launcher-kit/main/screenshots/1.gif" />
</p>

## Breaking History

### [2.0.0](https://github.com/louaySleman/react-native-launcher-kit/releases/tag/2.0.0)
**Breaking Changes:**

🚀 **Performance Optimization**
- Changed getApps and getSortedApps to return Promises
- Apps are now loaded on-demand when calling getInstalledApps instead of at app startup
- This change dramatically improves initial app launch performance

🔄 **API Changes**
- Icon property now returns file path instead of base64 string
- Added new GetAppsOptions interface for configurable app queries
- Added support for custom parameters in launchApplication
- Moved `QUERY_ALL_PACKAGES` permission requirement to user's AndroidManifest.xml
  > Previously this was included in the package's manifest, now users need to add it manually if their app requires querying all packages

✨ **New Features**
- App version and accent color support in getApps and getSortedApps
- New app installation listener with startListeningForAppInstallations
- New app removal listener with startListeningForAppRemovals

### [1.0.0](https://github.com/louaySleman/react-native-launcher-kit/releases/tag/1.0.4)
First release

## Methods

### 1. `getApps(options: GetAppsOptions): Promise<AppDetail[]>`

Returns an array of all installed apps on the device with optional version and accent color.



```typescript
import { InstalledApps } from 'react-native-launcher-kit';

const result = await InstalledApps.getApps({ includeVersion: true, includeAccentColor: true });
```

### 2. `getSortedApps(options: GetAppsOptions): Promise<AppDetail[]>`

Returns an array of all installed apps on the device, sorted alphabetically by app label, with optional version and accent color.

```typescript
import { InstalledApps } from 'react-native-launcher-kit';

const result = await InstalledApps.getSortedApps({ includeVersion: true, includeAccentColor: true });
```

#### `AppDetail Interface`

```typescript
interface AppDetail {
  label: string;
  packageName: string;
  icon: string;
  version?: string;
  accentColor?: string;
}
```
#### `GetAppsOptions Interface`

```typescript
interface GetAppsOptions {
  includeVersion: boolean;
  includeAccentColor: boolean;
}
```

### Note:

- The icon property will now return the file path of the icon image instead of the base64 encoded string as in previous versions.
- The accentColor property provides the dominant color of the app's icon for easy UI theming.

### 3. `launchApplication`

A helper function allow you to Launch an application using its bundle ID with optional params.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

RNLauncherKitHelper.launchApplication('com.example.louay', {param1: 'param1'});
```

### 4. `checkIfPackageInstalled: Promise<boolean>`

Checks if an app with the given bundle ID is installed on the device.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

const result = await RNLauncherKitHelper.checkIfPackageInstalled(
  'com.android.settings',
);
console.log(result); // true or false.
```

### 5. `getDefaultLauncherPackageName: Promise<string>`

Checks the default launcher app on the device.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

const result = await RNLauncherKitHelper.getDefaultLauncherPackageName();
console.log(result);
```

### 6. `openSetDefaultLauncher: Promise<boolean>`

Opens the "Set Default Launcher" screen on the device.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

const result = await RNLauncherKitHelper.openSetDefaultLauncher();
console.log(result); // true or false.
```

### 7. `getBatteryStatus: Promise<BatteryStatus>`

Returns the current battery status of the device and if the phone is currently charging or not.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

const result = await RNLauncherKitHelper.getBatteryStatus();
console.log(result); // {"isCharging": false, "level": 100}
```

#### `BatteryStatus Interface`

```typescript
interface AppDetail {
  level: number;
  isCharging: boolean;
}
```

### 8. `openAlarmApp: boolean`

Opens the default alarm app on the device.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

const result = await RNLauncherKitHelper.getBatteryStatus();
console.log(result);
```

### 9. `goToSettings`

Opens the settings screen of the device.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

RNLauncherKitHelper.goToSettings();
```

### 10. Start listening for new App installations

Listens for app installations and provides app details when an app is installed.

```jsx
import { InstalledApps } from 'react-native-launcher-kit';
import { useEffect, useState } from 'react';

const App = () => {
  const [apps, setApps] = useState<AppDetail[]>([]);

  const initApp = async () => {
    const appsList = await InstalledApps.getApps({
      includeVersion: true,
      includeAccentColor: true,
    });
    setApps(appsList);
  }
  useEffect(() => {
    InstalledApps.startListeningForAppInstallations((app) => {
      setApps((prev) => [app, ...prev]);
    });

    return () => {
      InstalledApps.stopListeningForAppInstallations();
    };
  }, []);

  return (
    // Your component rendering logic
  );
};
```


### 11. Start listening for an App removal

Listens for app removals (uninstallations) and provides the package name when an app is removed.

```jsx
import { InstalledApps } from 'react-native-launcher-kit';
import { useEffect, useState } from 'react';

const App = () => {
  const [apps, setApps] = useState<AppDetail[]>([]);

  const initApp = async () => {
    const appsList = await InstalledApps.getApps({
      includeVersion: true,
      includeAccentColor: true,
    });
    setApps(appsList);
  }
  useEffect(() => {
    InstalledApps.startListeningForAppRemovals((packageName) => {
      setApps((prev) =>
        prev.filter((item) => item.packageName !== packageName)
      );
    });

    return () => {
      InstalledApps.stopListeningForAppRemovals();
    };
  }, []);

  return (
    // Your component rendering logic
  );
};
```

## Demo App

React-Native-Launcher-Kit has been utilized for testing purposes on a launcher known as NoPhoneLauncher. You can experience its functionality in real-time by accessing it on Google Play via the following [link](https://nophonelauncher.canguru.au).

## Example App

You can experience the functionality of the code by exploring the examples provided in our GitHub repository, which can be accessed from the following [link](https://github.com/louaySleman/react-native-launcher-kit/tree/main/example).

## License

MIT

---
