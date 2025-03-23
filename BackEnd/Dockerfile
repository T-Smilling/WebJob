FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /build

# Sao chép file pom.xml và tải dependency trước để tận dụng cache
COPY pom.xml .
RUN mvn dependency:go-offline

# Sao chép mã nguồn và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng
FROM openjdk:17-slim

WORKDIR /app

# Sao chép file JAR từ stage build
COPY --from=builder /build/target/user-service-0.0.1-SNAPSHOT.jar api-service.jar

# Thêm các biến môi trường
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms512m -Xmx1024m" \
    DB_HOST="mysql" \
    DB_PORT="3306" \
    DB_NAME="yourdb" \
    DB_USERNAME="user" \
    DB_PASSWORD="password" \
    REDIS_HOST="redis" \
    REDIS_PORT="6379" \
    KAFKA_BOOTSTRAP_SERVERS="kafka:9092"

# Expose cổng 8080
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar api-service.jar"]