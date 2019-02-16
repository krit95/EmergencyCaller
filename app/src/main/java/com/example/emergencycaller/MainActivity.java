package com.example.emergencycaller;

import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Context;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

  private static String TAG = "MainActivity";
  private TextView textView;
  private Context mContext;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mContext = getApplicationContext();
    setContentView(R.layout.activity_main);
    Toolbar toolbar = findViewById(R.id.toolbar);
    setSupportActionBar(toolbar);

    FloatingActionButton fab = findViewById(R.id.fab);
    fab.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        Snackbar.make(view, "Add new contact to whitelist", Snackbar.LENGTH_LONG)
                .setAction("Action", null).show();
      }
    });
    textView = findViewById(R.id.text1);
    if (!areAllPermissionsAvailable(mContext)) {
      requestAllPermissions(this, mContext);
    }
    if(areAllPermissionsAvailable(mContext)) {
      fetchWhitelist();
      fetchContacts();
    }
  }

  private void fetchWhitelist() {
    // TODO
  }

  public void fetchContacts() {

    String phoneNumber = null;
    String email = null;

    Uri CONTENT_URI = ContactsContract.Contacts.CONTENT_URI;
    String _ID = ContactsContract.Contacts._ID;
    String DISPLAY_NAME = ContactsContract.Contacts.DISPLAY_NAME;
    String HAS_PHONE_NUMBER = ContactsContract.Contacts.HAS_PHONE_NUMBER;

    Uri PhoneCONTENT_URI = ContactsContract.CommonDataKinds.Phone.CONTENT_URI;
    String Phone_CONTACT_ID = ContactsContract.CommonDataKinds.Phone.CONTACT_ID;
    String NUMBER = ContactsContract.CommonDataKinds.Phone.NUMBER;

    Uri EmailCONTENT_URI =  ContactsContract.CommonDataKinds.Email.CONTENT_URI;
    String EmailCONTACT_ID = ContactsContract.CommonDataKinds.Email.CONTACT_ID;
    String DATA = ContactsContract.CommonDataKinds.Email.DATA;

    StringBuffer output = new StringBuffer();

    ContentResolver contentResolver = getContentResolver();

    Cursor cursor = contentResolver.query(CONTENT_URI, null,null, null, null);

    // Loop for every contact in the phone
    if (cursor.getCount() > 0) {

      while (cursor.moveToNext()) {

        String contact_id = cursor.getString(cursor.getColumnIndex( _ID ));
        String name = cursor.getString(cursor.getColumnIndex( DISPLAY_NAME ));

        int hasPhoneNumber = Integer.parseInt(cursor.getString(cursor.getColumnIndex( HAS_PHONE_NUMBER )));

        if (hasPhoneNumber > 0) {

          output.append("\n First Name:" + name);

          // Query and loop for every phone number of the contact
          Cursor phoneCursor = contentResolver.query(PhoneCONTENT_URI, null, Phone_CONTACT_ID + " = ?", new String[] { contact_id }, null);

          while (phoneCursor.moveToNext()) {
            phoneNumber = phoneCursor.getString(phoneCursor.getColumnIndex(NUMBER));
            output.append("\n Phone number:" + phoneNumber);

          }

          phoneCursor.close();

          // Query and loop for every email of the contact
          Cursor emailCursor = contentResolver.query(EmailCONTENT_URI,    null, EmailCONTACT_ID+ " = ?", new String[] { contact_id }, null);

          while (emailCursor.moveToNext()) {

            email = emailCursor.getString(emailCursor.getColumnIndex(DATA));

            output.append("\nEmail:" + email);

          }

          emailCursor.close();
        }

        output.append("\n");
      }

      textView.setText(output);
    }
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.menu_main, menu);
    return true;
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, so long
    // as you specify a parent activity in AndroidManifest.xml.
    int id = item.getItemId();

    //noinspection SimplifiableIfStatement
    if (id == R.id.action_settings) {
      return true;
    }

    return super.onOptionsItemSelected(item);
  }

  @Override
  public void onRequestPermissionsResult(int requestCode,
                                         String permissions[], int[] grantResults) {
    for (int i = 0; i < permissions.length; i++) {
      if (grantResults[i] == PackageManager.PERMISSION_DENIED) {
        Toast.makeText(mContext, "All necessary permissions not granted", Toast.LENGTH_LONG).show();
        finish();
      }
    }
  }

  public static boolean areAllPermissionsAvailable(Context mContext) {
    Log.i(TAG, "Inside areAllPermissionsAvailable");
    List<String> permissionGroups = getAllDangerousPermissions();

    for(String permissionGroup : permissionGroups) {
      if (!isPermissionGroupGranted(permissionGroup, mContext)) {
        return false;
      }
    }
    //Check if app usage stats permission is granted, otherwise request.

    return true;
  }

  private static List<String> getAllDangerousPermissions() {
    Log.i(TAG, "Inside getAllDangerousPermissions");
    List<String> permissions = new ArrayList<>();
    permissions.add(Manifest.permission.READ_PHONE_STATE);
    permissions.add(Manifest.permission.READ_CONTACTS);
    return permissions;
  }

  private static boolean isPermissionGroupGranted(String permission, Context mContext) {
    Log.i(TAG, "Inside isPermissionGroupGranted for permission - " + permission);
    return PackageManager.PERMISSION_GRANTED == ContextCompat.checkSelfPermission(mContext,
            permission);
  }

  public static void requestAllPermissions(Activity mActivity, Context mContext) {
    Log.i(TAG, "Inside requestAllPermissions");
    List<String> allDangerousPermissions = getAllDangerousPermissions();
    List<String> dangerousPermissionsToRequest = new ArrayList<>();
    for(String permissionGroup: allDangerousPermissions) {
      if (!isPermissionGroupGranted(permissionGroup, mContext)) {
        dangerousPermissionsToRequest.add(permissionGroup);
      }
    }

    if (dangerousPermissionsToRequest.size() == 0) {
      return;
    }

    Log.i(TAG, "Requesting Permissions");
    ActivityCompat.requestPermissions(mActivity,
            dangerousPermissionsToRequest.toArray(new String[0]),
            1);
  }


}
