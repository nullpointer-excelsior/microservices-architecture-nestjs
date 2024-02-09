import { getRedisOptions } from "./redis/get-redis-options";

export function getMicroserviceOptions() {
    return getRedisOptions()
}