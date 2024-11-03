import { NativeModules, DeviceEventEmitter } from 'react-native';
import installedApps from '../InstalledApps';
import type { AppDetail } from '../Interfaces/InstalledApps';

// Mock DeviceEventEmitter
jest.mock('react-native', () => ({
  NativeModules: {
    LauncherKit: {
      getApps: jest.fn(),
      startListeningForAppInstallations: jest.fn(),
      stopListeningForAppInstallations: jest.fn(),
      startListeningForAppRemovals: jest.fn(),
      stopListeningForAppRemovals: jest.fn(),
    },
  },
  DeviceEventEmitter: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
  },
  Platform: {
    select: jest.fn((obj) => obj.default),
    OS: 'android',
  },
}));

describe('installedApps', () => {
  let mockLauncherKit: any;
  let mockDeviceEventEmitter: jest.Mocked<typeof DeviceEventEmitter>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLauncherKit = NativeModules.LauncherKit;
    mockDeviceEventEmitter = DeviceEventEmitter as jest.Mocked<
      typeof DeviceEventEmitter
    >;
  });

  describe('getApps', () => {
    const mockApps: AppDetail[] = [
      {
        packageName: 'com.example.app1',
        label: 'App 1',
        version: '1.0.0',
        accentColor: '#FF0000',
        icon: 'https://systemIcon/icon1',
      },
      {
        packageName: 'com.example.app2',
        label: 'App 2',
        icon: 'https://systemIcon/icon2',
      },
    ];

    it('should return apps array with default options', async () => {
      mockLauncherKit.getApps.mockResolvedValue(JSON.stringify(mockApps));
      const result = await installedApps.getApps();
      expect(result).toEqual(mockApps);
      expect(mockLauncherKit.getApps).toHaveBeenCalledWith(false, false);
    });

    it('should return apps array with custom options', async () => {
      mockLauncherKit.getApps.mockResolvedValue(JSON.stringify(mockApps));

      const result = await installedApps.getApps({
        includeVersion: true,
        includeAccentColor: true,
      });

      expect(result).toEqual(mockApps);
      expect(mockLauncherKit.getApps).toHaveBeenCalledWith(true, true);
    });

    it('should handle empty response', async () => {
      mockLauncherKit.getApps.mockResolvedValue(null);

      const result = await installedApps.getApps();

      expect(result).toEqual([]);
    });

    it('should handle errors and return empty array', async () => {
      mockLauncherKit.getApps.mockRejectedValue(
        new Error('Failed to get apps')
      );

      const result = await installedApps.getApps();

      expect(result).toEqual([]);
    });
  });

  describe('getSortedApps', () => {
    const unsortedApps: AppDetail[] = [
      {
        packageName: 'com.example.app2',
        label: 'Zebra App',
        icon: 'https://systemIcon/icon1',
      },
      {
        packageName: 'com.example.app1',
        label: 'Alpha App',
        icon: 'https://systemIcon/icon2',
      },
      {
        packageName: 'com.example.app3',
        label: 'Beta App',
        icon: 'https://systemIcon/icon3',
      },
    ];

    const sortedApps: AppDetail[] = [
      unsortedApps[1] as AppDetail,
      unsortedApps[2] as AppDetail,
      unsortedApps[0] as AppDetail,
    ];

    it('should return sorted apps array', async () => {
      mockLauncherKit.getApps.mockResolvedValue(JSON.stringify(unsortedApps));

      const result = await installedApps.getSortedApps();

      expect(result).toEqual(sortedApps);
      expect(mockLauncherKit.getApps).toHaveBeenCalledWith(false, false);
    });

    it('should handle case-insensitive sorting', async () => {
      const mixedCaseApps: AppDetail[] = [
        {
          packageName: 'com.example.app1',
          label: 'alpha App',
          icon: 'https://systemIcon/icon1',
        },
        {
          packageName: 'com.example.app2',
          label: 'BETA App',
          icon: 'https://systemIcon/icon2',
        },
      ];
      mockLauncherKit.getApps.mockResolvedValue(JSON.stringify(mixedCaseApps));
      const result = await installedApps.getSortedApps();
      expect(result[0]?.label).toBe('alpha App');
      expect(result[1]?.label).toBe('BETA App');
    });

    it('should handle errors and return empty array', async () => {
      mockLauncherKit.getApps.mockRejectedValue(
        new Error('Failed to get apps')
      );

      const result = await installedApps.getSortedApps();

      expect(result).toEqual([]);
    });
  });

  describe('App installation listeners', () => {
    it('should start listening for app installations', () => {
      const mockCallback = jest.fn();
      const mockApp: AppDetail = {
        packageName: 'com.example.app',
        label: 'Test App',
        icon: 'https://systemIcon/icon',
      };
      installedApps.startListeningForAppInstallations(mockCallback);
      // Simulate app installation event
      const mock = mockDeviceEventEmitter.addListener.mock.calls[0];
      if (!mock?.length)
        throw new Error(
          'Expected DeviceEventEmitter.addListener to be called at least once'
        );
      const listener = mock[1];
      listener(JSON.stringify(mockApp));

      expect(mockDeviceEventEmitter.addListener).toHaveBeenCalledWith(
        'onAppInstalled',
        expect.any(Function)
      );
      expect(
        mockLauncherKit.startListeningForAppInstallations
      ).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockApp);
    });

    it('should stop listening for app installations', () => {
      installedApps.stopListeningForAppInstallations();

      expect(mockDeviceEventEmitter.removeAllListeners).toHaveBeenCalledWith(
        'onAppInstalled'
      );
      expect(
        mockLauncherKit.stopListeningForAppInstallations
      ).toHaveBeenCalled();
    });
  });

  describe('App removal listeners', () => {
    it('should start listening for app removals', () => {
      const mockCallback = jest.fn();
      const mockPackageName = 'com.example.app';
      installedApps.startListeningForAppRemovals(mockCallback);
      const mock = mockDeviceEventEmitter.addListener.mock.calls[0];
      if (!mock?.length)
        throw new Error(
          'Expected DeviceEventEmitter.startListeningForAppRemovals to be called at least once'
        );
      const listener = mock[1];
      listener(mockPackageName);
      expect(mockDeviceEventEmitter.addListener).toHaveBeenCalledWith(
        'onAppRemoved',
        expect.any(Function)
      );
      expect(mockLauncherKit.startListeningForAppRemovals).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(mockPackageName);
    });

    it('should stop listening for app removals', () => {
      installedApps.stopListeningForAppRemovals();

      expect(mockDeviceEventEmitter.removeAllListeners).toHaveBeenCalledWith(
        'onAppRemoved'
      );
      expect(mockLauncherKit.stopListeningForAppRemovals).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle null LauncherKit', async () => {
      const originalLauncherKit = NativeModules.LauncherKit;
      (NativeModules as any).LauncherKit = null;
      await expect(installedApps.getApps()).resolves.toEqual([]);
      (NativeModules as any).LauncherKit = originalLauncherKit;
    });

    it('should handle invalid JSON response', async () => {
      mockLauncherKit.getApps.mockResolvedValue('invalid json');
      const result = await installedApps.getApps();
      expect(result).toEqual([]);
    });
  });
});
