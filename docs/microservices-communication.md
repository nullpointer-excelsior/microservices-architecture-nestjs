
# Comunicación entre microservicios

## Introducción

En arquitecturas orientadas a microservicios, contamos con numerosos componentes, aplicaciones y sistemas encargados de realizar tareas y procesos. Cada tarea o proceso puede recibir una entrada, procesarla y generar una salida. A su vez, esta salida puede ser devuelta o asignada a otro componente. 
Para lograr orquestar estos procesos se utilizan los protocolos de comunicación. En las arquitecturas de microservicios y en los sistemas distribuidos, la comunicación desempeña un papel crucial. Sin ella, estos sistemas no existirían. En este artículo exploraremos cómo funcionan las comunicaciones en aplicaciones basadas en microservicios.

## ¿Qué son los protocolos?

Los protocolos básicamente nos indican cómo los sistemas deben comunicarse entre sí. Definimos un formato de petición y un formato de respuesta con el cual podremos comunicar dos sistemas de una manera estandarizada. Estas pautas son descritas en documentos llamados RFC. La mayoría del tiempo, para nosotros, los protocolos son algo más ligado al bajo nivel. Ahora tenemos librerías y tecnologías que trabajan con estos con mayor abstracción y así podemos desarrollar soluciones con mayor facilidad.

Sin embargo, no está de más recordar estos conceptos fundamentales en el mundo de los microservicios, ya que existen un montón de arquitecturas y tecnologías involucradas en sistemas más complejos. Saber qué pasa por debajo de una librería o tecnología nos ayudará a resolver problemas que van más allá del código, los cuales la mayor parte del tiempo son los más difíciles de encontrar.

Actualmente, una forma de comunicar dos aplicaciones es mediante RESTful, un enfoque popular y súper simple de implementar que por debajo usa HTTP. RESTful no es la única manera en que dos aplicaciones pueden comunicarse. A continuación, hablaremos de las distintas maneras que tenemos disponibles en arquitecturas orientadas a microservicios para la comunicación de aplicaciones.

## Tipos de comunicación entre microservicios

Los microservicios, al ser aplicaciones independientes con necesidad de comunicarse con otras aplicaciones, tendremos disponibles básicamente dos categorías de comunicación síncronas y Asíncronas

### Comunicación síncrona

En la comunicación síncrona, un microservicio espera una respuesta inmediata después de enviar una solicitud a otro microservicio. Esto se asemeja a una conversación en tiempo real, donde el microservicio solicitante detiene su ejecución y espera la respuesta antes de continuar. Dentro de este enfoque tenemos a restful, graphql o remote call procedures RPC.


### Comunicación asíncrona

En la comunicación asíncrona, los microservicios envían mensajes sin esperar una respuesta inmediata. Esto se asemeja a dejar una nota para alguien, donde no hay una interacción directa en tiempo real. Los sistemas de mensajería como RabbitMQ, Apache Kafka o Amazon SQS se utilizan comúnmente para la comunicación asíncrona entre aplicaciones.


## ¿Cuándo usar asíncrono vs síncrono?

La elección entre comunicación síncrona y asíncrona en microservicios depende de varios factores, y cada enfoque tiene sus propias fortalezas dependiendo del contexto. Básicamente, podemos tomar las siguientes consideraciones: 

* Comunicación síncrona: Usa esto cuando necesites una respuesta inmediata para continuar con una tarea específica o cuando la consistencia de los datos sea crucial.

* Comunicación asíncrona: Opta por esto cuando busques escalabilidad, desacoplamiento entre microservicios o cuando necesites procesar tareas en segundo plano sin bloquear otras operaciones.

En la práctica, a menudo es útil una combinación de ambos enfoques para diferentes casos o situaciones. A continuación, se detallan las ventajas y desventajas de ambos enfoques.

### Ventajas de la comunicación asíncrona:

* Permite la desacoplación entre microservicios, lo que significa que pueden funcionar de forma independiente.
* Mayor escalabilidad ya que los microservicios no están esperando respuestas.
* Mejor tolerancia a fallos, ya que un microservicio puede seguir funcionando aunque el receptor esté temporalmente inactivo.

### Desventajas de la comunicación asíncrona:

* Puede ser más complejo de diseñar y mantener, ya que los sistemas deben gestionar la llegada y el procesamiento de mensajes de manera independiente.
* La gestión de errores puede ser más complicada debido a la falta de respuesta inmediata.

### Ventajas de la comunicación síncrona:

* Simplifica el manejo de errores y excepciones.
* Es más fácil de entender y depurar, ya que el flujo de control es lineal y directo.

### Desventajas de la comunicación síncrona:

* Puede aumentar la latencia, ya que el microservicio solicitante debe esperar la respuesta.
* La sobrecarga de red puede ser un problema si hay muchas solicitudes simultáneas.
* Si un microservicio está inactivo o es lento, puede afectar a los demás que dependen de él.


## Ejemplo de comunicación síncrona

Crearemos un pequeño ejemplo de un cliente HTTP con NestJS, basandonos en nuestra arquitectura de **Spotify-Clone**.

### Creando un cliente HTTP reutilizable

El siguiente código ejemplifica el uso de `HttpModule` en NestJS. Esto nos permite establecer propiedades de manera global para el cliente HTTP. Esta aproximación nos brinda la oportunidad de configurar nuestro cliente HTTP de forma única, evitando repeticiones.

```typescript
// ejemplo de uso de HttpModule
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
Ahora crearemos un servicio llamado `MusicLibraryClient`, el cual será el cliente HTTP del microservicio `music-library`. Este microservicio es el encargado de obtener información sobre artistas, álbumes y canciones de **Spotify-Clone**.

```typescript
// definimos una clase de Error para evitar la verbosidad de un AxiosError al momento de realizar un catch
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

// definimos nuestro cliente reutilizable
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
                        response: error.response?.data || 'Unknow error',
                     })
                }
                throw error
            })
        );
    }

} 

// definimos nuestro modulo personalizado para ser usado con aplicaciones basadas en NestJS

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

 Y utilizamos nuestro componente en clases de tipo servicio.

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

Este enfoque de cliente tiene las siguientes ventajas:

* Toda lógica ligada a HTTP está centralizada en nuestro componente `HttpClient``.
* Encapsulamos toda la lógica de la librería Axios dentro de nuestro cliente, evitando así acoplarnos a una solución en específico.
* Las clases que usen el cliente podrán crear dominios más desacoplados.

## Ejemplo de comunicación asíncrona

Ahora crearemos un ejemplo de comunicación asíncrona con el siguiente caso de uso, basado en la arquitectura de nuestro **Spotify-Clone**:

Cuando se crea un nuevo álbum de un artista, debemos enviar un correo electrónico de notificación a los usuarios que estén interesados en las noticias del artista.

Para lograr esto, lo haremos mediante una cola de mensajería. Esta cola básicamente recibe mensajes de aplicaciones productoras y estos mensajes serán escuchados por aplicaciones suscriptoras. Cada aplicación suscriptora podrá realizar alguna operación o tarea con la información contenida en el mensaje.


### Ejemplo básico de mensajería con RabbitMQ.

Crearemos un ejemplo con RabbitMQ, el cual es un servicio de colas de mensajería. Para levantarlo, debemos hacer uso de `docker-compose`.

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

NestJS nos provee un módulo de [RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq) con los  que podremos implementar los casos de uso más comunes.

> Si no conoces nada sobre RabbitMQ, te recomiendo que leas este post que profundiza más en detalle: [Enlace](https://nullpointer-excelsior.github.io/posts/mono-repo-with-nestjs/).

Ahora simularemos un microservicio que envía correos. Este servicio estara escuchando los mensjes que se reciban en la cola `spotify-clone` y dependiendo del tipo de mensaje, enviará un correo electrónico.

```typescript 
// definimos el RabbitMqModule con la configuración de RabbitMQ
@Module({
    // ... module conifguration
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

// iniciamos un microservicio de NestJs  en main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    MailingMsModule,
    RabbitmqQueueModule.getMicroserviceOptions()
  );
  await app.listen();
}

```

Una vez levantado nuestro microservicio con RabbitMQ, se creará una cola en el servidor de RabbitMQ la cual estará lista para recibir mensajes. En este ejemplo, los mensajes de nuevos álbumes creados serán recibidos por medio de los clásicos controladores de NestJS. En este caso, ya no se utilizan para una API REST, sino que NestJS los transformará automáticamente para RabbitMQ.

Para que podamos escuchar mensajes lo haremos mediante la anotación `@MessagePattern('EVENT_NAME')` en la cual especificamos el patrón de mensajes que queremos escuchar.

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
Cuando un mensaje de `new-album` sea recibido por nuestro controlador, se invocará el servicio de email para enviar una notificación a los usuarios interesados en el artista.

### Configuración del cliente de mensajería

Ahora debemos crear un cliente de RabbitMQ que se encargará de enviar mensajes a la cola. Lo haremos mediante el método `registerAsync()` del módulo `ClientModule` y definiremos la siguiente configuración:

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

Este código creará un cliente de RabbitMQ que podremos utilizar en nuestros microservicios. Sin embargo, iremos un paso más allá y crearemos un servicio más personalizado para evitar estar acoplados a la librería de NestJS.

Definiremos la estructura general de nuestros mensajes que serán enviados entre nuestros microservicios de **Spotify-Clone**.

```typescript 
export interface RabbitmqMessage<T> {
    id: string;
    pattern: string;
    timestamp: Date;
    data: T;
}
// definmos los mensjaes que se eniaran entre microservicios

export interface NewAlbumDataMessage {
    albumId: string;
    title: string;
}

export type NewAlbumMessage = RabbitmqMessage<NewAlbumDataMessage>
```

Y definimos ahora un servicio que será encargado de enviar mensajes.

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

Y para usar nuestro cliente en alguna aplicación de NestJS, importamos el módulo `RabbitMQModule`.

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
 Y usamos el servicio donde queramos enviar mensajes.

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

Ahora, el servicio de álbum, al crear un álbum, enviará un mensaje a RabbitMQ. Todos los clientes que se suscriban a la cola recibirán el mensaje y podrán realizar las operaciones pertinentes.

Este enfoque nos trae los siguientes beneficios:

- Desacoplamos la lógica de un caso de uso (crear álbum) de lógicas de notificaciones (email).
- El sistema queda extensible a otros casos de uso de forma desacoplada del principal.
- Hemos agregado escalabilidad a nuestro ecosistema de microservicios.

Si bien este es un ejemplo básico, existen múltiples configuraciones en arquitecturas orientadas a comunicaciones asincronas.

El ejemplo completo está disponible levantando los siguientes servicios:

```bash
#!/bin/bash
# up infrasrructure with docker-compose
npm run start:infra
# start music-library microservice
npm run start:music-library
# start mailing microservice
npm run start:mailing
 ```

## Conclusión

La comunicación entre microservicios de forma sincrónica nos dará la versatilidad de crear aplicaciones con responsabilidades únicas. Cada uno de estos componentes podrá comunicarse con otros de forma sencilla cuando la comunicación de estos no involucra temas de latencia y de responsabilidad. En este caso nos convendrá utilizar una comunicación asíncrona, la cual nos dará la posibilidad de crear sistemas escalables y de alto rendimiento. Cada enfoque debe ser adecuado al caso, pero básicamente estas 2 formas de comunicación las encontrarás implementadas de múltiples maneras en arquitecturas basadas en microservicios.





