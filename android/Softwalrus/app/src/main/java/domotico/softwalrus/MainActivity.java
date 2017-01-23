package domotico.softwalrus;

import android.content.Intent;
import android.speech.RecognizerIntent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Locale;
import android.content.ActivityNotFoundException;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity  {

    private final int SPEECH_RESULT = 1;
    private TextView Text;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Text = (TextView) findViewById(R.id.textViewSpeech);
        Button btnRecord = (Button) findViewById(R.id.btnRecord);

        btnRecord.setOnClickListener(btnRecordListener);
    }

    private View.OnClickListener btnRecordListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {

            //SpeechInput();
            String query ="";

            try {
                query = URLEncoder.encode("Sarah, il est qu'elle heure", "utf-8");
                WebRequest wr = new WebRequest();
                wr.execute(query);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };

    private void SpeechInput(){
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);

        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, Locale.getDefault());

        try {
            startActivityForResult(intent, SPEECH_RESULT);
            Text.setText("");
        } catch (ActivityNotFoundException a) {
            Toast.makeText(getApplicationContext(),
                    "DEVICE NOT SUPPORTED !",
                    Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case SPEECH_RESULT: {
                if (resultCode == RESULT_OK && null != data) {
                    ArrayList<String> text = data
                            .getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    Text.setText(text.get(0));
                    String query ="";

                    try{

                        query = URLEncoder.encode(text.get(0), "utf-8");

                    }catch (Exception e) {
                        e.printStackTrace();
                    }

                    WebRequest wr = new WebRequest();
                    wr.execute(query);
                }
                break;
            }
        }
    }
}
