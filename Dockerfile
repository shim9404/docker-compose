# ============================================
# Stage 1: React (Vite) 빌드
# ============================================
FROM node:22-alpine AS frontend-build

WORKDIR /app

# 의존성 설치
COPY frontend/package*.json ./
RUN npm ci

# 소스 복사 후 빌드 (동일 오리진 API용: VITE_SPRING_IP 비움)
COPY frontend/ ./
ENV VITE_SPRING_IP=
RUN npm run build

# ============================================
# Stage 2: Spring Boot 빌드 (프론트 빌드 결과물 포함)
# ============================================
FROM eclipse-temurin:21-jdk AS backend-build

WORKDIR /build

# 백엔드 소스 복사
COPY backend/ ./

# Stage 1에서 만든 React 빌드 결과를 Spring static으로 복사
COPY --from=frontend-build /app/dist ./src/main/resources/static

# Gradle 빌드 (테스트 제외로 이미지 빌드 시간 단축)
RUN ./gradlew bootJar -x test --no-daemon

# ============================================
# Stage 3: 실행용 최종 이미지
# ============================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Stage 2에서 만든 JAR 복사
COPY --from=backend-build /build/build/libs/*SNAPSHOT.jar app.jar

EXPOSE 8000

ENTRYPOINT ["java", "-jar", "/app/app.jar"]