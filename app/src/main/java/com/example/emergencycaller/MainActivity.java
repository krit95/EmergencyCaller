package com.example.emergencycaller;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.provider.ContactsContract;
import android.support.annotation.NonNull;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity implements ContactListAdapter.OnItemClickListener, ContactListAdapter.OnCallClickListener {

  public static String SHARED_PREF_NAME = "MY_APP";

  private static String TAG = "MainActivity";
  public static ArrayList<Contact> contactArrayList;
  private Context mContext;
  public static String currentToken = null;

  public static String GET_STRING = "GET",
          POST_STRING = "POST",
          PATCH_STRING = "PATCH",
          DELETE_STRING = "DELETE";

  public static final String hostUrl =
//          "https://rgenterprises-204606.appspot.com",
          "http://10.0.5.66:3710",
          fetchWhitelistUrl = "whitelist",
          sendRegTokenUrl = "whitelist/createDevice",
          makeEmergencyCallUrl = "whitelist/callingTrigger";
  public static int apiPort = 3600;
  public static final int fetchWhitelistCode = 101,
          sendRegTokenCode = 102,
          makeEmergencyCallCode = 103;
  private ListView contactsListView;
  private ContactListAdapter contactListAdapter;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mContext = getApplicationContext();
    setContentView(R.layout.activity_main);
    Toolbar toolbar = findViewById(R.id.toolbar);
    setSupportActionBar(toolbar);

    if (!areAllPermissionsAvailable(mContext)) {
      requestAllPermissions(this, mContext);
    }
    if (areAllPermissionsAvailable(mContext)) {
      updateCurrentToken();
      fetchContacts();
      Log.d(TAG, "My phone number: " + getDevicePhoneNumber(mContext));
      contactsListView = (ListView) findViewById(R.id.contact_list);
      contactListAdapter = new ContactListAdapter(this, contactArrayList);
      contactsListView.setAdapter(contactListAdapter);
      contactListAdapter.setOnItemClickListener(this);
      contactListAdapter.setOnCallClickListener(this);
      new HttpAsyncTask(null, fetchWhitelistCode, GET_STRING).execute(hostUrl + "/" + fetchWhitelistUrl + "/" + getDevicePhoneNumber(mContext));
    }
  }

  @SuppressLint("MissingPermission")
  public static String getDevicePhoneNumber(Context context) {
    String number = context.getSharedPreferences(SHARED_PREF_NAME, MODE_PRIVATE).getString(
            "phone_number",
            null);
    if (number == null) {
      TelephonyManager tMgr = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
      number = tMgr.getLine1Number();
      context.getSharedPreferences(SHARED_PREF_NAME, MODE_PRIVATE).edit().putString("phone_number",
              number).apply();
    }
    return number;
  }

  @Override
  public void onItemClicked(View v, int position) {
    final Contact selectedContact = (Contact) contactArrayList.get(position);
    Log.d(TAG, "Contact selected: " + selectedContact.getName());
    if(selectedContact.isWhitelisted()) {
      HashMap<String, String> postData = new HashMap<>();
      postData.put("phoneNo", getDevicePhoneNumber(getApplicationContext()));
      postData.put("token", currentToken);
      postData.put("toPhoneNo", selectedContact.getPhoneNumber());
      postData.put("time", (System.currentTimeMillis() + 60 * 1000) + "");
      new HttpAsyncTask(postData, makeEmergencyCallCode, POST_STRING).execute(hostUrl + "/" + makeEmergencyCallUrl);
      Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:" + selectedContact.getPhoneNumber()));
      startActivity(intent);
//      new CountDownTimer(3000, 1000) {
//        @Override
//        public void onTick(long millisUntilFinished) {
//
//        }
//
//        @Override
//        public void onFinish() {
//
//        }
//      };
    }
  }

  @Override
  public void onCallClicked(View v, int position) {
    Contact selectedContact = (Contact) contactArrayList.get(position);
    Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:" + selectedContact.getPhoneNumber()));
    startActivity(intent);
  }

  private class HttpAsyncTask extends AsyncTask<String, Void, String> {
    // This is the JSON body of the post
    JSONObject postData;
    int requestCode;
    String method;
    //        // This is a constructor that allows you to pass in the JSON body
    public HttpAsyncTask(Map<String, String> postData, int requestCode, String method) {
      Log.d(TAG, "inside HttpsPostAsyncTask");
      this.requestCode = requestCode;
      this.method = method;
      if (this.method.equals(POST_STRING) && postData != null) {
        this.postData = new JSONObject(postData);
      }
    }

    // This is a function that we are overriding from AsyncTask. It takes Strings as parameters because that is what we defined for the parameters of our async task
    @Override
    protected String doInBackground(String... params) {
      try {
        // This is getting the url from the string we passed in
        URL url = new URL(params[0]);
        Log.d(TAG, "URL: " + url.toString() + ", method: " + this.method);

        // Create the urlConnection
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
        urlConnection.setDoInput(true);
        if(!this.method.equals(GET_STRING)) urlConnection.setDoOutput(true);
        urlConnection.setRequestProperty("Content-Type", "application/json");
        urlConnection.setRequestProperty("X-Environment", "android");
        urlConnection.setRequestMethod(this.method);
        // OPTIONAL - Sets an authorization header
//                urlConnection.setRequestProperty("Authorization", "someAuthString");

//                // Send the post body
        Log.d(TAG, "Request method: " + urlConnection.getRequestMethod());

        if (!this.method.equals(GET_STRING) && this.postData != null) {
          OutputStreamWriter writer = new OutputStreamWriter(urlConnection.getOutputStream());
          writer.write(postData.toString());
          writer.flush();
        }

        int statusCode = urlConnection.getResponseCode();

        if (statusCode ==  HttpURLConnection.HTTP_OK) {
          BufferedReader in = new BufferedReader(
                  new InputStreamReader(
                          urlConnection.getInputStream()));
          StringBuilder sb = new StringBuilder();
          String line;
          while((line = in.readLine()) != null) {
            sb.append(line);
          }
          in.close();
          Log.d(TAG, "HTTP response: " + sb.toString());
          JSONObject resp = new JSONObject(sb.toString());
          switch (this.requestCode) {
            case fetchWhitelistCode:
              updateContactList(resp);
              break;
            default:
              Log.d(TAG, "Unknown request code");
          }
          // From here you can convert the string to JSON with whatever JSON parser you like to use
          // After converting the string to JSON, I call my custom callback. You can follow this process too, or you can implement the onPostExecute(Result) method
        } else {
          Log.d(TAG, "Error. Response code: " + statusCode);
          BufferedReader in = new BufferedReader(
                  new InputStreamReader(
                          urlConnection.getInputStream()));
          StringBuilder sb = new StringBuilder();
          String line;
          while((line = in.readLine()) != null) {
            sb.append(line);
          }
          in.close();
          Log.d(TAG, "HTTP response: " + sb.toString());
          Toast.makeText(MainActivity.this, "Some error occurred. Try again in some time.",
                  Toast.LENGTH_LONG).show();
          // Status code is not 200
          // Do something to handle the error
        }
      } catch (Exception e) {
        Log.d(TAG, e.getLocalizedMessage());
      }
      return null;
    }
  }

  private void updateContactList(final JSONObject response) {
    runOnUiThread(new Thread(new Runnable() {
      @Override
      public void run() {
        Log.d(TAG, "resp:" + response.toString());
        try {
          JSONArray jsonArray = response.getJSONArray("whitelist");
          for(int i=0;i<jsonArray.length();i++) {
            String otherPhoneNumber = (String) jsonArray.get(i);
//            Log.d(TAG, "Other whitelist ph no:" + otherPhoneNumber);
            for(Contact contact: contactArrayList) {
              if(contact.getPhoneNumber().contains(otherPhoneNumber)) {
                Log.d(TAG, "Whitelisted: " + contact.getName());
                contact.setWhitelisted(true);
              }
            }
          }
          contactListAdapter.notifyDataSetChanged();
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    }));
  }

  private void updateCurrentToken() {
    FirebaseInstanceId.getInstance().getInstanceId()
        .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
          @Override
          public void onComplete(@NonNull Task<InstanceIdResult> task) {
            if (!task.isSuccessful()) {
              Log.w(TAG, "getInstanceId failed", task.getException());
              return;
            }
            currentToken = task.getResult().getToken();
            Log.d("currentToken", currentToken);
            sendRegistrationToServer(getApplicationContext(), currentToken);
          }
        });
  }

  public void sendRegistrationToServer(Context context, String newToken) {
    HashMap<String, String> postData = new HashMap<>();
    postData.put("phoneNo", getDevicePhoneNumber(context));
    postData.put("token", newToken);
    new HttpAsyncTask(postData, sendRegTokenCode, POST_STRING).execute(hostUrl + "/" + sendRegTokenUrl);
  }

  public void fetchContacts() {
    contactArrayList = new ArrayList<>();
    String phoneNumber = null;

    Uri CONTENT_URI = ContactsContract.Contacts.CONTENT_URI;
    String _ID = ContactsContract.Contacts._ID;
    String DISPLAY_NAME = ContactsContract.Contacts.DISPLAY_NAME;
    String HAS_PHONE_NUMBER = ContactsContract.Contacts.HAS_PHONE_NUMBER;

    Uri PhoneCONTENT_URI = ContactsContract.CommonDataKinds.Phone.CONTENT_URI;
    String Phone_CONTACT_ID = ContactsContract.CommonDataKinds.Phone.CONTACT_ID;
    String NUMBER = ContactsContract.CommonDataKinds.Phone.NUMBER;
    ContentResolver contentResolver = getContentResolver();

    Cursor cursor = contentResolver.query(CONTENT_URI, null,null, null, null);

    // Loop for every contact in the phone
    if (cursor.getCount() > 0) {

      while (cursor.moveToNext()) {

        String contact_id = cursor.getString(cursor.getColumnIndex( _ID ));
        String name = cursor.getString(cursor.getColumnIndex( DISPLAY_NAME ));

        int hasPhoneNumber = Integer.parseInt(cursor.getString(cursor.getColumnIndex( HAS_PHONE_NUMBER )));

        if (hasPhoneNumber > 0) {

          // Query and loop for every phone number of the contact
          Cursor phoneCursor = contentResolver.query(PhoneCONTENT_URI, null, Phone_CONTACT_ID + " = ?", new String[] { contact_id }, null);

          if (phoneCursor.moveToNext()) {
            phoneNumber = phoneCursor.getString(phoneCursor.getColumnIndex(NUMBER));
            contactArrayList.add(new Contact(name, phoneNumber, false));

          }
          phoneCursor.close();
        }
      }
    }
    contactArrayList.sort(new Comparator<Contact>() {
      @Override
      public int compare(Contact o1, Contact o2) {
        return o1.getName().compareTo(o2.getName());
      }
    });
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
      startActivity(new Intent(this, Main2Activity.class));
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
    permissions.add(Manifest.permission.CALL_PHONE);
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
