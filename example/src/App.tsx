import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { InstalledApps, RNLauncherKitHelper } from 'react-native-launcher-kit';
import { AppDetail } from '../../lib/typescript/Interfaces/InstalledApps';
import { BatteryStatus } from '../../lib/typescript/Interfaces/battery';

const App = () => {
  const [apps, setApps] = useState<AppDetail[]>([]);
  const [firstApp, setFirstApp] = useState<AppDetail | undefined>(undefined);
  const [defaultLauncherPackageName, setDefaultLauncherPackageName] =
    useState<string>('Unknown');
  const [battery, setBattery] = useState<BatteryStatus>({
    isCharging: false,
    level: 0,
  });
  const initApp = async () => {
    const battery = await RNLauncherKitHelper.getBatteryStatus();
    setBattery(battery);
    const apps = InstalledApps.getSortedApps();
    setApps(apps);
    setFirstApp(apps[0]);
    const defaultLauncher =
      await RNLauncherKitHelper.getDefaultLauncherPackageName();
    setDefaultLauncherPackageName(defaultLauncher);
  };

  useEffect(() => {
    initApp();
  }, []);

  const openSettings = () => {
    RNLauncherKitHelper.goToSettings();
  };

  const openSetDefault = () => {
    RNLauncherKitHelper.openSetDefaultLauncher();
  };
  const openAlarm = () => {
    RNLauncherKitHelper.openAlarmApp();
  };
  const openFirstApp = () => {
    if (!firstApp) return;
    RNLauncherKitHelper.launchApplication(firstApp.packageName);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: '100%' }}>
        <Text style={styles.bold}>Apps Installed count </Text>
        <Text>{apps.length}</Text>
        <Text style={styles.bold}>Battery Level </Text>
        <Text>{battery.level}</Text>
        <Text style={styles.bold}>Is Battery charging: </Text>
        <Text>{battery.isCharging ? 'true' : 'false'}</Text>
        <Text style={styles.bold}>
          Currently Default launcher package name:
        </Text>
        <Text>{defaultLauncherPackageName}</Text>
        <Text style={styles.bold}>
          App Example (Currently first app from the array)
        </Text>
        {!!firstApp && (
          <View style={styles.appContainer}>
            <Image
              style={styles.image}
              source={{
                uri: `data:image/jpeg;base64,${firstApp.icon}`,
              }}
            />
            <Text>Name: {firstApp.label}</Text>
            <Text>BundleID: {firstApp.packageName}</Text>
          </View>
        )}
        <View style={styles.button}>
          <Button
            onPress={() => openFirstApp()}
            title={'Open First App ( ' + firstApp?.label + ' )'}
          />
        </View>
        <View style={styles.button}>
          <Button onPress={() => openSettings()} title={'Open Settings'} />
        </View>
        <View style={styles.button}>
          <Button
            onPress={() => openSetDefault()}
            title={'Open set Default Launcher'}
          />
        </View>
        <View style={styles.button}>
          <Button onPress={() => openAlarm()} title={'Open Alarm'} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '3%',
  },
  bold: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: '4%',
  },
  button: {
    marginTop: '2%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  appContainer: {
    marginBottom: '4%',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
});
export default App;
