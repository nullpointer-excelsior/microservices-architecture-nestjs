import { Logger } from "@nestjs/common";
import { getRedisOptions } from "./pubsub/get-redis-options";

export function getUserPurchaseMicroserviceOptions() {
    Logger.log('Getting microservice options with redis implementation', 'getUserPurchaseMicroserviceOptions')
    return getRedisOptions()
}