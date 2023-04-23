# react-native-launcher-kit

This is a React Native package for Android that provides a set of helper functions for launching apps and interacting
with the launcher. It works with automatic linking on React Native versions 0.60 and higher. For older versions, manual
linking is required.

<p align="left">
  <a href="https://www.npmjs.com/package/react-native-launcher-kit"><img src="https://img.shields.io/badge/npm-v1.0.0-blue"></a>
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
7. Open an app using its bundle ID.
8. Open the alarm app directly.

## Demo
<p>
   <img width="200" src="https://raw.githubusercontent.com/louaySleman/react-native-launcher-kit/master/screenshots/1.webp" />
</p>

## Methods

### 1. `getApps(): AppDetail[]`

Returns an array of all installed apps on the device.

```typescript
import { InstalledApps } from 'react-native-launcher-kit';

const result = InstalledApps.getApps();
```

### 2. `getSortedApps(): AppDetail[]`

Returns an array of all installed apps on the device, sorted alphabetically by app label.

```typescript
import { InstalledApps } from 'react-native-launcher-kit';

const result = InstalledApps.getSortedApps();
```

#### `AppDetail Interface`

```typescript
interface AppDetail {
  label: string;
  packageName: string;
  icon: string; // base64
}
```

### 3. `launchApplication`

A helper function allow you to launcher application using bundle ID.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

RNLauncherKitHelper.launchApplication('com.example.louay')
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

## Demo App

React-Native-Launcher-Kit has been utilized for testing purposes on a launcher known as NoPhoneLauncher. You can experience its functionality in real-time by accessing it on Google Play via the following [link](https://nophonelauncher.canguru.com.au).

## Example App

You can experience the functionality of the code by exploring the examples provided in our GitHub repository, which can be accessed from the following link.

## License

MIT

---
