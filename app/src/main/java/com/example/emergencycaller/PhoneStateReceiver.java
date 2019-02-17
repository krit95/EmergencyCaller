package com.example.emergencycaller;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.telephony.TelephonyManager;
import android.util.Log;

import static com.example.emergencycaller.MainActivity.SHARED_PREF_NAME;

public class PhoneStateReceiver extends BroadcastReceiver {
  private String TAG = "RECEIVER";

  @Override
  public void onReceive(Context context, Intent intent) {
    Log.d(TAG, intent.getAction());

    String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
    String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
    SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREF_NAME,
            Context.MODE_PRIVATE);
    if(state.equals(TelephonyManager.EXTRA_STATE_RINGING)){
      Log.d(TAG, "Ringing State Number is - " + incomingNumber);
//      if(!incomingNumber.contains(sharedPreferences.getString("from", "1"))) {
//        AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
//        audioManager.setRingerMode(sharedPreferences.getInt("ringer_mode",
//                AudioManager.RINGER_MODE_VIBRATE));
//        Log.d(TAG, "reset");
//      }
    }

  }
}
