import {AppDetail} from 'react-native-launcher-kit/typescript/Interfaces/InstalledApps';
import {BatteryStatus} from 'react-native-launcher-kit/typescript/Interfaces/battery';

export interface AppState {
  showWithAccent: boolean;
  apps: AppDetail[];
  firstApp?: AppDetail;
  defaultLauncherPackageName: string;
  battery: BatteryStatus;
  isLoading: boolean;
}
