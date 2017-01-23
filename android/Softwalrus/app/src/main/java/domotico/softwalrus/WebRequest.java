package domotico.softwalrus;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.HttpURLConnection;
import java.io.InputStream;



/**
 * Created by tom_2 on 2017-01-21.
 */

public class WebRequest extends AsyncTask <String, String, String>{

    String responseString;

    protected String doInBackground(String... query) {

        URL url;
        HttpURLConnection urlConnection = null;

        try{
            url = new URL("http://192.168.0.60:8888");

            urlConnection = (HttpURLConnection) url.openConnection();

            int responseCode = urlConnection.getResponseCode();

            if(responseCode == HttpURLConnection.HTTP_OK){
                Log.i("status","ok");
                responseString = readStream(urlConnection.getInputStream());
                Log.v("CatalogClient", responseString);
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }

        return responseString;
    }

    @Override
    protected void onPostExecute(String s) {
        super.onPostExecute(s);

        Log.e("Response", "" + responseString);
    }


    // Converting InputStream to String

    private String readStream(InputStream in) {
        BufferedReader reader = null;
        StringBuffer response = new StringBuffer();
        try {
            reader = new BufferedReader(new InputStreamReader(in));
            String line = "";
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return response.toString();
    }

}


