# Arquitecuras EDA Eventos de dominio vs eventos de integración

La comunicación asincrónica entre microservicios nos ayuda a crear procesos complejos donde las responsabilidades del sistema están repartidas entre distintas aplicaciones. Como es la filosofía de los microservicios, separar responsabilidades para mantener ciertas características independientes entre sí nos ayuda a lograr escalabilidad, manejo de cargas y tolerancia a errores, pero esto conlleva un gran desafío de comunicación. Comunicar un servicio de forma síncrona y esperar una respuesta no siempre es viable. Hay cargas de trabajo que no requieren una respuesta inmediata, e incluso muchas veces esto puede fallar y romper todo el flujo de un proceso importante. Nadie quiere esto en una compra de considerable valor.

Cuando la comunicación síncrona no es la opción, te presento las arquitecturas EDA, o arquitecturas basadas en eventos. Este enfoque nos da la posibilidad de comunicarnos con componentes tanto internos de una aplicación como con servicios o aplicaciones externas. En esta ocasión analizaremos los eventos de dominio y los eventos de integración.


# Comunicación basada en eventos

La integración de aplicaciones y servicios utilizando arquitecturas orientadas a eventos es esencial para crear sistemas robustos y flexibles. Dos conceptos fundamentales en este ámbito son los eventos de dominio y los eventos de integración. Ambos desempeñan roles cruciales, pero se aplican en contextos un tanto diferentes, pero a su vez son compatibles entre sí, lo que nos permite crear sistemas complejos y desacoplados.


## Eventos de Dominio:

Los eventos de dominio son fundamentales en el diseño basado en dominio o DDD, una técnica que se centra en modelar el sistema según el dominio de negocio al que pertenece. Estos eventos representan cambios significativos en el estado del dominio y suelen estar vinculados estrechamente a los conceptos del modelo de dominio. tambien representan hechos pasados del dominio por eejemplo: `user-created`, `user-banned`, `stock-updated`, etc.

>Si bien los eventos de dominio los encuentras mucho en sistemas hechos con DDD nadie te impide usarlos en arquitecturas mas simples como las de N-capas


### Características Clave:

- **Contexto de Negocio**: Los eventos de dominio se originan en el núcleo del negocio y reflejan acciones o cambios relevantes para el dominio.
- **Desacoplamiento**: Permiten un desacoplamiento eficiente entre las distintas partes del sistema al enfocarse en la semántica del dominio en lugar de detalles de implementación.
- **Modelado Preciso**: Al reflejar eventos específicos del dominio, estos eventos contribuyen a un modelado más preciso y representativo del negocio.


## Eventos de Integración:

Los eventos de integración son mensajes diseñados para coordinar la interacción entre microservicios o aplicaciones. Estos eventos abordan la necesidad de sincronización y colaboración en un entorno distribuido. Estos eventos representan mensajes que se intercambian entre componentes o servicios para mantener la coherencia y la sincronización en el ecosistema de software.

### Características Clave:

- **Comunicación Inter-Servicios**: Los eventos de integración facilitan la comunicación entre diferentes servicios o componentes, permitiendo la colaboración en un entorno distribuido.
- **Desacoplamiento de Sistemas**: Al utilizar eventos para la integración, se logra un desacoplamiento efectivo entre sistemas, lo que facilita la escalabilidad y la evolución independiente de cada componente.
- **Interoperabilidad**: Son esenciales para lograr interoperabilidad entre sistemas heterogéneos, ya que proporcionan un medio estandarizado de intercambio de información.

Es crucial comprender que los eventos de dominio y los eventos de integración sirven propósitos diferentes, pero no son mutuamente excluyentes. De hecho, su uso combinado puede potenciar la eficacia de un sistema.

## Casos de Uso Eventos de dominio:

En nustra arquitectura de nuestro Spotify-clone vermeos los eventos dedmonio ocurridos en el microservicio `music-discovery-ms` esta aplicaicon contiene los siguientes modulos

- **user-catalog**: catalogo musical del usuario con playlist personales artistas y canciones favoritas
- **playlist-catalog**: catalogo de plylist ofreceidas a plos usuarios
- **shared**: componentes compartido entre los modulos

### Caso de uso:

Cuando el usuario crea un playlist en su catalogo si este es de tipo publico debe agregarse automaticamente al catalogo de playlist de spotify-clone para poder ser indexado de forma eficiente

Analizando el caso de uso lo unico que tendriamos que hacer es invocar al repositorio encargado de la splaylist de spotifyclone cuando el usuario actualize su playlist, pero para ejmplos reales suponiendo que la complejidad del codigo es alta
acoplar el modulo `user-catalog` con `playlist-catalog` en el caso de uso de actualizar catalogo de usuario no tiene nada que ver con el caso de uso de actualizar el catalog de playlist, esto incluso no nos permite que nuetsro codigo sea escalable. para solucionar esto comunicaremos estos 2 modulos mediante eventos de dominio.

Primero creamos dentro d ela libreria `libs/utils` del proyecto monorepo una libreria de utilitarios de DDD llamada `seedwork` con clase base para los evetnots de dominio.

> `seedwork` es nombre que hace referencia a una especie de mini framework de utilidades propias pero aplicado a nivel local de tu proyecto, puedes encontrarlo con otros nombres como shared-kernel, commons, core, etc



```typescript
//port 
export abstract class DomainEventBus {
    abstract publish<T extends DomainEvent<any>>(event: T): void
}

export abstract class DomainEvent<T = any> {

    public readonly id: string;
    public readonly occurredOn: Date;
    
    constructor(
        public readonly name: string,
        public readonly payload: T
    ) {
        this.id = uuid.generate();
        this.occurredOn = new Date();
    }

}



```

Nos ayudamos de la liberia [eventemitter](https://docs.nestjs.com/techniques/events) de nestjs para crear un eventbus en memoria para poder emitir los eventos

```typescript
// adapter
@Injectable()
export class EventEmitterEventbus implements DomainEventBus {

    constructor(private eventEmitter: EventEmitter2) {}
   
    async publish<T extends DomainEvent<any>>(event: T) {
        this.eventEmitter.emit(event.name, event);
    }

}
```
Genramos los eventos de dominio dentro del modulo `shared` de `music-discovery`

```typescript

export class PlaylistUpdatedEvent extends DomainEvent<Playlist> { 
    
    constructor(playlist: Playlist) {
        super(PlaylistUpdatedEvent.NAME, playlist);
    }

    static readonly NAME = 'com.clonespotify.discovery.user-music-catalog.domain.playlist-updated';
    
}
```
> Utilizamos el pattern de punto nombre punto para poder realizar patrones de filtrado sobre eventos en casos mas complejos

Ahora nuestro caso de uso seria el siguiente

```typescript
export class UpdatePlaylistsDto {
    
    @IsUUID()
    @IsNotEmpty()
    userCatalogId: string;

    @ValidateNested({ each: true })
    playlist: Playlist;
    
}

export class Playlist extends Model {
    
    @IsNotEmpty()
    name: string;
    
    @IsBoolean()
    isPublic: boolean;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Song)
    songs: Song[];


}

@Injectable()
export class UserCatalogUseCases {

    constructor(
        private readonly catalog: UserCatalogService,
        private readonly domainEventbus: DomainEventBus
    ) { }

    async updatePlaylists(dto: UpdatePlaylistsDto) {

        const playlistNotToUpdate = (playlists) => playlists.filter(p => p.id !== dto.playlist.id);

        return await this.catalog.findById(dto.userCatalogId)
            .then(catalog => {
                catalog.playlists = [
                    ...playlistNotToUpdate(catalog.playlists),
                    dto.playlist
                ]
                return catalog
            })
            .then(async catalog => {
                await this.catalog.save(catalog)
                return catalog
            })
            .then(catalog => {
                this.domainEventbus.publish(new PlaylistUpdatedEvent(dto.playlist));
                return catalog
            });

    }

}
```

Nuestro caso de uso es simple solo recibimos un DTO con la info de la playlist a actualizar y enviamos el evento de dominio con `domainEventBus.publish()`.


Gracias a nestjs podremos escuchar este evento medianto anotaciones en cualquier servicio `@Injectable`

```typescript
@Injectable()
export class DomainEventListener {

    constructor(private readonly playlist: PlaylistUseCases) {}

    @OnEvent(PlaylistUpdatedEvent.NAME)
    async onPlaylistCreated(event: PlaylistUpdatedEvent) {
        const playlist = event.payload
        if (playlist.isPublic) {
            await this.playlist.create(playlist)
        }
    }

}
```

Finalmente recibimos el playlist mediante un evento y si este es publico se guardara en base de datos en el modulo de `playlist-catalog`, de esta manera hemos desacoplado 2 casos de uso totlamentye distintos donde el modelo de playlist tiene un significado distinto dependiendo del contexto de domnio en que este.

## Casos de Uso Eventos de integración:

Ya tene,mos claro que los eventos de integracion nos ayuda a comunicar distintas aplicaciones para ejemplificar este conceto tomaremos el caso de uso de creacion de usuarion dentro del microservicio `accounts-ms` 

### Caso de uso: iniciar bienvendia usuario

Este cso de uso involucra 3 aplicaciones:
- `account-ms`: encargado de la gestion de cuentas y usuarios
- `mailing-ms`: encargado de enviar nortificaciones de correo electronico
- `music-dicovery-ms`: encargado de gestionar la musica que le interesa o puede interesarle al usuario del clonespotify

Nuestro caso de uso es simple. cuando se cree un usuario dentro de `accounts-ms` necesitamos ebnviar un correo electronico de bienvenida al usuario y asu vez necesitamos iniciar el catalogo inicial del usuario.

Este simple caso de uso involucra distintops servicios, y como vemos a simple vista cada 1 de estos teiene responsabilidades totlamente distintas entre si, pero gracias a los eventos de integracion podemos lograr un proceso distribuido entre nuestros servicios co un bajo acoplamiento.

Lo priemro sera definir la arquitectura de eventos para lograrlo nos ayudaremos del modelo pub/sub el cual nos permitira que multiples clientes puedan suscribirse a algun evento y realizar sus operaciones

craeemos un servico de redis en nuestro docker-compose 

```yml
version: '3'
    services:
        # ... other services
        redis:
            container_name: redis
            image: redis:6.2-alpine
            restart: always
            ports:
            - ${REDIS_PORT}:6379
            command: redis-server --save 20 1 --loglevel warning --requirepass ${REDIS_PASS}
            networks:
            - microservices-architecture

```
instalamos la siguiente dependencia
```bash
npm i --save ioredis 
```
Nestjs nos ofrece este modelo de pub/sub basado en un servidor redis el cual nos ayudara apluclicar y escuchar eventos a modo de fire and forget lo que implica la desventaja de que si nadie escucha los mensjaes emitidos estos se perderan. pero a modo de aprendizaje esto nos bastará. 

>implementacione productivas seran detalladas en futuro articulos especializados

La impelemtacion del pub/sub es simple asi que definimos la siguiente libreria compartida en nuestrso monorepo

```bash
 integration-events
├──  src
│   ├──  config
│   │   └──  constants.ts
│   ├──  events
│   │   ├──  accounts-ms
│   │   │   └──  user-created.event.ts
│   │   ├──  integration.event.ts
│   │   ├──  integration.eventbus.ts
│   │   └──  music-discovery-ms
│   │       └──  user-favorites-updated.event.ts
│   ├──  index.ts
│   ├──  integration-events.module.ts
│   ├──  services
│   │   └──  redis.eventbus.ts
│   └──  transporters
│       ├──  get-microservice-options.ts
│       └──  redis
│           └──  get-redis-options.ts
└──  tsconfig.lib.json
```

Definimos nuestro Eventbus
```typescript

export abstract class IntegrationEventBus {

    abstract publish<T>(event: IntegrationEvent<T>): IntegrationEvent<T>;

}

@Injectable()
export class RedisEventBus extends IntegrationEventBus {

    constructor(@Inject(REDIS_PRODUCER_CLIENT) private client: ClientProxy) {
        super()
    }

    publish<T>(event: IntegrationEvent<T>): IntegrationEvent<T> {
        this.client.emit(event.name, event)
        return event
    }

}

const IntegrationEventbusProvider = {
  provide: IntegrationEventBus,
  useExisting: RedisEventBus
}
@Module({
  providers: [
    RedisEventBus,
    IntegrationEventbusProvider
  ],
  exports: [
    IntegrationEventbusProvider
  ],
  imports: [
    ClientsModule.registerAsync([
      {
        name: REDIS_PRODUCER_CLIENT,
        imports: [
          ConfigModule.forRoot()
        ],
        useFactory: (config: ConfigService) => {
          const host = config.get('REDIS_HOST')
          const port = config.get('REDIS_PORT')
          const password = config.get('REDIS_PASS') 
          return {
            transport: Transport.REDIS,
            options: {
              host,
              port,
              password
            }
          }
        },
        inject: [
          ConfigService
        ]
      },
    ]),
  ]

})
export class IntegrationEventsModule { }

```

definimos nuestros eventos
```typescript
export abstract class IntegrationEvent<T> {

    public readonly id: string;
    public readonly occurredOn: Date;
    
    constructor(
        public readonly service: string,
        public readonly name: string,
        public readonly payload: T
    ) {
        this.id = uuid.generate();
        this.occurredOn = new Date();
    }

}


export interface Payload {
    id: string;
    username: string;
    email: string;
}
export class UserCreatedEvent extends IntegrationEvent<Payload> {
    constructor(payload: Payload) {
        super('accounts-ms', 'com.clonespotify.accounts.users.integration.user-updated', payload);
    }
}
```

 definimos los eventos
```typescript
export interface Payload {
    id: string;
    username: string;
    email: string;
}

export class UserCreatedEvent extends IntegrationEvent<Payload> {
    constructor(payload: Payload) {
        super('accounts-ms', 'com.clonespotify.accounts.users.integration.user-updated', payload);
    }
}
```



```
### Enviar eventos de integración

Ahora dentro del modulo `users` de `accounts-ms` importamos nuestra libreria para instanciar el eventbus

```typescript
@Module({
    // ...more code
    imports:[
        IntegrationEventsModule
    ]
})
export class UsersModule {}
```

Y hcemos uso de `IntegrationEventbus` dentro de nustro servicio UserService

```typescript

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private readonly integrationEventBus: IntegrationEventBus
  ) {}

  async create(user: UserModel): Promise<User> {
    const userCreated = await this.repository.save(user);
    this.integrationEventBus.publish(new UserCreatedEvent({
      id: userCreated.id,
      username: userCreated.username,
      email: userCreated.email
    }));
    return userCreated;
  }


}
```

Con esto los eventos seran enviados al servidor redis y quienes esten a la escucha obtendran los mensajes

### Escuchar eventos de integración

Ahora para escuchar los eventos instaciamos nuestro microservicio Nestjs en las aplicaicones que necesiten los eventos de integracion

```typescript
export function getMicroserviceOptions() {
    return {
        transport: Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASS || undefined
        }
    }
}
```
mailing-ms
```typescript

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MailingMsModule, getMicroserviceOptions());
  await app.listen();
}

```
music-discovery-ms

```typescript
async function bootstrap() {
  
  const app = await NestFactory.create(MusicDiscoveryMsModule);
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(getMicroserviceOptions())
// other features...
  await app.listen(port, () => {
    Logger.log(`Music discovery microservice listen on port: ${port}`, "Main")
  });
  

}
```
Finalmente definos los controladores con su messageapttern y ejecutar la logica de negocio que queramos

Envio de emial de bienvenida al crearse un usuario

```typescript
@Controller()
export class QueueController {
  
  constructor(private readonly email: EmailService) {}

  @MessagePattern('com.clonespotify.accounts.users.integration.user-updated')
  onUserCreated(@Payload() data: UserCreatedEvent, @Ctx() context: RmqContext) {
    Logger.log(`Event received: ${data.name} from ${data.service}`, 'QueueController')
    this.email.notifyUserDetails(data);
  }

}
```
Creacion del catalogo inicial del usuario al crearse un nuevo usuario

```typescript
@Controller()
export class IntegrationController {

    constructor(private readonly catalog: UserCatalogUseCases) {}

    @MessagePattern('com.clonespotify.accounts.users.integration.user-updated')
    onUserCreated(@Payload() event: UserCreatedEvent, @Ctx() context: RedisContext) {
        Logger.log(`Event received: ${event.name} from ${event.service}`, 'IntegrationController')
        this.catalog.createMusicCatalog({
            id: Model.generateUUID(),
            user: {
                id: event.payload.id,
                username: event.payload.username
            }
        })
    }
}
```

Finalmente para ver el ejemplo funcionando ejecuta lo siguietne



```bash
npm run start:infra
npm run start:accounts
npm run start:mailing
npm run start:music-discovery
```

Y envia un curl a `accounts-ms`

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "id": "12345678-1234-1234-1234-123456789abc",
  "username": "john_doe",
  "password": "password123",
  "email": "john.doe@example.com"
}' http://localhost:3013/users

```

Finalmente veras los logs de la aplicaicon
