import { Platform } from 'react-native';

/**
 * Error message indicating that the 'react-native-launcher-kit' package is not linked properly.
 */
export const LINKING_ERROR =
  `The package 'react-native-launcher-kit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({
    ios: "- This package only work on Android.'\n",
    default: '',
  }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';
