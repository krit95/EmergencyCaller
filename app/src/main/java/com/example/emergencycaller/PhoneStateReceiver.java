package com.example.emergencycaller;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.telephony.TelephonyManager;
import android.util.Log;

public class PhoneStateReceiver extends BroadcastReceiver {
  private String TAG = "RECEIVER";

  @Override
  public void onReceive(Context context, Intent intent) {
    // TODO: Get current profile to restore after call

    Log.d(TAG, intent.getAction());
    AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    audioManager.adjustVolume(AudioManager.ADJUST_UNMUTE, AudioManager.FLAG_ALLOW_RINGER_MODES);
    audioManager.setStreamVolume(AudioManager.STREAM_RING,
            audioManager.getStreamMaxVolume(AudioManager.STREAM_RING), 0);
    audioManager.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
    Log.d(TAG, "UP");

    String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
    String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
    if(state.equals(TelephonyManager.EXTRA_STATE_RINGING)){
      Log.d(TAG, "Ringing State Number is - " + incomingNumber);
    }

  }
}
