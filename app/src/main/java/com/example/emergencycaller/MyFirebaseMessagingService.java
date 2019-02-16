package com.example.emergencycaller;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import android.content.Context;
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
  }

  private void sendRegistrationToServer(String token) {
    // TODO
  }

  public static String getToken(Context context) {
    return context.getSharedPreferences(SHARED_PREF_NAME, MODE_PRIVATE).getString("fbm_token",
            null);
  }
}
