import {AppDetail} from 'react-native-launcher-kit/typescript/Interfaces/InstalledApps';

export interface AppGridProps {
  apps: AppDetail[];
  showWithAccent: boolean;
  onAppPress: (packageName: string) => void;
}
