import { RabbitmqQueueModuleOptions } from "../../../rabbitmq-queue.module";

export interface RabbitmqQueueConfig {
    amqpurl: string;
    queue: string;
    deadLetter: {
        queue: string;
        exchange: string;
        patterns: string[];
    }
}

export function RabbitmqQueueConfigFactory(options: RabbitmqQueueModuleOptions): RabbitmqQueueConfig {
    
    const { queue, credentials } = options
    const { host, port, vhost, user, password } = credentials
    const { deadLetter } = queue

    const amqpurl = `amqp://${user}:${password}@${host}:${port}/${vhost}`

    const config = {
        amqpurl,
        queue: queue.name,
        deadLetter: {
            queue: `${deadLetter.exchange}.${queue.name}`,
            exchange: deadLetter.exchange,
            patterns: deadLetter.patterns
        }
    }

    console.table(config)
    return config

}