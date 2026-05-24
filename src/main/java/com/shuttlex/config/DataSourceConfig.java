package com.shuttlex.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.hikari")
    public DataSource dataSource(DataSourceProperties properties) {
        normalizeJdbcUrl(properties);
        return properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    private void normalizeJdbcUrl(DataSourceProperties properties) {
        String url = properties.getUrl();
        if (url == null) {
            return;
        }

        if (url.startsWith("postgresql://")) {
            properties.setUrl("jdbc:" + url);
        } else if (url.startsWith("postgres://")) {
            properties.setUrl("jdbc:postgresql://" + url.substring("postgres://".length()));
        }
    }
}
