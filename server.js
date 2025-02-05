const Fastify = require('fastify');
const UAParser = require('ua-parser-js'); // https://github.com/faisalman/ua-parser-js
const Redis = require('ioredis');

const fastify = Fastify({ logger: true });

// Redis 연결 설정
const redisOptions = {
  host: process.env.REDISHOST || 'redis-uaparser', // 기본값: 'redis-uaparser'
  port: process.env.REDISPORT || 6379,
  retryStrategy: times => Math.min(times * 50, 2000) // 재연결 전략
};

// 🔥 REDISPASSWORD가 설정된 경우, Redis 인증 사용
if (process.env.REDISPASSWORD) {
  redisOptions.password = process.env.REDISPASSWORD;
}

const redis = new Redis(redisOptions);

// User-Agent 분석 API
fastify.post('/', async (request, reply) => {
  const { userAgent } = request.body;

  if (!userAgent) {
    return reply.status(400).send({ error: "User-Agent is required" });
  }

  try {
    // Redis 캐시 확인
    const cachedResult = await redis.get(userAgent);
    if (cachedResult) {
      return reply.send(JSON.parse(cachedResult));
    }

    // ua-parser-js 사용
    const parser = new UAParser();
    const result = parser.setUA(userAgent).getResult();

    // 캐싱 (TTL: 1시간)
    await redis.setex(userAgent, 324000, JSON.stringify(result));

    return reply.send(result);
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Health Check API (서버 & Redis 상태 확인)
fastify.get('/health', async (_, reply) => {
  try {
    await redis.ping(); // Redis 연결 확인
    return reply.send({ status: "ok", redis: "connected" });
  } catch (error) {
    fastify.log.error("Redis connection failed:", error);
    return reply.status(503).send({ status: "error", redis: "disconnected", error: error });
  }
});

// 서버 실행 (포트: 80)
fastify.listen({ port: 80, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server listening at ${address}`);
});
