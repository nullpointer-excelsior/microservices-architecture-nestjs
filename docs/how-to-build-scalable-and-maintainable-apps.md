
# 🏗️ Building Scalable and Maintainable Applications

In this chapter, we will take note of small tips for building scalable and maintainable applications, which can help you more easily in a possible transition from monolith to microservices. Not all systems in their early stages need a microservices architecture, but if you can apply some good practices, you will save yourself headaches.

## 🎧 Spotify Clone with NestJS as a Proof of Concept

We will build a Spotify clone as an example. Using the following class diagram (borrowed from the internet), we will model a RESTful API with NestJS. This application will be a backend API.

![class-diagram-spotify.jpg](https://i.ibb.co/3rc8bS3/diagrama-clases-spotify.jpg)

Based on this, we will create our backend, which will start as a simple CRUD.

We convert the class design into an ORM entity design.

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

From this foundation, we will build a small project with good practices and tips.

## 📦 1 — Define Your Application in a Modular Way

Build your application in a modular fashion, separating related use cases within a specific context and defining which components will be shared across modules to reuse common code or utility functions. However, these should be small and extensible pieces of software. If you use functions, try to keep them as pure as possible with their unit tests.

**Example:** Spotify Clone Modules:

```bash
 src
├──  accounts
├──  music-library
├──  player
└──  shared
    ├──  database
    └──  decorators

```

We define the main modules `player`, `music-library`, and `accounts`. These will group their use cases, services, repositories, controllers, and data models, while the `shared` module will contain components shared across the application. In this case, the `database` module contains the ORM entities for the application's data model.

```bash
 database
├──  database.module.ts
└──  entities
    ├──  album.entity.ts
    ├──  artist.entity.ts
    ├──  entity.base.ts
    ├──  genre.entity.ts
    ├──  playlist.entity.ts
    ├──  radio.entity.ts
    ├──  song.entity.ts
    └──  user.entity.ts

```

With this approach, each module can implement its own architecture and design. In this example, the `library` module is just a CRUD API for accessing artists, albums, and songs, so the NestJS design guidelines are more than enough. On the other hand, the `player` module may have more complexity in certain use cases, so we can implement a hexagonal architecture isolated within its own module without forcing other parts of the application to adopt it.

**CRUD Example:**

```bash
 music-library
├──  controller
│   ├──  album.controller.ts
│   ├──  artists.controller.ts
│   ├──  genre.controller.ts
│   └──  song.controller.ts
├──  model
│   ├──  album.model.ts
│   ├──  artist.model.ts
│   ├──  genre.model.ts
│   └──  song.model.ts
├──  music-library.module.ts
└──  service
    ├──  album.service.ts
    ├──  artist.service.ts
    ├──  genre.service.ts
    └──  song.service.ts

```

**Hexagonal Architecture Example:**

```bash
 player
├──  application
│   ├──  playlists.use-cases.ts
│   └──  radio.use-cases.ts
├──  domain
│   ├──  factory
│   │   ├──  create-playlist-entity.ts
│   │   └──  create-playlist-model.ts
│   ├──  model
│   │   ├──  genre.model.ts
│   │   ├──  playlist.model.ts
│   │   ├──  radio.model.ts
│   │   ├──  song.model.ts
│   │   └──  user.model.ts
│   └──  service
│       ├──  playlist.service.ts
│       ├──  radio.service.ts
│       ├──  song.service.ts
│       └──  user.service.ts
├──  infrastructure
│   └──  restful-api
│       ├──  controller
│       │   ├──  playlist.controller.ts
│       │   └──  radio.controller.ts
│       └──  dto
│           ├──  create-playlist.request.ts
│           ├──  create-radio.request.ts
│           └──  entity-created.response.ts
└──  player.module.ts
```

## 📡 2 — Define Decoupled Communication Between Modules

When defining a modular architecture, it is very likely that certain use cases will require a service from another module that is not `shared`. This is prone to creating spaghetti code to establish decoupled communication between modules. We can use an in-memory event bus and apply an event-driven architecture.

NestJS provides an [events](https://docs.nestjs.com/techniques/events) module that we can use:

```shell
npm i --save @nestjs/event-emitter
```

We will create a small example based on creating a new Radio when a new album is created.

We define a class representing the event and add it to our `shared` module.

```typescript
export class AlbumCreatedEvent {
	constructor(public album: Album) {}
}
```

Now, when `create()` is called in the `AlbumService` within the `music-library` module, we will emit the event.

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

And now, in our `player` module, we listen for the event.

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

Now our modules are more isolated in responsibilities, including the possibility of having multiple event subscribers.

## 🗄️ 3 — Use Separate Schemas for Each Module in Relational Databases

This approach allows for a more comprehensible logical and physical separation of data and would enable a cleaner migration if we want to move a module to an independent application. In these cases, different schemas for data also give us flexibility.

TypeORM allows us to do this through annotations.

```typescript
@Entity({ schema: "music_library" })
export class Song {
	// ...entity code
}
```

Now each schema will represent a module of our application. The data will have their contexts defined, and we still have the ability to query data across schemas.

## 📐 4 — Know the SOLID Principles

These 5 software design principles applied to object-oriented programming are an excellent way to create maintainable and scalable code. Fortunately, many of these principles are implemented by frameworks like NestJS, Spring, and many similar ones. So if you think you have never applied them, most likely you have stumbled upon them without realizing it. Anyway, here is a brief example of each principle.

### 🎯 Single Responsibility Principle (SRP)

Each class or module should have a single responsibility. For example, `UserService` only has operations to manipulate the `User` model through `Repository` and the component.

```typescript
@Injectable()
export class UserService {
	// ...
}
```

### 🔓 Open/Closed Principle (OCP)

This principle states that classes should be open for extension but closed for modification. For example, if you are not sure which database is right for your application, you can apply the `Entity Repository` pattern to decouple your domain from the defined data storage. This pattern also helps with better unit testing.

```typescript
// Repository contract
export interface SongRepository {
  findAll(): Promise<Song>;    
}
// repository implementation
export class SongPostgresRepository implements SongRepository {
  findAll(): Promise<Song> {
    // code to implement an orm crud
  }
}
// NestJS provider declaration
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

NestJS allows custom providers, so in the definition, our entity is the representation of our data and its associated logic, and the repository is the component that performs read and write operations. This component is just a contract, an interface, which we must implement with the logic associated with the database engine we are using.

### ✂️ Interface Segregation Principle (ISP)

This principle states that interfaces should be as small and specific as possible. This means that an interface implements only its minimum functionality. In the following example, we define an EventDispatcher to send messages, EventListener to listen for events, and EventBus, which inherits both interfaces to create a complete event bus implementation.

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

### 🔄 Dependency Inversion Principle (DIP)

High-level classes should not depend on low-level classes, but on abstractions. NestJS implements this principle in its providers.

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

## 🏁 Conclusion

We addressed these simple recommendations, which can help create scalable and maintainable applications. It will all depend on the case, but when a system can grow, it is better to consider all possible good practices. Every project is different, as is the time given to complete it.
