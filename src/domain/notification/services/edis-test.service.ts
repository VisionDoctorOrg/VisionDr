import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisTestService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RedisTestService.name);
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  async testConnection() {
    try {
      const pong = await this.redis.ping();
      this.logger.warn('Redis connection successful:', pong);
      await this.redis.set('test-key', 'Hello, Redis!');
      const value = await this.redis.get('test-key');
      this.logger.debug('Value from Redis:', value);
    } catch (error) {
      this.logger.error('Redis connection failed:', error);
    }
  }

  async onApplicationBootstrap() {
    await this.testConnection();
    this.redis.disconnect();
  }
}
