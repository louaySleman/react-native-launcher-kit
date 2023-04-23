package com.launcherkit;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

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
import android.os.Build;
import android.util.Base64;
import com.facebook.react.bridge.Callback;
import android.provider.Settings;

@ReactModule(name = LauncherKitModule.NAME)
public class LauncherKitModule extends ReactContextBaseJavaModule {
  public static final String NAME = "LauncherKit";
  private final ReactApplicationContext reactContext;

  public LauncherKitModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }


  private class DeviceDetails {
    CharSequence deviceId;
    CharSequence bundleId;
    CharSequence systemName;
    CharSequence systemVersion;
    CharSequence appVersion;
    CharSequence buildNumber;
    CharSequence appName;
    CharSequence brand;
    CharSequence model;
    public String toString() {
      return "{\"deviceId\":\"" + this.deviceId + "\",\"bundleId\":\"" + this.bundleId + "\",\"systemName\":\"" + this.systemName + "\",\"systemVersion\":\"" + this.systemVersion + "\",\"appVersion\":\"" + this.appVersion + "\",\"buildNumber\":\"" + this.buildNumber + "\",\"appName\":\"" + this.appName + "\",\"brand\":\"" + this.brand + "\",\"model\":\"" + this.model + "\"}";
    }
  }

  private class AppDetail {
    CharSequence label;
    CharSequence packageName;
    Drawable icon;
    public String toString() {
      Bitmap icon;
      if(this.icon.getIntrinsicWidth() <= 0 || this.icon.getIntrinsicHeight() <= 0) {
        icon = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888); // Single color bitmap will be created of 1x1 pixel
      } else {
        icon = Bitmap.createBitmap(this.icon.getIntrinsicWidth(), this.icon.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
      }
      final Canvas canvas = new Canvas(icon);
      this.icon.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
      this.icon.draw(canvas);

      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      icon.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
      byte[] byteArray = byteArrayOutputStream.toByteArray();
      String encoded = Base64.encodeToString(byteArray, Base64.NO_WRAP);

      return "{\"label\":\"" + this.label + "\",\"packageName\":\"" + this.packageName + "\",\"icon\":\"" + encoded + "\"}";
    }
  }

  @ReactMethod
  private String getApps(){
    List<AppDetail> apps = new ArrayList<>();
    PackageManager pManager = this.reactContext.getPackageManager();

    Intent i = new Intent(Intent.ACTION_MAIN, null);
    i.addCategory(Intent.CATEGORY_LAUNCHER);
    List<ResolveInfo> allApps = pManager.queryIntentActivities(i, 0);
    for (ResolveInfo ri : allApps) {
      AppDetail app = new AppDetail();
      app.label = ri.loadLabel(pManager);
      app.packageName = ri.activityInfo.packageName;
      app.icon = ri.activityInfo.loadIcon(this.reactContext.getPackageManager());
      apps.add(app);

    }
    return apps.toString();

  }

  private List<String> getAllApps() {
    List<PackageInfo> packages = this.reactContext
      .getPackageManager()
      .getInstalledPackages(0);

    List<String> ret = new ArrayList<>();
    for (final PackageInfo p: packages) {
      ret.add(p.packageName);
    }
    return ret;
  }

  private List<String> getNonSystemApps() {
    List<PackageInfo> packages = this.reactContext
      .getPackageManager()
      .getInstalledPackages(0);

    List<String> ret = new ArrayList<>();
    for (final PackageInfo p: packages) {
      if ((p.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
        ret.add(p.packageName);
      }
    }
    return ret;
  }

  @ReactMethod
  private void launchApplication(String packageName){
    Intent launchIntent = this.reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
    if (launchIntent != null) {
      this.reactContext.startActivity(launchIntent);//null pointer check in case package name was not found
    }
  }

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

  @ReactMethod
  public void setAsDefaultLauncher() {
    PackageManager localPackageManager = this.reactContext.getPackageManager();
    Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    this.reactContext.startActivity(intent);
  }

  private PackageInfo getPackageInfo() throws Exception {
    return getReactApplicationContext().getPackageManager().getPackageInfo(getReactApplicationContext().getPackageName(), 0);
  }

  @Override
  public @Nullable Map<String, Object> getConstants() {
    Map<String, Object> constants = new HashMap<>();
    String appVersion, buildNumber, appName;

    try {
      appVersion = getPackageInfo().versionName;
      buildNumber = Integer.toString(getPackageInfo().versionCode);
      appName = getReactApplicationContext().getApplicationInfo().loadLabel(getReactApplicationContext().getPackageManager()).toString();
    } catch (Exception e) {
      appVersion = "unknown";
      buildNumber = "unknown";
      appName = "unknown";
    }
    constants.put("getApps", getApps());
    constants.put("getNonSystemApps", getNonSystemApps());
    DeviceDetails device = new DeviceDetails();
    device.appName = appName;
    device.appVersion = appVersion;
    device.deviceId =  Build.BOARD;
    device.bundleId = getReactApplicationContext().getPackageName();
    device.systemName = "Android";
    device.systemVersion = Build.VERSION.RELEASE;
    device.buildNumber = buildNumber;
    device.brand = Build.BRAND;
    device.model = Build.MODEL;
    constants.put("DeviceDetails", device.toString());
    return constants;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  @ReactMethod
  public void getBatteryStatus(Callback successCallback) {
    Intent batteryIntent = getCurrentActivity().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    int level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
    int scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
    int status = batteryIntent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
    boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
      status == BatteryManager.BATTERY_STATUS_FULL;
    if(level == -1 || scale == -1) {
      level = 0;
    }
    successCallback.invoke(((float)level / (float)scale) * 100.0f, isCharging);
  }

  @ReactMethod
  public void goToSettings()
  {
    Intent intent = new Intent(Settings.ACTION_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getReactApplicationContext().startActivity(intent);
  }

  @ReactMethod
  public void openAlarmApp() {
    try {
      Intent intent = new Intent("android.intent.action.SHOW_ALARMS");
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      this.reactContext.startActivity(intent);
    } catch (ActivityNotFoundException ignore) {

    }
  }

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
}
