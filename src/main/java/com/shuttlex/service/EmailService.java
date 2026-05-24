package com.shuttlex.service;

public interface EmailService {

    void sendNotification(String to, String subject, String body);
}
