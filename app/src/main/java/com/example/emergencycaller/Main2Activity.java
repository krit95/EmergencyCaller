package com.example.emergencycaller;

import android.content.Context;
import android.os.AsyncTask;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import static com.example.emergencycaller.MainActivity.POST_STRING;

public class Main2Activity extends AppCompatActivity implements WhiteListAdapter.OnItemClickListener {

    private Context mContext;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = getApplicationContext();
        setContentView(R.layout.activity_main);

        MovableFloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Add new contact to whitelist", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });


    }

    private void fetchIHaveWhitelisted() {
        updateCurrentToken();
    }

        @Override
        public void onItemClicked (View v,int position){

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
                        BufferedReader in=new BufferedReader(
                                new InputStreamReader(
                                        urlConnection.getInputStream()));
                        StringBuffer sb = new StringBuffer();
                        String line;
                        while((line = in.readLine()) != null) {
                            sb.append(line);
                        }
                        in.close();
                        Log.d(TAG, "HTTP response: " + sb.toString());
                        JSONObject resp = new JSONObject(sb.toString());
                        switch(this.requestCode){
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
        }

    private void updateCurrentToken() {
        FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener( this,  new OnSuccessListener<InstanceIdResult>() {
            @Override
            public void onSuccess(InstanceIdResult instanceIdResult) {
                currentToken = instanceIdResult.getToken();
                Log.d("currentToken", currentToken);
                sendRegistrationToServer(currentToken);
            }
        });
    }
}