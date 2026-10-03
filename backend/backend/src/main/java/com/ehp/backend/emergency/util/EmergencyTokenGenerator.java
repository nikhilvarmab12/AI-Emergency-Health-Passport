package com.ehp.backend.emergency.util;

import java.security.SecureRandom;
import java.util.Base64;

public final class EmergencyTokenGenerator {

    private static final SecureRandom SECURE_RANDOM =
            new SecureRandom();

    private EmergencyTokenGenerator() {
    }

    public static String generateToken() {

        byte[] bytes = new byte[32];

        SECURE_RANDOM.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}