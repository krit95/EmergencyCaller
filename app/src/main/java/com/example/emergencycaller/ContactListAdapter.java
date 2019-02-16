package com.example.emergencycaller;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

class ContactListAdapter extends ArrayAdapter<Contact> {

    private Context cContext;
    private List<Contact> contactList= new ArrayList<>();

    public ContactListAdapter(Context context, ArrayList<Contact> contactArrayList) {
        super(context, 0, contactArrayList);
        cContext = context;
        contactList = contactArrayList;
    }

    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent){
        View listItem = convertView;
        if (listItem == null)
            listItem = LayoutInflater.from(cContext).inflate(R.layout.custom_layout, parent, false);

        Contact currentContact = contactList.get(position);

        TextView name = (TextView) listItem.findViewById(R.id.cName);
        name.setText(currentContact.getName());

        TextView number = (TextView) listItem.findViewById(R.id.phNo);
        number.setText(currentContact.getPhoneNumber());

        if(currentContact.isWhitelisted()){
            ImageButton emerButton = (ImageButton) listItem.findViewById(R.id.emergency_call);
            emerButton.setVisibility(View.VISIBLE);
        }

        return listItem;
    }

}
