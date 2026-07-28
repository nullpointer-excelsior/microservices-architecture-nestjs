
# 🔄 Microservices Communication

## 💡 Introduction

In microservices-oriented architectures, we have numerous components, applications, and systems responsible for performing tasks and processes. Each task or process can receive an input, process it, and generate an output. In turn, this output can be returned or assigned to another component.
To orchestrate these processes, communication protocols are used. In microservices architectures and distributed systems, communication plays a crucial role. Without it, these systems would not exist. In this article, we will explore how communications work in microservices-based applications.

## ❓ What Are Protocols?

Protocols basically tell us how systems should communicate with each other. We define a request format and a response format with which we can communicate two systems in a standardized way. These guidelines are described in documents called RFCs. Most of the time, for us, protocols are something more related to the low level. Now we have libraries and technologies that work with them at a higher level of abstraction, so we can develop solutions more easily.

However, it does not hurt to remember these fundamental concepts in the world of microservices, since there are a lot of architectures and technologies involved in more complex systems. Knowing what happens beneath a library or technology will help us solve problems that go beyond code, which most of the time are the hardest to find.

Currently, one way to communicate two applications is through RESTful, a popular and super simple approach to implement that uses HTTP under the hood. RESTful is not the only way two applications can communicate. Below, we will talk about the different ways we have available in microservices-oriented architectures for application communication.

## 📋 Types of Communication Between Microservices

Microservices, being independent applications that need to communicate with other applications, will basically have two categories of communication available: synchronous and asynchronous.

### 🔄 Synchronous Communication

In synchronous communication, a microservice expects an immediate response after sending a request to another microservice. This resembles a real-time conversation, where the requesting microservice stops its execution and waits for the response before continuing. Within this approach we have RESTful, GraphQL, or Remote Procedure Calls (RPC).


### 📨 Asynchronous Communication

In asynchronous communication, microservices send messages without expecting an immediate response. This resembles leaving a note for someone, where there is no direct real-time interaction. Messaging systems like RabbitMQ, Apache Kafka, or Amazon SQS are commonly used for asynchronous communication between applications.


## ⚖️ When to Use Asynchronous vs Synchronous?

The choice between synchronous and asynchronous communication in microservices depends on several factors, and each approach has its own strengths depending on the context. Basically, we can take the following considerations:

* Synchronous communication: Use this when you need an immediate response to continue with a specific task or when data consistency is crucial.

* Asynchronous communication: Go for this when you seek scalability, decoupling between microservices, or when you need to process tasks in the background without blocking other operations.

In practice, a combination of both approaches is often useful for different cases or situations. Below are the advantages and disadvantages of both approaches.

### ⚡ Advantages of Asynchronous Communication:

* Allows decoupling between microservices, meaning they can operate independently.
* Greater scalability since microservices are not waiting for responses.
* Better fault tolerance, as a microservice can keep running even if the receiver is temporarily down.

### ⚠️ Disadvantages of Asynchronous Communication:

* Can be more complex to design and maintain, as systems must manage the arrival and processing of messages independently.
* Error handling can be more complicated due to the lack of immediate response.

### ⚡ Advantages of Synchronous Communication:

* Simplifies error and exception handling.
* Easier to understand and debug, as the control flow is linear and direct.

### ⚠️ Disadvantages of Synchronous Communication:

* Can increase latency, as the requesting microservice must wait for the response.
* Network overhead can be a problem if there are many simultaneous requests.
* If a microservice is down or slow, it can affect others that depend on it.


## 🖥️ Synchronous Communication Example

We will create a small example of an HTTP client with NestJS, based on our **Spotify-Clone** architecture.

### 🛠️ Creating a Reusable HTTP Client

The following code exemplifies the use of `HttpModule` in NestJS. This allows us to set properties globally for the HTTP client. This approach gives us the opportunity to configure our HTTP client in a single place, avoiding repetition.

```typescript
// example of HttpModule usage
@Module({
  imports: [
    HttpModule.register({
      baseURL: 'http://localhost:3000/api-url',
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [MusicLibraryCLient],
})
export class MyModule {}
 ```
Now we will create a service called `MusicLibraryClient`, which will be the HTTP client for the `music-library` microservice. This microservice is responsible for getting information about artists, albums, and songs from **Spotify-Clone**.

```typescript
// we define an Error class to avoid the verbosity of an AxiosError when catching
type Props = {
    message: string;
    status: number;
    response: string;
    url: string;
}

export class HttpClientError extends Error {
    
    public readonly status: number;
    public readonly response: string;
    public readonly url: string;

    constructor({ message, status: statusResponse, response: textResponse, url }: Props) {
        super(message);
        this.name = this.constructor.name;
        this.status = statusResponse;
        this.response = textResponse;
        this.url = url;
        Object.setPrototypeOf(this, HttpClientError.prototype);
      }

}

// we define our reusable client
@Injectable()
export class HttpCLient {

    constructor(private readonly http: HttpService) { }

    get<T = any>(endopoint: string, config?: AxiosRequestConfig): Observable<T> {
        const url = `/${endopoint}`
        return this.http.get<T>(url, config).pipe(
            map(res => res.data),
            catchError((error) => {
                if (isAxiosError(error)) {
                    throw new HttpClientError({ 
                        message: error.message,
                        status: error.response?.status || 500,
                        url: error.config.url || "",
                        response: error.response?.data || 'Unknown error',
                     })
                }
                throw error
            })
        );
    }

} 

// we define our custom module to be used with NestJS-based applications

import { Module } from '@nestjs/common';
import { HttpClient } from './client/http-client';
import { HttpModule, HttpModuleAsyncOptions } from '@nestjs/axios';

@Module({
})
export class HttpClientModule {

    static registerAsync(options: HttpModuleAsyncOptions) {
        return {
            module: HttpClientModule,
            imports: [
                HttpModule.registerAsync(options)
            ],
            providers: [
                HttpClient
            ],
            exports: [
                HttpClient
            ]
        }
    }
}

```

 And we use our component in service-type classes.

 ```typescript
 @Injectable()
export class ArtistAPI {

  constructor(private client: MusicLibraryCLient) { }

  findById(id: string) {
    return this.client.get<Artist>(`artists/${id}`)
  }

  findAll() {
    return this.client.get<Artist[]>(`artists`)
  }

}
 ```

This client approach has the following advantages:

* All HTTP-related logic is centralized in our `HttpClient` component.
* We encapsulate all the Axios library logic within our client, thus avoiding coupling to a specific solution.
* Classes that use the client can create more decoupled domains.

## 📨 Asynchronous Communication Example

Now we will create an example of asynchronous communication with the following use case, based on our **Spotify-Clone** architecture:

When a new album is created by an artist, we need to send a notification email to users who are interested in the artist's news.

To achieve this, we will do it through a messaging queue. This queue basically receives messages from producer applications and these messages will be listened to by subscriber applications. Each subscriber application can perform some operation or task with the information contained in the message.


### 🐰 Basic Messaging Example with RabbitMQ

We will create an example with RabbitMQ, which is a messaging queue service. To start it, we need to use `docker-compose`.

```yml
version: '3'

services:
  rabbitmq:
    container_name: rabbitmq
    image: rabbitmq:3-management-alpine
    ports:
        - 5672:5672
        - 15672:15672
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS}
    networks:
      - microservices-architecture

```

NestJS provides a [RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq) module with which we can implement the most common use cases.

> If you do not know anything about RabbitMQ, I recommend reading this post that goes into more detail: [Link](https://nullpointer-excelsior.github.io/posts/mono-repo-with-nestjs/).

Now we will simulate a microservice that sends emails. This service will be listening to messages received on the `spotify-clone` queue and depending on the message type, it will send an email.

```typescript 
// we define the RabbitMqModule with the RabbitMQ configuration
@Module({
    // ... module configuration
})
export class RabbitmqQueueModule {

    static getMicroserviceOptions(): any {

        const user = process.env.RABBITMQ_USER
        const password = process.env.RABBITMQ_PASS
        const host = process.env.RABBITMQ_HOST
        const amqpurl = `amqp://${user}:${password}@${host}:5672`
    
        return {
            transport: Transport.RMQ,
            options: {
                urls: [
                    amqpurl
                ],
                queue: QUEUE_NAME,
                queueOptions: {
                    durable: false
                },
            }
        }

    }

}

// we start a NestJS microservice in main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    MailingMsModule,
    RabbitmqQueueModule.getMicroserviceOptions()
  );
  await app.listen();
}

```

Once our microservice is up with RabbitMQ, a queue will be created on the RabbitMQ server which will be ready to receive messages. In this example, new album created messages will be received through the classic NestJS controllers. In this case, they are not used for a REST API, but NestJS will automatically transform them for RabbitMQ.

To listen for messages, we will use the `@MessagePattern('EVENT_NAME')` annotation where we specify the message pattern we want to listen to.

```typescript 
@Controller()
export class QueueController {
  
  constructor(private readonly email: EmailService) {}

  @MessagePattern('new-album')
  onNewAlbum(@Payload() data: NewAlbumMessage, @Ctx() context: RmqContext) {
    this.email.notifyNewAlbum(data)
  }

}
```
When a `new-album` message is received by our controller, the email service will be invoked to send a notification to users interested in the artist.

### ⚙️ Messaging Client Configuration

Now we need to create a RabbitMQ client that will be responsible for sending messages to the queue. We will do this using the `registerAsync()` method of the `ClientModule` and define the following configuration:

```typescript

export const RABBITMQ_PRODUCER_CLIENT = 'spotifyclone-queue-client'
export const QUEUE_NAME = 'spotify-queue'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: RABBITMQ_PRODUCER_CLIENT,
                imports: [
                    ConfigModule.forRoot()
                ],
                useFactory: (config: ConfigService) => {
                    const user = config.get('RABBITMQ_USER')
                    const password = config.get('RABBITMQ_PASS')
                    const host = config.get('RABBITMQ_HOST')
                    const amqp = `amqp://${user}:${password}@${host}:5672`
                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [
                                amqp
                            ],
                            queue: QUEUE_NAME,
                            queueOptions: {
                                durable: false,
                            },
                        },
                    }
                },
                inject: [
                    ConfigService
                ]
            }
        ]),
    ],
    exports: [
        RabbitmqClient,
    ],
    providers: [
        RabbitmqClient
    ]
})
export class RabbitmqQueueModule {

    static getMicroserviceOptions(){
        // ... more code
    }
}
```

This code will create a RabbitMQ client that we can use in our microservices. However, we will go one step further and create a more personalized service to avoid being coupled to the NestJS library.

We will define the general structure of our messages that will be sent between our **Spotify-Clone** microservices.

```typescript 
export interface RabbitmqMessage<T> {
    id: string;
    pattern: string;
    timestamp: Date;
    data: T;
}
// we define the messages that will be sent between microservices

export interface NewAlbumDataMessage {
    albumId: string;
    title: string;
}

export type NewAlbumMessage = RabbitmqMessage<NewAlbumDataMessage>
```

And now we define a service that will be responsible for sending messages.

```typescript 
@Injectable()
export class RabbitmqClient {

    constructor(@Inject(RABBITMQ_PRODUCER_CLIENT) private client: ClientProxy) { }

    emitTo<T>(pattern: string, data: T): RabbitmqMessage<T> {
        const message: RabbitmqMessage<T> = {
            id: uuidv4(),
            pattern: pattern,
            timestamp: new Date(),
            data: data
        }
        this.client.emit(pattern, message)
        return message
    }

}
```

And to use our client in any NestJS application, we import the `RabbitMQModule`.

```typescript 
@Module({
    imports: [
        RabbitmqQueueModule,
        // other imports
    ],
    // other modules
})
export class MusicLibraryModule {}
```
 And we use the service wherever we want to send messages.

```typescript
@Injectable()
export class AlbumService {

  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private rabbitmqClient: RabbitmqClient,
  ) { }

  async save(album: CreateAlbumRequest) {

    const artist = await this.artistRepository.findOneBy({ id: album.artistId })

    const albumCreated = await this.albumRepository.save({
      title: album.title,
      photo: album.photo,
      artist: artist,
      year: album.year,
    })

    this.rabbitmqClient.emitTo<NewAlbumDataMessage>('new-album', { 
      albumId: albumCreated.id,
      title: albumCreated.title
    })
    
    return albumCreated

  }

}
```

Now, the album service, when creating an album, will send a message to RabbitMQ. All clients subscribed to the queue will receive the message and can perform the relevant operations.

This approach brings the following benefits:

- We decouple the logic of a use case (create album) from notification logic (email).
- The system becomes extensible to other use cases in a decoupled way from the main one.
- We have added scalability to our microservices ecosystem.

While this is a basic example, there are multiple configurations in architectures oriented towards asynchronous communications.

The complete example is available by starting the following services:

```bash
#!/bin/bash
# start infrastructure with docker-compose
npm run start:infra
# start music-library microservice
npm run start:music-library
# start mailing microservice
npm run start:mailing
 ```

## 🏁 Conclusion

Synchronous communication between microservices will give us the versatility to create applications with unique responsibilities. Each of these components can communicate with others easily when their communication does not involve latency and responsibility issues. In this case, it is convenient to use asynchronous communication, which will give us the possibility to create scalable and high-performance systems. Each approach must be suited to the case, but basically you will find these 2 forms of communication implemented in multiple ways in microservices-based architectures.
