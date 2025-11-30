import Redis from 'ioredis';

let client;

export const connectRedis = (redisUrl) => {
  client = new Redis(redisUrl);
  client.on('connect', () => console.log('Redis connected'));
  client.on('error', (err) => console.error('Redis error', err));
  return client;
};

export const getRedisClient = () => client;
