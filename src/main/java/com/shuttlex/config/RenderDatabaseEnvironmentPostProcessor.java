package com.shuttlex.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Render Postgres connectionString değerini (postgresql://user:pass@host/db) Spring JDBC formatına çevirir.
 * Eski Blueprint env var'ları (SPRING_DATASOURCE_URL) deploy ortamında kalabildiği için gerekli.
 */
public class RenderDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String DATASOURCE_URL_PROPERTY = "spring.datasource.url";
    private static final String DATASOURCE_USERNAME_PROPERTY = "spring.datasource.username";
    private static final String DATASOURCE_PASSWORD_PROPERTY = "spring.datasource.password";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String envUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        String configuredUrl = environment.getProperty(DATASOURCE_URL_PROPERTY);
        String candidate = envUrl != null && !envUrl.isBlank() ? envUrl : configuredUrl;

        ParsedPostgresUrl parsed = parsePostgresUrl(candidate);
        if (parsed == null) {
            return;
        }

        Map<String, Object> properties = new HashMap<>();
        properties.put(DATASOURCE_URL_PROPERTY, parsed.jdbcUrl());

        if (parsed.username() != null && isBlank(environment.getProperty("SPRING_DATASOURCE_USERNAME"))) {
            properties.put(DATASOURCE_USERNAME_PROPERTY, parsed.username());
        }
        if (parsed.password() != null && isBlank(environment.getProperty("SPRING_DATASOURCE_PASSWORD"))) {
            properties.put(DATASOURCE_PASSWORD_PROPERTY, parsed.password());
        }

        environment.getPropertySources().addFirst(new MapPropertySource("renderPostgresJdbcUrl", properties));
    }

    private ParsedPostgresUrl parsePostgresUrl(String url) {
        if (url == null || url.isBlank()) {
            return null;
        }

        String value = url.trim();
        if (value.startsWith("jdbc:postgresql://") || value.startsWith("jdbc:postgres://")) {
            return null;
        }

        if (value.startsWith("jdbc:")) {
            value = value.substring("jdbc:".length());
        }

        if (value.startsWith("postgresql://")) {
            value = value.substring("postgresql://".length());
        } else if (value.startsWith("postgres://")) {
            value = value.substring("postgres://".length());
        } else {
            return null;
        }

        String userInfo = null;
        String hostAndPath = value;
        int atIndex = value.lastIndexOf('@');
        if (atIndex >= 0) {
            userInfo = value.substring(0, atIndex);
            hostAndPath = value.substring(atIndex + 1);
        }

        String[] hostAndDatabase = hostAndPath.split("/", 2);
        if (hostAndDatabase.length < 2 || hostAndDatabase[1].isBlank()) {
            return null;
        }

        String hostPort = hostAndDatabase[0];
        String database = hostAndDatabase[1].split("\\?", 2)[0];

        String host;
        int port = 5432;
        int colonIndex = hostPort.lastIndexOf(':');
        if (colonIndex >= 0) {
            host = hostPort.substring(0, colonIndex);
            port = Integer.parseInt(hostPort.substring(colonIndex + 1));
        } else {
            host = hostPort;
        }

        String username = null;
        String password = null;
        if (userInfo != null) {
            int colonIndexInUserInfo = userInfo.indexOf(':');
            if (colonIndexInUserInfo >= 0) {
                username = userInfo.substring(0, colonIndexInUserInfo);
                password = userInfo.substring(colonIndexInUserInfo + 1);
            } else {
                username = userInfo;
            }
        }

        return new ParsedPostgresUrl(
                "jdbc:postgresql://" + host + ":" + port + "/" + database,
                username,
                password
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }

    private record ParsedPostgresUrl(String jdbcUrl, String username, String password) {
    }
}
