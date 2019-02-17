package com.example.emergencycaller;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import android.content.Context;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.os.CountDownTimer;
import android.support.annotation.NonNull;
import android.util.Log;

import static com.example.emergencycaller.MainActivity.SHARED_PREF_NAME;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

  private String TAG = "MyFirebaseMessagingService";

  @Override
  public void onNewToken(String token) {
    super.onNewToken(token);
    Log.d(TAG, "Refreshed token: " + token);
    getSharedPreferences(SHARED_PREF_NAME, MODE_PRIVATE).edit().putString("fbm_token", token).apply();
    // If you want to send messages to this application instance or
    // manage this apps subscriptions on the server side, send the
    // Instance ID token to your app server.
    sendRegistrationToServer(token);
  }

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    super.onMessageReceived(remoteMessage);

    Log.d(TAG, String.valueOf("remote message: " + remoteMessage.getData()));
    try {
      long time_till = Long.parseLong(remoteMessage.getData().get("time"));
      if (time_till >= System.currentTimeMillis()) {
        AudioManager audioManager = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREF_NAME, MODE_PRIVATE);
        SharedPreferences.Editor sharedPrefsEditor = sharedPreferences.edit();
        sharedPrefsEditor.putInt("ringer_mode", audioManager.getRingerMode());
        sharedPrefsEditor.putString("from", remoteMessage.getData().get("fromPhoneNo"));
        sharedPrefsEditor.putLong("till", time_till);
        sharedPrefsEditor.apply();
        audioManager.adjustVolume(AudioManager.ADJUST_UNMUTE, AudioManager.FLAG_ALLOW_RINGER_MODES);
        audioManager.setStreamVolume(AudioManager.STREAM_RING,
                audioManager.getStreamMaxVolume(AudioManager.STREAM_RING), 0);
        audioManager.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
        Log.d(TAG, "Set to max");
//        new CountDownTimer(60 * 1000, 10 * 1000) {
//
//          @Override
//          public void onTick(long millisUntilFinished) {
//
//          }
//
//          @Override
//          public void onFinish() {
//            AudioManager audioManager = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
//            audioManager.setRingerMode(getApplicationContext().getSharedPreferences(SHARED_PREF_NAME, MODE_PRIVATE).getInt("ringer_mode",
//                    AudioManager.RINGER_MODE_VIBRATE));
//            Log.d(TAG, "reset");
//          }
//        };
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void sendRegistrationToServer(String token) {
    // TODO
  }

  public static String getToken(Context context) {
    return context.getSharedPreferences(SHARED_PREF_NAME, MODE_PRIVATE).getString("fbm_token",
            null);
  }
}
