

En este capítulo tomaremos nota de pequeños tips para generar aplicaciones escalables y mantenibles, las cuales podrán ayudarte de manera más sencilla en una posible transición de monolito a microservicios. No todos los sistemas en sus primeros pasos necesitan una arquitectura de microservicios, pero si puedes aplicar un poco de buenas prácticas te ahorrarás dolores de cabeza.

## Spotify clone con NestJs como prueba de concepto

Crearemos un clon de Spotify para ejemplificar. Con el siguiente diagrama de clases robado de internet modelaremos una API Restful con NestJs. Esta aplicación será una API backend.

![diagrama-clases-spotify.jpg](https://i.ibb.co/3rc8bS3/diagrama-clases-spotify.jpg)

En base a esto crearemos nuestro backend, el cual será un simple CRUD en comienzo.

El diseño de clases lo convertimos en un diseño de entidades de ORM.

```typescript
@Entity()
export class Album {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  photo: string;

  @Column()
  year: number;

  @OneToMany(() => Song, song => song.album)
  songs: Song[];

  @ManyToOne(() => Artist, artist => artist.albums)
  artist: Artist

}

@Entity()
export class Artist {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  photo: string;

  @Column()
  biography: string;

  @OneToMany(() => Song, song => song.artist)
  songs: Song[]

  @OneToMany(() => Album, album => album.artist)
  albums: Album[]

}


@Entity()
export class Genre {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Song, song => song.genre)
  songs: Song[];

}

@Entity()
export class Playlist {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @ManyToMany(() => Song)
  @JoinTable()
  songs: Song[];

  @ManyToOne(() => User, user => user.playlists)
  user: User;

}


@Entity()
export class Radio {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Song, (song) => song.radios)
  songs: Song[];

  @ManyToOne(() => Genre, genre => genre.songs)
  genre: Genre

}

@Entity()
export class Song {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  video: string;

  @Column()
  plays: number;

  @Column()
  duration: number;

  @ManyToOne(() => Album, album => album.songs)
  album: Album;

  @ManyToOne(() => Artist, artist => artist.songs)
  artist: Artist;

  @ManyToOne(() => Genre, genre => genre.songs)
  genre: Genre

  @ManyToMany(() => Radio, (radio) => radio.songs)
  @JoinTable()
  radios: Radio[]

}


@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  premium: boolean;

  @OneToMany(() => Playlist, playlist => playlist.user)
  playlists: Playlist[];

}

```

A partir de esta base construiremos un pequeño proyecto con buenas prácticas y tips.

## 1 - Define tu aplicación de forma modular

Crear tu aplicación de forma modular, separa los casos de uso relacionados en un contexto específico y define qué componentes serán compartidos por estos módulos para poder reutilizar código en común o funciones utilitarias. Sin embargo, estos deberían ser piezas de software pequeñas y extensibles. Si utilizamos funciones, tratemos de que sean lo más puras posibles y con sus test unitarios.

**Ejemplo:** Módulos de Spotify clone:

```bash
 src
├──  accounts
├──  music-library
├──  player
└──  shared
    ├──  database
    └──  decorators

```

Definimos los módulos principales `player`, `music-library` y `accounts`. Estos tendrán agrupados sus casos de uso, servicios, repositorios, controladores y modelos de datos, mientras que el módulo `shared` contendrá los componentes compartidos por la aplicación. En este caso, el módulo `database` contiene las entidades ORM del modelo de datos de la aplicación.

```bash
 database
├──  database.module.ts
└──  entities
    ├──  album.entity.ts
    ├──  artist.entity.ts
    ├──  entity.base.ts
    ├──  genre.entity.ts
    ├──  playlist.entity.ts
    ├──  radio.entity.ts
    ├──  song.entity.ts
    └──  user.entity.ts

```

Ahora, con este enfoque, cada módulo puede implementar su propia arquitectura y diseño. En este ejemplo, el módulo `library` es solo un API CRUD para acceder a artistas, álbumes y canciones, por lo que las guías de diseño de NestJs nos bastan y sobran. En cambio, el módulo `player` puede tener mayor complejidad en ciertos casos de uso, por lo que podemos implementar una arquitectura hexagonal aislada en su propio módulo sin que otras partes de la aplicación se vean obligadas a implementarla.

**Ejemplo de CRUD:**

```bash
 music-library
├──  controller
│   ├──  album.controller.ts
│   ├──  artists.controller.ts
│   ├──  genre.controller.ts
│   └──  song.controller.ts
├──  model
│   ├──  album.model.ts
│   ├──  artist.model.ts
│   ├──  genre.model.ts
│   └──  song.model.ts
├──  music-library.module.ts
└──  service
    ├──  album.service.ts
    ├──  artist.service.ts
    ├──  genre.service.ts
    └──  song.service.ts

```

**Ejemplo Arquitectura Hexagonal:**

```bash
 player
├──  application
│   ├──  playlists.use-cases.ts
│   └──  radio.use-cases.ts
├──  domain
│   ├──  factory
│   │   ├──  create-playlist-entity.ts
│   │   └──  create-playlist-model.ts
│   ├──  model
│   │   ├──  genre.model.ts
│   │   ├──  playlist.model.ts
│   │   ├──  radio.model.ts
│   │   ├──  song.model.ts
│   │   └──  user.model.ts
│   └──  service
│       ├──  playlist.service.ts
│       ├──  radio.service.ts
│       ├──  song.service.ts
│       └──  user.service.ts
├──  infrastructure
│   └──  restful-api
│       ├──  controller
│       │   ├──  playlist.controller.ts
│       │   └──  radio.controller.ts
│       └──  dto
│           ├──  create-playlist.request.ts
│           ├──  create-radio.request.ts
│           └──  entity-created.response.ts
└──  player.module.ts
```

## 2 - Definir una comunicación entre módulos desacoplada 

Al definir una arquitectura modular, es muy probable que ciertos casos de uso nos obliguen a requerir algún servicio de otro módulo que no sea `shared`. Esto es propenso a crear código espagueti para establecer una comunicación desacoplada entre módulos. Podemos hacer uso de un event bus en memoria y aplicar una arquitectura orientada a eventos.

NestJs nos provee un módulo de [eventos](https://docs.nestjs.com/techniques/events) el cual podemos hacer uso:

```shell
npm i --save @nestjs/event-emitter
```

Crearemos un pequeño ejemplo basado en la creación de una nueva Radio cuando un nuevo álbum es creado.

Definimos una clase que representa el evento y lo agregamos a nuestro módulo `shared`.

```typescript
export class AlbumCreatedEvent {
	constructor(public album: Album) {}
}
```

Ahora, cuando en el módulo `music-library` se hace un llamado al `create()` del servicio `AlbumService`, emitiremos el evento.

```typescript
@Injectable()
export class AlbumService {

	constructor(
		@InjectRepository(Album) private albumRepository: Repository<Album>,
		@InjectRepository(Song) private songRepository: Repository<Song>,
		@InjectRepository(Artist) private artistRepository: Repository<Artist>,
		private eventEmitter: EventEmitter2
	) { }
  
	async create(request: CreateAlbumRequest) {
		const songs = await this.songRepository.find({ where: { id: In(request.songIds)}})
		const artist = await this.artistRepository.findOneBy({ id: request.artistId })
		
		const albumCreated = await this.albumRepository.save({
			title: request.title,
			photo: request.photo,
			artist: artist,
			year: request.year,
			songs
		})
		
		this.eventEmitter.emit('library.album-created', new AlbumCreatedEvent(
			albumCreated
		))
		
		return albumCreated
	}
}
```

Y ahora, en nuestro módulo `player`, escuchamos el evento.

```typescript
@Injectable()
export class NewAlbumListener {

	constructor(private radio: RadioUseCases) {}

	@OnEvent('library.album-created', { async: true })
	async onNewAlbum(event: AlbumCreatedEvent) {
		await this.radio.createLatestAmazingAlbumsRadio(event.album)
	}
}
```

Ahora, nuestros módulos quedan más aislados en responsabilidades, incluyendo la posibilidad de tener múltiples suscriptores a eventos.

## 3 - Utilizar esquemas separados por cada módulo para bases de datos relacionales

Este enfoque nos permite una separación lógica y física de los datos más comprensible y nos permitiría una migración más limpia si un módulo lo queremos pasar a una aplicación independiente. En estos casos, diferentes esquemas para los datos también nos dan la flexibilidad.

TypeORM nos permite hacer esto mediante anotaciones.

```typescript
@Entity({ schema: "music_library" })
export class Song {
	// ...entity code
}
```

Ahora, cada esquema representará un módulo de nuestra aplicación. Los datos tendrán sus contextos definidos y aún así nos da la posibilidad de consultar los datos entre esquemas.

## 4 - Conoce los principios SOLID

Estos 5 principios de diseño de software son aplicados a la programación orientada a objetos y es una excelente manera de crear código mantenible y escalable. Afortunadamente, muchos de estos principios son aplicados por frameworks como NestJs, Spring y muchos similares. Por lo que, si piensas que nunca los has aplicado, lo más probable es que te hayas topado sin darte cuenta. De todas formas, aquí un breve ejemplo de cada principio.

### Principio de responsabilidad única (SRP)

Cada clase o módulo debe tener una sola responsabilidad. Por ejemplo, `UserService` solo tiene operaciones para manipular el modelo de `User` mediante `Repository` y el componente.

```typescript
@Injectable()
export class UserService {
	// ...
}
```

### Principio de abierto/cerrado (OCP)

Este principio establece que las clases deben ser abiertas para la extensión, pero cerradas para la modificación. Por ejemplo, si no estás seguro de qué base de datos es la indicada en tu aplicación, puedes aplicar el patrón `Entity Repository` para desacoplar tu dominio del almacenamiento de datos definido. Este patrón también ayuda a un mejor testing unitario.

```typescript
// Repository contract
export interface SongRepository {
  findAll(): Promise<Song>;    
}
// repository implementation
export class SongPostgresRepository implements SongRepository {
  findAll(): Promise<Song> {
    // code to implement a orm crud
  }
}
// NesJs provider declaration
@Module({
    providers: [
      {
        provide: "SONG_REPOSITORY",
        useClass: SongPostgresRepository
      }
    ]    
})
export PlayerModule {}
// Repository injection
@Injectable()
export class SongUseCases {
  
  constructor(@Inject("SONG_REPOSITORY") private songRepository: SongRepository) {}
}
```

NestJs no permite providers personalizados, así que en la definición, nuestra entidad es la representación de nuestros datos y su lógica asociada, y repository es el componente que realiza operaciones de escritura y lectura. Este componente es solo un contrato, una interfaz, la cual debemos implementar con la lógica asociada al motor de base de datos que estemos usando.

### Principio de segregación de interfaz (ISP)

Este principio establece que las interfaces deben ser lo más pequeñas y específicas posible. Esto quiere decir que una interfaz implementa su mínima funcionalidad. En el siguiente ejemplo, definimos un EventDispatcher para enviar mensajes, EventListener para escuchar eventos y EventBus, el cual hereda ambas interfaces para crear una implementación completa de un event bus.

```typescript
import { Observable, Subject, filter, iif } from 'rxjs';
import { v4 as uuid } from 'uuid';

/**
 * Represents a domain event with a specific data payload.
 */
export abstract class DomainEvent<D, E extends string> {
    readonly datetime: Date = new Date();
    readonly id = uuid()
    abstract name: E
    constructor(public readonly data: D) { }
}

/**
 * Defines the contract for an event dispatcher.
 */
export interface EventDispatcher<E extends string> {
    /**
     * Dispatches a domain event to appropriate listeners.
     * @param event The domain event to dispatch.
     */
    dispatch<T extends DomainEvent<any, E>>(event: T): void;
}

/**
 * Defines the contract for an event listener.
 */
export interface EventListener<E extends string> {
    /**
     * Subscribes to events of a specific name or all events.
     * @param name The name of the event to subscribe to (optional).
     * @returns An observable stream of events.
     */
    onEvent<T extends DomainEvent<any, E>>(name?: E): Observable<T>
}

/**
 * Defines the contract for an event bus that acts as both a dispatcher and a listener.
 */
export interface EventBus<E extends string> extends EventListener<E>, EventDispatcher<E> {

}

/**
 * An implementation of EventBus using RxJS.
 */
export class RxjsEventBus<E extends string> implements EventBus<E> {

    private events$ = new Subject<DomainEvent<any, E>>()

    onEvent<T extends DomainEvent<any, E>>(eventName?: E): Observable<T> {
        return iif(
            () => eventName !== undefined,
            this.events$.pipe(filter(event => eventName === event.name)),
            this.events$.asObservable()
        ) as Observable<T>;
    }

    dispatch<T extends DomainEvent<any, E>>(event: T): void {
        this.events$.next(event)
    }

}
```

### Principio de inversión de dependencias (DIP)

Las clases de alto nivel no deben depender de clases de bajo nivel, sino de abstracciones. NestJs implementa este principio en sus providers.

```typescript
@Injectable()
export class PlayListUseCases {
	
	constructor(
		private user: UserService,
		private song: SongService,
		private playlist: PlaylistService
	) { }
	
}
```

## Conclusión 

Abordamos estas simples recomendaciones, las cuales pueden ayudar a crear aplicaciones escalables y mantenibles. Todo dependerá del caso, pero cuando un sistema puede crecer, es mejor considerar todas las buenas prácticas posibles. Cada proyecto es un mundo, al igual que el tiempo que nos dan para poder realizar un proyecto.

