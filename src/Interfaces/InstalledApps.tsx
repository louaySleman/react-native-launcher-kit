export interface AppDetail {
  label: string;
  packageName: string;
  icon: string;
}

export interface InstalledApps {
  getApps(): AppDetail[];
  getSortedApps(): AppDetail[];
}
