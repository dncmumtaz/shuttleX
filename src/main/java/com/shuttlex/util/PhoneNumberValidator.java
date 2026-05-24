package com.shuttlex.util;

import java.util.regex.Pattern;

public final class PhoneNumberValidator {

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "((\\+|00)?90[-\\s]?)?0?5\\d{2}[-\\s]?\\d{3}[-\\s]?\\d{2}[-\\s]?\\d{2}|\\b\\d{10,13}\\b"
    );

    private PhoneNumberValidator() {
    }

    public static boolean containsPhoneNumber(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        return PHONE_PATTERN.matcher(text).find();
    }

    public static String maskPhoneNumbers(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }
        return PHONE_PATTERN.matcher(text).replaceAll("[telefon gizlendi]");
    }
}
