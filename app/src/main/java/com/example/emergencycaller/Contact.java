package com.example.emergencycaller;

public class Contact {

  private String name;
  private String phoneNumber;
  private boolean whitelisted;

  public Contact(String name, String phoneNumber, boolean whitelisted) {
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.whitelisted = whitelisted;
  }

  public String getName() {
    return name;
  }

  public void setfName(String name) {
    this.name = name;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public boolean isWhitelisted() {
    return whitelisted;
  }

  public void setWhitelisted(boolean whitelisted) {
    this.whitelisted = whitelisted;
  }
}

