# Use OpenJDK 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Give execute permission to Maven Wrapper
RUN chmod +x mvnw

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose Spring Boot port
EXPOSE 9111

# Run the application
ENTRYPOINT ["java","-jar","target/email-0.0.1-SNAPSHOT.jar"]