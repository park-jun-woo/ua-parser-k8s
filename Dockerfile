# 🔥 1️⃣ 빌드 스테이지 (dependencies 설치, 빌드 전용)
FROM node:18-alpine AS builder

WORKDIR /app

# 🔥 패키지 설치 (필요 시 curl 포함)
RUN apk add --no-cache curl

# 🔥 package.json & package-lock.json을 먼저 복사 후 설치 (Docker 캐시 활용)
COPY package.json package-lock.json ./
RUN npm install --production

# 🔥 2️⃣ 런타임 스테이지 (최종 최소 이미지)
FROM node:18-alpine

WORKDIR /app

# 🔥 빌드된 node_modules만 복사 (불필요한 개발 도구 제거)
COPY --from=builder /app/node_modules ./node_modules
COPY server.js ./

# 🔥 실행 포트 및 명령 설정
EXPOSE 80
CMD ["node", "server.js"]
