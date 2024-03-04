import { Transport } from "@nestjs/microservices";

export function getRedisOptions() {
    return {
        transport: Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASS || undefined,
            wildcards: true,
        }
    }
}