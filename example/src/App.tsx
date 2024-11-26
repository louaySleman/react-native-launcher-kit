import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {
  InstalledApps,
  RNLauncherKitHelper,
  IntentAction,
} from 'react-native-launcher-kit';
import {AppState} from './interfaces';
import {LOCATIONS} from './static/locations';
import AppButton from './components/AppButton';
import AppGrid from './components/AppGrid';
import BatteryInfo from './components/BatteryInfo';
import Loading from './components/Loading';

/**
 * Main application component demonstrating LauncherKit functionality
 */
const App: React.FC = () => {
  // State declarations
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
   * Initialize app data and set up app installation listeners
   */
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const [batteryStatus, installedApps, defaultLauncher] =
          await Promise.all([
            RNLauncherKitHelper.getBatteryStatus(),
            InstalledApps.getApps({
              includeVersion: true,
              includeAccentColor: true,
            }),
            RNLauncherKitHelper.getDefaultLauncherPackageName(),
          ]);

        setBattery(batteryStatus);
        setApps(installedApps);
        setFirstApp(installedApps[0]);
        setDefaultLauncherPackageName(defaultLauncher);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    // Set up app installation/removal listeners
    InstalledApps.startListeningForAppInstallations(
      (app: AppState['apps'][0]) => {
        setApps(prev => [app, ...prev]);
      },
    );

    InstalledApps.startListeningForAppRemovals((packageName: string) => {
      setApps(prev => prev.filter(item => item.packageName !== packageName));
    });

    // Cleanup listeners
    return () => {
      InstalledApps.stopListeningForAppInstallations();
      InstalledApps.stopListeningForAppRemovals();
    };
  }, []);

  // App launch handlers
  const handlers = {
    openApplication: (packageName: string) => {
      RNLauncherKitHelper.launchApplication(packageName);
    },

    openFirstApp: () => {
      if (!firstApp) {
        console.warn('No apps available to open');
        return;
      }
      RNLauncherKitHelper.launchApplication(firstApp.packageName);
    },

    openSettings: () => RNLauncherKitHelper.goToSettings(),

    openSetDefault: () => RNLauncherKitHelper.openSetDefaultLauncher(),

    openAlarm: () => RNLauncherKitHelper.openAlarmApp(),

    openMapLocation: () => {
      const {latitude, longitude, label} = LOCATIONS.TIMES_SQUARE;
      RNLauncherKitHelper.launchApplication('com.google.android.apps.maps', {
        action: IntentAction.VIEW,
        data: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(
          label,
        )})&z=16`,
      });
    },

    openMapNavigation: () => {
      const {latitude, longitude} = LOCATIONS.EIFFEL_TOWER;
      RNLauncherKitHelper.launchApplication('com.google.android.apps.maps', {
        action: IntentAction.VIEW,
        data: `google.navigation:q=${latitude},${longitude}&mode=driving`,
      });
    },

    openYouTube: () => {
      RNLauncherKitHelper.launchApplication('com.android.chrome', {
        action: IntentAction.VIEW,
        data: 'https://www.youtube.com',
      });
    },
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Installed Apps Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Installed Applications</Text>
            <Text style={styles.sectionSubtitle}>
              Total Apps: {apps.length}
            </Text>
          </View>

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
            onAppPress={handlers.openApplication}
          />
        </View>

        {/* System Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>System Information</Text>
          </View>
          <BatteryInfo battery={battery} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Default Launcher:</Text>
            <Text style={styles.infoValue}>{defaultLauncherPackageName}</Text>
          </View>
        </View>

        {/* Demo Actions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Launch Apps Demo</Text>
            <Text style={styles.sectionSubtitle}>
              Examples of launching apps with parameters
            </Text>
          </View>

          <View style={styles.actionGroup}>
            <Text style={styles.groupTitle}>💻 Basic Controls</Text>
            <AppButton
              onPress={handlers.openFirstApp}
              title={`📱 Launch ${firstApp?.label || 'First App'}`}
            />
            <AppButton
              onPress={handlers.openSettings}
              title="⚙️ System Settings"
            />
          </View>

          <View style={styles.actionGroup}>
            <Text style={styles.groupTitle}>🛠️ System Utilities</Text>
            <AppButton
              onPress={handlers.openSetDefault}
              title="🏠 Set Default Launcher"
            />
            <AppButton onPress={handlers.openAlarm} title="⏰ Open Alarm" />
          </View>

          <View style={styles.actionGroup}>
            <Text style={styles.groupTitle}>🗺️ Location Services</Text>
            <AppButton
              onPress={handlers.openMapLocation}
              title="🗽 View Times Square Location"
            />
            <AppButton
              onPress={handlers.openMapNavigation}
              title="🗼 Navigate to Eiffel Tower"
            />
          </View>

          <View style={styles.actionGroup}>
            <Text style={styles.groupTitle}>🌐 Web Applications</Text>
            <AppButton
              onPress={handlers.openYouTube}
              title="📺 Launch YouTube in Browser"
            />
          </View>
        </View>
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
  section: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
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
  actionGroup: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#718096',
  },
});

export default App;
