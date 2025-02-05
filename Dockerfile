FROM node:18-alpine

WORKDIR /app

# 🔥 필요한 패키지 설치 (curl 포함)
RUN apk add --no-cache curl

# 🔥 package.json & package-lock.json을 먼저 복사 후 설치 (Docker 캐싱 활용)
COPY package.json package-lock.json ./
RUN npm install --production

# 🔥 이후 앱 소스 코드 복사
COPY server.js ./

EXPOSE 80
CMD ["node", "server.js"]
