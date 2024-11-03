import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {InstalledApps, RNLauncherKitHelper} from 'react-native-launcher-kit';
import {AppState} from './interfaces';
import AppButton from './components/AppButton';
import AppGrid from './components/AppGrid';
import AppDetail from './components/AppDetail';
import BatteryInfo from './components/BatteryInfo';
import Loading from './components/Loading';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showWithAccent, setShowWithAccent] = useState<boolean>(true);
  const [apps, setApps] = useState<AppState['apps']>([]);
  const [firstApp, setFirstApp] = useState<AppState['firstApp']>(undefined);
  const [defaultLauncherPackageName, setDefaultLauncherPackageName] =
    useState<string>('Unknown');
  const [battery, setBattery] = useState<AppState['battery']>({
    isCharging: false,
    level: 0,
  });

  /**
   * Initializes the app by fetching battery status, installed apps, and default launcher information.
   */
  const initApp = async () => {
    setIsLoading(true);
    try {
      const battery = await RNLauncherKitHelper.getBatteryStatus();
      setBattery(battery);

      const apps = await InstalledApps.getApps({
        includeVersion: true,
        includeAccentColor: true,
      });
      setApps(apps);
      setFirstApp(apps[0]);

      const defaultLauncher =
        await RNLauncherKitHelper.getDefaultLauncherPackageName();
      setDefaultLauncherPackageName(defaultLauncher);
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initApp();

    // Start listening for app installations and removals
    InstalledApps.startListeningForAppInstallations(
      (app: AppState['apps'][0]) => {
        setApps(prev => [app, ...prev]);
      },
    );

    InstalledApps.startListeningForAppRemovals((packageName: string) => {
      setApps(prev => prev.filter(item => item.packageName !== packageName));
    });

    // Cleanup listeners on unmount
    return () => {
      InstalledApps.stopListeningForAppInstallations();
      InstalledApps.stopListeningForAppRemovals();
    };
  }, []);

  /**
   * Opens the device settings page.
   */
  const openSettings = () => {
    RNLauncherKitHelper.goToSettings();
  };

  /**
   * Opens the launcher settings to set the default launcher.
   */
  const openSetDefault = () => {
    RNLauncherKitHelper.openSetDefaultLauncher();
  };

  /**
   * Opens the device alarm app.
   */
  const openAlarm = () => {
    RNLauncherKitHelper.openAlarmApp();
  };

  /**
   * Opens the first app in the installed apps list.
   */
  const openFirstApp = () => {
    if (!firstApp) {
      return;
    }
    RNLauncherKitHelper.launchApplication(
      firstApp.packageName,
      {test: '2'},
      'slide',
    );
  };

  /**
   * Opens a specific app by package name.
   */
  const openApplication = (packageName: string) => {
    RNLauncherKitHelper.launchApplication(packageName);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Apps Installed count</Text>
        <Text style={styles.text}>{apps.length}</Text>
        <View style={styles.toggleContainer}>
          <Pressable
            style={[
              styles.toggleButton,
              showWithAccent ? styles.toggleButtonActive : {},
            ]}
            onPress={() => setShowWithAccent(true)}>
            <Text
              style={[
                styles.toggleButtonText,
                showWithAccent ? styles.toggleButtonTextActive : {},
              ]}>
              With Accent
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              !showWithAccent ? styles.toggleButtonActive : {},
            ]}
            onPress={() => setShowWithAccent(false)}>
            <Text
              style={[
                styles.toggleButtonText,
                !showWithAccent ? styles.toggleButtonTextActive : {},
              ]}>
              Without Accent
            </Text>
          </Pressable>
        </View>
        <AppGrid
          apps={apps}
          showWithAccent={showWithAccent}
          onAppPress={openApplication}
        />
        <BatteryInfo battery={battery} />
        <Text style={styles.title}>
          Currently Default launcher package name:
        </Text>
        <Text style={styles.text}>{defaultLauncherPackageName}</Text>
        <Text style={styles.title}>
          App Example (Currently first app from the array) with accent
          background
        </Text>
        {firstApp && <AppDetail app={firstApp} />}
        <AppButton
          onPress={openFirstApp}
          title={`Open First App (${firstApp?.label})`}
        />
        <AppButton onPress={openSettings} title="Open Settings" />
        <AppButton onPress={openSetDefault} title="Set Default Launcher" />
        <AppButton onPress={openAlarm} title="Open Alarm" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#DDD',
    marginHorizontal: 5,
  },
  toggleButtonActive: {
    backgroundColor: '#9261E2',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#666',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
});

export default App;
