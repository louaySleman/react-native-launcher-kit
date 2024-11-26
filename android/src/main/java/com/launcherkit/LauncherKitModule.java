package com.launcherkit;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;

import android.app.ActivityOptions;
import android.content.ActivityNotFoundException;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.ApplicationInfo;
import android.content.Intent;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import javax.annotation.Nullable;

import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.Rect;
import android.graphics.Paint;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import com.facebook.react.bridge.Callback;
import android.provider.Settings;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import java.util.HashSet;
import java.util.Set;

import android.content.BroadcastReceiver;

import android.util.Log;

import android.graphics.drawable.AdaptiveIconDrawable;
import android.provider.AlarmClock;
import androidx.palette.graphics.Palette;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

@ReactModule(name = LauncherKitModule.NAME)
public class LauncherKitModule extends ReactContextBaseJavaModule {
  public static final String NAME = "LauncherKit";
  private final ReactApplicationContext reactContext;

  public LauncherKitModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  /**
   * Private class representing app details.
   * Contains properties such as app label, package name, and icon.
   */
  private class AppDetail {
    CharSequence label;
    CharSequence packageName;
    Drawable icon;
    String iconPath;
    String version;
    String accentColor;  // Store the accent color of the icon

    /**
     * Constructor
     *
     * @param ri                 ResolveInfo for the app
     * @param pManager           PackageManager instance
     * @param context            Context of the application
     * @param includeVersion     Flag to include version information
     * @param includeAccentColor Flag to include accent color calculation
     */
    public AppDetail(ResolveInfo ri, PackageManager pManager, Context context, boolean includeVersion, boolean includeAccentColor) {
      this.label = ri.loadLabel(pManager);
      this.packageName = ri.activityInfo.packageName;
      this.icon = ri.loadIcon(pManager);

      // Process the icon to a Bitmap
      Bitmap iconBitmap = drawableToBitmap(this.icon);
      if (iconBitmap != null) {
        this.iconPath = saveIconToFile(iconBitmap, this.packageName.toString(), context);
      }

      if (includeVersion) {
        try {
          PackageInfo packageInfo = pManager.getPackageInfo(this.packageName.toString(), 0);
          this.version = packageInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
          Log.e("AppUtils", "Package not found", e);
          this.version = "Unknown";
        }
      }

      if (includeAccentColor && iconBitmap != null) {
        this.accentColor = getAccentColor(iconBitmap);
      }
    }

    private Bitmap drawableToBitmap(Drawable drawable) {
      if (drawable instanceof BitmapDrawable) {
        return ((BitmapDrawable) drawable).getBitmap();
      } else {
        int width = Math.max(drawable.getIntrinsicWidth(), 1);
        int height = Math.max(drawable.getIntrinsicHeight(), 1);
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, width, height);
        drawable.draw(canvas);
        return bitmap;
      }
    }

    private String saveIconToFile(Bitmap iconBitmap, String fileName, Context context) {
      File cacheDir = new File(context.getCacheDir(), "icons");
      if (!cacheDir.exists() && !cacheDir.mkdirs()) {
        Log.e("AppUtils", "Failed to create directory for icons");
        return null;
      }
      File iconFile = new File(cacheDir, fileName + ".png");
      try (FileOutputStream fos = new FileOutputStream(iconFile)) {
        iconBitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
        fos.flush();
        return iconFile.getAbsolutePath();
      } catch (IOException e) {
        Log.e("AppUtils", "Error saving icon to file", e);
        return null;
      }
    }

    private String getAccentColor(Bitmap bitmap) {
      Palette p = Palette.from(bitmap)
        .maximumColorCount(100) // Try increasing the color count
        .generate();
      Palette.Swatch dominantSwatch = p.getDominantSwatch(); // You might also consider using a different swatch based on your needs
      if (dominantSwatch != null) {
        return String.format("#%06X", (0xFFFFFF & dominantSwatch.getRgb()));
      }
      return "#000000"; // Default fallback
    }

    @Override
    public String toString() {
      return "{\"label\":\"" + label +
        "\", \"packageName\":\"" + packageName +
        "\", \"icon\":\"file://" + iconPath +
        "\", \"version\":\"" + version +
        "\", \"accentColor\":\"" + accentColor + "\"}";
    }
  }

  /**
   * Retrieves a list of installed apps on the device with optional version and accent color.
   *
   * @param includeVersion     Whether to include version info in the app details.
   * @param includeAccentColor Whether to calculate and include the accent color of the app icon.
   * @param promise            Promise to handle asynchronous operation result.
   */
  @ReactMethod
  public void getApps(boolean includeVersion, boolean includeAccentColor, Promise promise) {
    new Thread(() -> {
      Set<String> addedPackages = new HashSet<>();
      List<AppDetail> apps = new ArrayList<>();
      PackageManager pManager = reactContext.getCurrentActivity().getPackageManager();

      Intent intent = new Intent(Intent.ACTION_MAIN, null);
      intent.addCategory(Intent.CATEGORY_LAUNCHER);
      List<ResolveInfo> allApps = pManager.queryIntentActivities(intent, 0);

      for (ResolveInfo ri : allApps) {
        String packageName = ri.activityInfo.packageName;
        if (!addedPackages.contains(packageName)) {
          AppDetail app = new AppDetail(ri, pManager, reactContext, includeVersion, includeAccentColor);
          apps.add(app);
          addedPackages.add(packageName);
        }
      }
      promise.resolve(apps.toString());
    }).start();
  }

  /*
   * Retrieves a list of all installed apps on the device.
   * Returns a list of package names.
   */
  private List<String> getAllApps() {
    List<PackageInfo> packages = this.reactContext
      .getPackageManager()
      .getInstalledPackages(0);

    List<String> ret = new ArrayList<>();
    for (final PackageInfo p : packages) {
      ret.add(p.packageName);
    }
    return ret;
  }

  /*
   * Retrieves a list of all installed apps on the device.
   * Returns a list of package names.
   */
  private List<String> getNonSystemApps() {
    List<PackageInfo> packages = this.reactContext
      .getPackageManager()
      .getInstalledPackages(0);

    List<String> ret = new ArrayList<>();
    for (final PackageInfo p : packages) {
      if ((p.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
        ret.add(p.packageName);
      }
    }
    return ret;
  }

  /*
   * Launches the specified application.
   */
  @ReactMethod
  private void launchApplication(String packageName, @Nullable ReadableMap params) {
    PackageManager packageManager = this.reactContext.getPackageManager();
    Intent launchIntent = null;

    try {
      if (params != null) {
        // Get the action if specified, otherwise use MAIN
        String action = params.hasKey("action")
          ? params.getString("action")
          : Intent.ACTION_MAIN;

        launchIntent = new Intent(action);
        launchIntent.setPackage(packageName);

        // Handle URI data if provided
        if (params.hasKey("data")) {
          String data = params.getString("data");
          if (data.startsWith("geo:")) {
            // Handle Google Maps
            launchIntent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(data));
            launchIntent.setPackage(packageName);
          } else if (data.startsWith("file://")) {
            // Handle file-based intents
            launchIntent.setDataAndType(
              android.net.Uri.parse(data),
              params.hasKey("type") ? params.getString("type") : "*/*"
            );
            launchIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
          } else if (data.startsWith("http://") || data.startsWith("https://")) {
            // Handle URLs
            launchIntent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(data));
            launchIntent.setPackage(packageName);
          } else {
            // Generic data handling
            launchIntent.setData(android.net.Uri.parse(data));
          }
        }

        // Handle extras if provided
        if (params.hasKey("extras")) {
          ReadableMap extras = params.getMap("extras");
          ReadableMapKeySetIterator iterator = extras.keySetIterator();
          while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            String value = extras.getString(key);
            launchIntent.putExtra(key, value);
          }
        }

        // Add category if specified
        if (params.hasKey("category")) {
          launchIntent.addCategory(params.getString("category"));
        }
      } else {
        // Fallback to default launch intent
        launchIntent = packageManager.getLaunchIntentForPackage(packageName);
      }

      if (launchIntent != null) {
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        int enterAnimRes = R.anim.slide_up;
        Bundle animBundle = ActivityOptions.makeCustomAnimation(this.reactContext, enterAnimRes, 0).toBundle();
        this.reactContext.startActivity(launchIntent, animBundle);
      } else {
        Log.e("ReactNative", "No launch intent available for package: " + packageName);
      }
    } catch (Exception e) {
      Log.e("ReactNative", "Error launching application: " + e.getMessage());
    }
  }

  /*
   * Checks if the specified package is installed on the device.
   * Invokes the callback with a boolean value indicating the result.
   */
  @ReactMethod
  public void isPackageInstalled(String packageName, Callback cb) {
    PackageManager pm = this.reactContext.getPackageManager();
    try {
      pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
      cb.invoke(true);
    } catch (Exception e) {
      cb.invoke(false);
    }
  }

  /*
   * Retrieves the package name of the default launcher app.
   * Resolves the promise with the package name.
   * Rejects the promise with an error message if the default launcher package name cannot be retrieved.
   */
  @ReactMethod
  public void getDefaultLauncherPackageName(Promise promise) {
    PackageManager pm = getReactApplicationContext().getPackageManager();

    // Get the intent that launches the home screen
    Intent intent = new Intent(Intent.ACTION_MAIN);
    intent.addCategory(Intent.CATEGORY_HOME);
    ResolveInfo resolveInfo = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);

    if (resolveInfo != null && resolveInfo.activityInfo != null) {
      // Get the package name of the default launcher
      String packageName = resolveInfo.activityInfo.packageName;

      // Resolve the promise with the package name
      promise.resolve(packageName);
    } else {
      // Reject the promise with an error message
      promise.reject("ERROR", "Unable to get default launcher package name.");
    }
  }

  /*
   * Starts the activity to set the app as the default launcher.
   */
  @ReactMethod
  public void setAsDefaultLauncher() {
    PackageManager localPackageManager = this.reactContext.getPackageManager();
    Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    this.reactContext.startActivity(intent);
  }

  /*
   * Retrieves package information for the current app.
   */
  private PackageInfo getPackageInfo() throws Exception {
    return getReactApplicationContext().getPackageManager().getPackageInfo(getReactApplicationContext().getPackageName(), 0);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  /*
   * Retrieves the battery status of the device.
   * Invokes the successCallback with the battery level and charging status.
   */
  @ReactMethod
  public void getBatteryStatus(Callback successCallback) {
    Intent batteryIntent = getCurrentActivity().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    int level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
    int scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
    int status = batteryIntent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
    boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
      status == BatteryManager.BATTERY_STATUS_FULL;
    if (level == -1 || scale == -1) {
      level = 0;
    }
    successCallback.invoke(((float) level / (float) scale) * 100.0f, isCharging);
  }

  /*
   * Opens the device settings.
   */
  @ReactMethod
  public void goToSettings() {
    Intent intent = new Intent(Settings.ACTION_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getReactApplicationContext().startActivity(intent);
  }

  /*
   * Opens the alarm app on the device, if available.
   */
  @ReactMethod
  public void openAlarmApp() {
    try {
      Intent intent = new Intent(AlarmClock.ACTION_SHOW_ALARMS);
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      if (intent.resolveActivity(reactContext.getPackageManager()) != null) {
        reactContext.startActivity(intent);
      } else {
        // Log or handle the case where no activity can handle the intent
        Log.e("LauncherKitModule", "No activity found to handle SHOW_ALARMS intent");
      }
    } catch (ActivityNotFoundException e) {
      Log.e("LauncherKitModule", "Alarm app not found", e);
    } catch (Exception e) {
      Log.e("LauncherKitModule", "Failed to open alarm app", e);
    }
  }

  /*
   * Opens set default launcher from settings on the device, if available.
   */
  @ReactMethod
  public void openSetDefaultLauncher(Promise promise) {
    try {
      Context context = getReactApplicationContext().getBaseContext();
      Intent intent = new Intent(Settings.ACTION_HOME_SETTINGS);
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
      context.startActivity(intent);
      promise.resolve(true);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  private BroadcastReceiver appInstallReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      // Background thread execution
      new Thread(new Runnable() {
        @Override
        public void run() {
          // Extract package name from intent
          String packageName = intent.getData().getSchemeSpecificPart();
          PackageManager pManager = context.getPackageManager();

          try {
            Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(packageName);
            if (launchIntent != null) {
              // Check if app has a launcher activity
              ResolveInfo resolveInfo = pManager.resolveActivity(launchIntent, 0);
              if (resolveInfo != null) {
                // Create AppDetail object
                AppDetail newApp = new AppDetail(resolveInfo, pManager, reactContext, true, true);
                // Send app details back to React Native
                ReactContext reactContext = getReactApplicationContext();
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onAppInstalled", newApp.toString());
              }
            }
          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      }).start();
    }
  };

  @ReactMethod
  public void startListeningForAppInstallations() {
    IntentFilter filter = new IntentFilter(Intent.ACTION_PACKAGE_ADDED);
    filter.addDataScheme("package");
    reactContext.registerReceiver(appInstallReceiver, filter);
  }

  @ReactMethod
  public void stopListeningForAppInstallations() {
    try {
      reactContext.unregisterReceiver(appInstallReceiver);
    } catch (IllegalArgumentException e) {
      // Handle case where the receiver is already unregistered
      e.printStackTrace();
    }
  }

  private BroadcastReceiver appRemovalReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      // Background thread execution
      new Thread(new Runnable() {
        @Override
        public void run() {
          // Extract package name from intent
          String packageName = intent.getData().getSchemeSpecificPart();

          // Send package name back to React Native
          ReactContext reactContext = getReactApplicationContext();
          reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onAppRemoved", packageName);
        }
      }).start();
    }
  };

  @ReactMethod
  public void startListeningForAppRemovals() {
    IntentFilter filter = new IntentFilter(Intent.ACTION_PACKAGE_REMOVED);
    filter.addDataScheme("package");
    reactContext.registerReceiver(appRemovalReceiver, filter);
  }

  @ReactMethod
  public void stopListeningForAppRemovals() {
    try {
      reactContext.unregisterReceiver(appRemovalReceiver);
    } catch (IllegalArgumentException e) {
      // Handle case where the receiver is already unregistered
      e.printStackTrace();
    }
  }
}
