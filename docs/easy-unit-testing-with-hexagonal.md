# 🧩 Simplifying Unit Testing with Hexagonal Architecture

Testing with hexagonal architecture provides a clean way to create unit tests in our code without coupling to testing libraries or any other technology unrelated to the use cases or business rules we want to implement.

Unit testing will help you avoid many headaches and has a ton of benefits. Trying to apply it to code that does not follow good practices becomes complex and often doubles or triples the development time of a feature with included tests. This time I will tell you why clean architectures are so valued by software engineering for complex projects.

## 💡 Why Hexagonal Helps Unit Testing

Choosing a hexagonal architecture to develop our applications not only has benefits during implementation but also significantly improves the unit testing process. Here are some key reasons:

- **Decoupling Domain Code from Frameworks or Libraries:**
   Hexagonal architecture allows us to keep our domain code completely decoupled from frameworks or external libraries. This decoupling makes it easier to create unit tests since we can focus on evaluating business logic without worrying about technology-specific implementation details.

- **Syntactic Sugar for Domain Code Testing:**
   The clean and decoupled structure of hexagonal architecture provides syntactic sugar for writing domain code tests. This translates to more readable and maintainable tests since we can focus on directly expressing use cases and business rules without unnecessary distractions.

- **Creating Tests Aligned with Use Cases and Business Rules:**
   The inherent flexibility of hexagonal architecture allows us to create tests that align directly with the use cases and business rules of our application. This ensures our tests are more precise and relevant, effectively addressing critical aspects of the system.

- **Easy Mock Creation:**
   In the unit testing environment, the need to create mocks is common. Hexagonal architecture simplifies this process, allowing us to easily generate component mocks. This facilitates the simulation of specific scenarios to validate system behavior.

- **Mocks Without Technology Coupling:**
   Mock creation within hexagonal architecture is done in a way that does not couple to specific technologies. This means our unit tests will not depend on technological implementation details, making them more robust and less prone to failures due to changes in the technology environment.

Now, to exemplify the benefits of Clean Architecture, we will use **Spotify-clone**.


 ## 📦 Example with the `music-discovery-ms` Microservice

Our practical example is based on the `radio` module of the `music-discovery-ms` application, the microservice responsible for discovering new music for users in our **Spotify-clone-architecture**. We will focus on the `updateSongs` use case, which updates the songs of a Spotify radio (a playlist of various artists with a special theme).
 
 ### 🏗️ Architecture

 The structure of the `radio` module in the `music-discovery-ms` application is as follows:

 ```bash
  radio
├──  application
│   ├──  dto
│   │   ├──  create-radio.dto.ts
│   │   ├──  update-songs-by-radio.dto.ts
│   │   └──  update-songs.dto.ts
│   ├──  radio.use-cases.spec.ts
│   └──  radio.use-cases.ts
├──  domain
│   ├──  model
│   │   ├──  radio.model.ts
│   │   └──  song.model.ts
│   └──  repositories
│       └──  radio.repository.ts
├──  infrastructure
│   ├──  mongo
│   │   ├──  repositories
│   │   │   └──  mongo-radio.repository.ts
│   │   └──  schemas
│   │       ├──  radio.schema.ts
│   │       └──  song.schema.ts
│   ├──  restful
│   │   └──  radio.controller.ts
│   └──  validate-model.ts
└──  radio.module.ts
 ```

- **Application**: Module use cases. It may also contain certain service-type classes.
- **Domain**: Domain entity models for the `radio` module. The domain is responsible for specifying the contract or specification of entity persistence operations through ports (in this case `radio.repository.ts`).
- **Infrastructure**: All software components that will implement the adapters for the domain or application layers. In this case, we have the adapter `mongo-radio.repository.ts`. This layer will also contain service components such as database connections, HTTP servers, or any other technological dependency.

### 🎯 Use Case **updateSongs**

Here we will focus on the `updateSongs()` use case which receives a DTO `UpdateSongsByRadioDTO` containing the ID of the radio to update and the songs that will be updated in the radio.

```typescript
// apps/music-discovery-ms/src/radio/application/radio.use-case.ts
@Injectable()
export class RadioUseCases {

    constructor(private repository: RadioRepository) {}

    create(dto: CreateRadioDTO) {
        return this.repository.save(dto)
    }

    findById(id: string) {
        return this.repository.findById(id)
    }

    async updateSongs(dto: UpdateSongsByRadioDTO) {
        return this.findRadioById(dto.radioId)
            .then(radio => Radio.updateSongs(radio, dto.songs))
            .then(radio => this.updateRadio(radio))
    }

    async findAll() {
       return this.repository.findAll()
    }

    @NotFoundExceptionIfUndefined('Radio not found')
    private findRadioById(id: string) {
        return this.repository.findById(id)
    }

    @ValidateArgumentModel
    private async updateRadio(radio: Radio) {
        return this.repository.update(radio)
    }

}
```

## 🏛️ Domain

The module entities are `Radio` and `Song`. These entities use the `class-validator` library to validate the state of their values. Although we are coupling to a third-party library, using `class-validator` gives us more advantages than disadvantages in this case, since validations do not have strong coupling thanks to the `@Decorator` pattern, which adds new functionality to components without having to touch the main code of our classes.

```typescript
// apps/music-discovery-ms/src/radio/domain/model/radio.model.ts
export class Radio {

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the radio' })
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The name of the radio' })
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Song)
    @ApiProperty({ description: 'Songs of the radio', type:[Song] })
    songs: Song[]

    static create({ id, name, songs }: { id: string, name: string, songs: Song[]}) {
        const radio = new Radio()
        radio.id = id
        radio.name = name
        radio.songs = songs
        return radio
    }
    
    static updateSongs(radio: Radio, songs: Song[]): Radio {
        radio.songs = songs
        return radio
    }

}

// apps/music-discovery-ms/src/radio/domain/model/song.model.ts
export class Song {

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the song' })
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The title of the song' })
    title: string;

    @IsString()
    @ApiProperty({ description: 'The artist name of the song' })
    artist: string
    
    @IsString()
    @ApiProperty({ description: 'The album name of the song' })
    album: string

    @IsString()
    @ApiProperty({ description: 'The genre of the song' })
    genre: string

    static create({id, title, artist, album, genre }: { id: string, title: string, artist: string, album: string, genre: string }){
        const song = new Song()
        song.id = id
        song.title = title
        song.album = album
        song.artist = artist
        song.genre = genre
        return song
    }

}
```
### 🔌 Domain Ports

The `RadioRepository` port has been defined, which describes the persistence operations.

```typescript
// apps/music-discovery-ms/src/radio/domain/repositories/radio.repository.ts
export abstract class RadioRepository {
    abstract findById(id: string): Promise<Radio>
    abstract findAll(): Promise<Radio[]>
    abstract save(radio: Radio): Promise<Radio>
    abstract update(radio: Radio): Promise<Radio>
}

```
### 🏗️ Infrastructure of the `radio` Module

The infrastructure is provided by a persistence module based on `mongodb`, where we define the adapter `MongoRadioRepository`, which inherits from the `RadioRepository` port and implements the persistence logic associated with the `mongoose` library.

```typescript
// apps/music-discovery-ms/src/radio/infrastructure/mongo/repositories/mongo-radio.repository.ts

@Injectable()
export class MongoRadioRepository extends RadioRepository {
    
    constructor(@InjectModel(RadioDocument.name) private model: Model<RadioDocument>) {
        super()
    }

    async save(radio: Radio): Promise<Radio> {
        const songs = radio.songs.map(s => ({ 
            _id: s.id, 
            title: s.title, 
            album: s.album,
            artist: s.artist,
            genre: s.genre
        }))
        const radioCreated = new this.model({
            ...radio,
            _id: radio.id,
            songs: songs
        })
        await radioCreated.save()
        return radio
    }

    async findById(id: string): Promise<Radio> {
        const radioFound = await this.model.findById(id)
        return Radio.create({ 
            id: radioFound.id,
            name: radioFound.name,
            songs: radioFound.songs.map(s => Song.create({ 
                id: s.id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        })
    }

    async findAll(): Promise<Radio[]> {
        return (await this.model.find()).map(doc => Radio.create({
            id: doc.id,
            name: doc.name,
            songs: doc.songs.map(s => Song.create({ 
                id: s._id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        }))
    }

    async update(radio: Radio): Promise<Radio> {
        const songs = radio.songs.map(s => ({ 
            _id: s.id, 
            title: s.title, 
            album: s.album,
            artist: s.artist,
            genre: s.genre
        }))
        const radioUpdated = await this.model.findByIdAndUpdate(radio.id, {
            ...radio,
            songs
        }, { new: true })
        
        return Radio.create({ 
            id: radioUpdated.id,
            name: radioUpdated.name,
            songs: radioUpdated.songs.map(s => Song.create({ 
                id: s.id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        })
    }

}

```
Finally, we have a `restful` module to create our HTTP server that will expose our use cases through a REST API.

```typescript
// apps/music-discovery-ms/src/radio/infrastructure/restful/radio.controller.ts

@ApiTags('Radios')
@Controller('radios')
export class RadioController {

    constructor(private radio: RadioUseCases) { }

    @Put(':id/songs')
    @ApiOperation({ summary: "Add song to radio" })
    @ApiResponse({ status: 201, description: "The song was added" })
    updateSongs(@Param('id', ParseUUIDPipe) id: string, @Body() updateSongs: UpdateSongsDTO) {
        this.radio.updateSongs({ radioId: id, ...updateSongs })
    }
    // other methods
}
```
## 🧪 Defining Unit Tests

We define the following test set:

- **Songs updated**: Songs must be updated

- **Throw NotFoundException if radio is not in database**: If we try to update a radio that does not exist, it should throw a `NotFoundException`.


File `radio.use-case.spec.ts`

```typescript
// apps/music-discovery-ms/src/radio/application/radio.use-cases.spec.ts

import { NotFoundException } from "@nestjs/common"
import { RadioUseCases } from "./radio.use-cases"
import { RadioRepository } from "../domain/repositories/radio.repository"

describe('RadioUseCase', () => {

    let usecase: RadioUseCases

    // Test to verify that a NotFoundException is thrown if the radio is not in the database.
    it('updateSongs: throw NotFoundException if radio is not in database', async () => {
        
        // A mock of the repository is created with a `findById` method that returns undefined.
        const mockRepository = {
            findById: jest.fn().mockReturnValue(undefined),
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn()
        }
        usecase = new RadioUseCases(mockRepository)

        // An object is defined to update the songs of a non-existent radio.
        const updateSongs = {
            radioId: "A48BCD55-B248-4377-8BCD-E9687768BA07",
            songs: [{
                id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
                title: "runaway",
                album: "bonjovi",
                artist: "bonjovi",
                genre: "rock"
            }]
        }
        // We expect calling `updateSongs` to throw a NotFoundException.
        await expect(usecase.updateSongs(updateSongs)).rejects.toThrow(NotFoundException);

    })

    // Test to verify that songs are correctly updated on an existing radio.
    it('updateSongs: songs updated', async () => {
        // A mock of the repository is created with a `findById` method that returns information of an existing radio.
        const mockRepository: RadioRepository = {
            findById: jest.fn().mockReturnValue({
                id: 'A48BCD55-B248-4377-8BCD-E9687768BA07',
                name: "rock radio",
                songs: []
            }),
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn()
        }
        usecase = new RadioUseCases(mockRepository)

        // An object is defined to update the songs of an existing radio.
        const updateSongs = {
            radioId: "A48BCD55-B248-4377-8BCD-E9687768BA07",
            songs: [{
                id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
                title: "runaway",
                album: "bonjovi",
                artist: "bonjovi",
                genre: "rock"
            }]
        }
        await usecase.updateSongs(updateSongs)
        expect(mockRepository.update).toBeCalledTimes(1)
    })
})
```
This test set will guarantee the behavior of our use case. Now, if we analyze the following code:

```typescript
// A mock of the repository is created with a `findById` method that returns undefined.
const mockRepository: RadioRepository = {
    findById: jest.fn().mockReturnValue(undefined),
    save: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn()
}

```
We have created the mock of `RadioRepository` with the specific contract for persistence operations. If instead of creating `RadioRepository` we had used the classes provided directly by the MongoDB library as in this example:

```typescript
// model: Model<RadioDocument> complex component to create a Mock due to its large number of methods, of which we will only use a few depending on our use case.
constructor(@InjectModel(RadioDocument.name) private model: Model<RadioDocument>) {
    super()
}
```

The mock would not be simple, since these repository-type components come with a ton of methods that do not contribute anything in the context of use cases or business rules we want to test. To create clean and simple unit tests, we should only test parts in isolation and, depending on the case, define the specific behavior of the mock.

And now, thanks to dependency injection, we can create our `RadioUseCases` use case:

```typescript
const usecase = new RadioUseCases(mockRepository)
```
This approach allows us to avoid having to use the testing dependencies or components that NestJS offers us, since these would generate a lot of boilerplate in unit testing.


If you want to run the unit tests, execute the following:

```bash
npm run test
```

 ## 🏁 Conclusion

By taking a small look at a set of unit tests on a clean architecture, we examined the advantages, simplicity, elegance, and decoupling of the code from more infrastructure-related aspects such as HTTP, MongoDB, NestJS, or any other technological component. This approach ensures creating more maintainable and scalable code.
