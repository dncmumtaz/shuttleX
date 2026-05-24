package com.shuttlex.service.impl;

import com.shuttlex.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendNotification(String to, String subject, String body) {
        log.info("[MOCK EMAIL] To: {} | Subject: {} | Body: {}", to, subject, body);
    }
}
