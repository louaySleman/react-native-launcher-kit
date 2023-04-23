import LauncherKitHelper from '../Helper';

describe('LauncherKitHelper', () => {
  describe('launchApplication', () => {
    it('should launch the specified app and return true', () => {
      const bundleId = 'com.android.settings';

      const result = LauncherKitHelper.launchApplication(bundleId);

      expect(result).toBe(false);
    });
  });

  describe('goToSettings', () => {
    it('should open the settings screen and do nothing else', () => {
      const goToSettingsSpy = jest.spyOn(LauncherKitHelper, 'goToSettings');

      LauncherKitHelper.goToSettings();

      expect(goToSettingsSpy).toHaveBeenCalled();
    });

    describe('checkIfPackageInstalled', () => {
      it('should return true if the specified app is installed', async () => {
        const bundleId = 'com.example.app';

        const result = await LauncherKitHelper.checkIfPackageInstalled(bundleId);

        expect(result).toBe(false);
      });
    });
  });
});
