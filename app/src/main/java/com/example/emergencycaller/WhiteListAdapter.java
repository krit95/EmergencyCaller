package com.example.emergencycaller;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

class WhiteListAdapter extends ArrayAdapter<Contact> {

    private Context cContext;
    private List<Contact> contactList= new ArrayList<>();
    private OnItemClickListener onItemClickListener;

    public WhiteListAdapter(Context context, ArrayList<Contact> contactArrayList) {
        super(context, 0, contactArrayList);
        cContext = context;
        contactList = contactArrayList;
    }

    public View getView(final int position, @Nullable View convertView, @NonNull ViewGroup parent){
        View listItem = convertView;
        if (listItem == null) {
            listItem = LayoutInflater.from(cContext).inflate(R.layout.whitelistitem, parent, false);
        }

        Contact currentContact = contactList.get(position);

        RelativeLayout contactDetailsLayout =
                (RelativeLayout) listItem.findViewById(R.id.contact_details);

        TextView name = (TextView) contactDetailsLayout.findViewById(R.id.cName);
        name.setText(currentContact.getName());

        TextView number = (TextView) contactDetailsLayout.findViewById(R.id.phNo);
        number.setText(currentContact.getPhoneNumber());

        ImageButton delbtn = (ImageButton) listItem.findViewById(R.id.delete_btn);

        delbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onItemClickListener.onItemClicked(v, position);
            }
        });

        return listItem;
    }

    public interface OnItemClickListener {
        void onItemClicked(View v, int position);
    }

    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.onItemClickListener = onItemClickListener;
    }

}
