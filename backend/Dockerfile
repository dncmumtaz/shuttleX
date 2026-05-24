# =============================================================================
# Stage 1: Build
# =============================================================================
FROM maven:3.8.8-amazoncorretto-17 AS build

WORKDIR /app

# Bağımlılık katmanını önbelleğe almak için önce pom.xml kopyalanır
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests -B

# =============================================================================
# Stage 2: Runtime
# =============================================================================
FROM amazoncorretto:17-alpine AS runtime

RUN addgroup -S shuttlegroup \
    && adduser -S shuttleuser -G shuttlegroup

WORKDIR /app

RUN mkdir -p /app/uploads/vehicles \
    && chown -R shuttleuser:shuttlegroup /app/uploads

COPY --from=build --chown=shuttleuser:shuttlegroup /app/target/shuttlex-*.jar app.jar

USER shuttleuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
