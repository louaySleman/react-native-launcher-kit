import installedApps from '../InstalledApps';

describe('installedApps object', () => {
  test('getApps() returns an array', () => {
    const apps = installedApps.getApps();
    expect(Array.isArray(apps)).toBe(true);
  });

  test('getSortedApps() returns an array sorted alphabetically', () => {
    const sortedApps = installedApps.getSortedApps();
    expect(Array.isArray(sortedApps)).toBe(true);
  });
});
