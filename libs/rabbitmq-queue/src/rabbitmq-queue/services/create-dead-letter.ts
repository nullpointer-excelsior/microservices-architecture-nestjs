import amqp from "amqp-connection-manager";

export interface DeadLetterOptions {
    amqpurl: string;
    exchange: string;
    deadLetterQueue: string;
    patterns: string[];
}

export async function createDeadLetter(options: DeadLetterOptions) {
    
    const amqpManager = amqp.connect(options.amqpurl);
    const channel = amqpManager.createChannel();
    await channel.waitForConnect();

    const exchange = await channel.assertExchange(options.exchange, 'fanout')
    const queue = await channel.assertQueue(options.deadLetterQueue, {
        exclusive: false,
        durable: true,
        autoDelete: false,
    })

    for (const pattern of options.patterns) {
        await channel.bindQueue(
            options.deadLetterQueue,
            options.exchange,
            pattern,
        );
    }
    
    await channel.close();

    return Promise.resolve({
        ...exchange,
        ...queue
    })

}