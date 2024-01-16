# Simplificando el testing unitario con arquitectura hexagonal.

El testing con arquitectura hexagonal nos provee una manera limpia de crear pruebas unitarias en nuestro código sin acoplarnos a las librerías de testing o cualquier otra tecnología no relacionada a los casos de uso o reglas de negocio que queramos implementar.

El testing unitario nos ayudará a evitar muchos dolores de cabeza y tiene un montón de beneficios. Al tratar de aplicarlo en códigos que no siguen buenas prácticas se hace complejo y en muchas ocasiones duplica o triplica el tiempo de desarrollo de una funcionalidad con pruebas incluidas. En esta ocasión te voy a decir por qué las arquitecturas clean son tan valoradas por la ingeniería de software sobre proyectos complejos.

## Porque hexagonal ayuda la test unitario

La elección de una arquitectura hexagonal para desarrollar nuestras aplicaciones no solo tiene beneficios durante la implementación, sino que también mejora significativamente el proceso de pruebas unitarias. Aquí te presento algunas razones clave:

- **Desacoplamiento del Código de Dominio de Frameworks o Librerías:**
   La arquitectura hexagonal nos permite mantener nuestro código de dominio completamente desacoplado de frameworks o librerías externas. Este desacoplamiento facilita la creación de pruebas unitarias, ya que podemos concentrarnos en evaluar la lógica de negocio sin preocuparnos por detalles de implementación específicos de la tecnología.

- **Azúcar Sintáctica para las Pruebas del Código de Dominio:**
   La estructura limpia y desacoplada de la arquitectura hexagonal proporciona un azúcar sintáctica para escribir pruebas del código de dominio. Esto se traduce en pruebas más legibles y mantenibles, ya que podemos enfocarnos en expresar directamente los casos de uso y las reglas de negocio sin distracciones innecesarias.

- **Creación de Pruebas Acorde a Casos de Uso y Reglas de Negocio:**
   La flexibilidad inherente de la arquitectura hexagonal nos permite crear pruebas que se alinean directamente con los casos de uso y las reglas de negocio de nuestra aplicación. Esto garantiza que nuestras pruebas sean más precisas y relevantes, abordando de manera efectiva los aspectos críticos del sistema.

- **Creación Sencilla de Mocks:**
   En el entorno de pruebas unitarias, la necesidad de crear mocks es común. La arquitectura hexagonal simplifica este proceso, permitiéndonos generar mocks de componentes de forma sencilla. Esto facilita la simulación de escenarios específicos para validar el comportamiento del sistema.

- **Mocks sin Acoplamiento con Tecnologías:**
   La creación de mocks dentro de la arquitectura hexagonal se realiza de manera que no se acoplan con tecnologías específicas. Esto significa que nuestras pruebas unitarias no dependerán de detalles de implementación tecnológica, lo que las hace más robustas y menos propensas a fallos debido a cambios en el entorno tecnológico.

Ahora, para ejemplificar los beneficios de la Clean Architecture, nos ayudaremos con **Spotify-clone**.


 ## Ejemplo con el microservicio `music-discovery-ms`.

Nuestro ejemplo práctico se basa en el módulo `radio` de la aplicación `music-discovery-ms`, el microservicio encargado de descubrir nueva música para el usuario en nuestra **Spotify-clone-architecture**. Ahora nos centraremos en el caso de uso de `updateSongs`, el cual actualiza las canciones de una radio de Spotify (playlist de varios artistas con temática especial).
 
 ### Arquitectura

 La estructura del módulo `radio` de la aplicación `music-discovery-ms` es la siguiente:

 ```bash
  radio
├──  application
│   ├──  dto
│   │   ├──  create-radio.dto.ts
│   │   ├──  update-songs-by-radio.dto.ts
│   │   └──  update-songs.dto.ts
│   ├──  radio.use-cases.spec.ts
│   └──  radio.use-cases.ts
├──  domain
│   ├──  model
│   │   ├──  radio.model.ts
│   │   └──  song.model.ts
│   └──  repositories
│       └──  radio.repository.ts
├──  infrastructure
│   ├──  mongo
│   │   ├──  repositories
│   │   │   └──  mongo-radio.repository.ts
│   │   └──  schemas
│   │       ├──  radio.schema.ts
│   │       └──  song.schema.ts
│   ├──  restful
│   │   └──  radio.controller.ts
│   └──  validate-model.ts
└──  radio.module.ts
 ```

- **Application**: Casos de uso del módulo. También puede contener ciertas clases de tipo servicio.
- **Domain**: Modelo de entidades de dominio del módulo `radio`. El dominio se encarga de especificar el contrato o la especificación de las operaciones de persistencia de las entidades, mediante puertos (en este caso `radio.repository.ts`).
- **Infraestructura**: Todos los componentes de software que implementarán los adaptadores de las capas de dominio o aplicación. En este caso, tenemos el adaptador `mongo-radio.repository.ts`. Esta capa también contendrá los componentes de servicios como conexión a base de datos, servidor http o cualquier otra dependencia tecnológica.

### Caso de uso **updateSongs**

Aquí nos enfocaremos en el caos de uso de `updateSongs()` el cual recibe un DTO `UpdateSongsByRadioDTO` que posee la id de la radio a actualizar y las canciones que se actualizarán de la radio.

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

    @NotFoundExceptionIfUndefined('Radio no encontrada')
    private findRadioById(id: string) {
        return this.repository.findById(id)
    }

    @ValidateArgumentModel
    private async updateRadio(radio: Radio) {
        return this.repository.update(radio)
    }

}
```

## Dominio

Las entidades del módulo son `Radio` y `Song`. Estas entidades utilizan la librería `class-validator` para validar el estado de sus valores. Si bien nos acoplamos a una librería de terceros, en este caso usar `class-validator` nos da más ventajas que desventajas, ya que las validaciones no tienen un acople fuerte gracias al patrón `@Decorator`, el cual agrega nuevas funcionalidades a los componentes sin tener que tocar el código principal de nuestras clases.

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
### Puertos del dominio

Se ha definido el puerto `RadioRepository`, el cual describe las operaciones de persistencia.

```typescript
// apps/music-discovery-ms/src/radio/domain/repositories/radio.repository.ts
export abstract class RadioRepository {
    abstract findById(id: string): Promise<Radio>
    abstract findAll(): Promise<Radio[]>
    abstract save(radio: Radio): Promise<Radio>
    abstract update(radio: Radio): Promise<Radio>
}

```
### Infraestructura del modulo `radio`

La infraestructura está dada por un módulo de persistencia basado en `mongodb`, donde definimos el adaptador `MongoRadioRepository`, el cual hereda del puerto `RadioRepository` e implementa la lógica de persistencia asociada a la librería `mongoose`.

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
Finalmente, tenemos un módulo `restful` para crear nuestro servidor HTTP que expondrá nuestros casos de uso mediante una API REST.

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
## Definiendo las pruebas unitarias

Definimos el siguiente set de pruebas:

- **Songs updated**: Las canciones deben actualizarse

- **Throw NotFoundExeption if radio is not in database**: Si tratamos de actualizar una radio que no existe debe arrojar un `NotFoundExeption`.


Archivo `radio.use-case.spec.ts`

```typescript
// apps/music-discovery-ms/src/radio/application/radio.use-cases.spec.ts

import { NotFoundException } from "@nestjs/common"
import { RadioUseCases } from "./radio.use-cases"
import { RadioRepository } from "../domain/repositories/radio.repository"

describe('RadioUseCase', () => {

    let usecase: RadioUseCases

    // Prueba para verificar que se lance una NotFoundException si la radio no está en la base de datos.
    it('updateSongs: throw NotFoundExeption if radio is not in database', async () => {
        
        // Se crea un mock del repositorio con un método `findById` que devuelve undefined.
        const mockRepository = {
            findById: jest.fn().mockReturnValue(undefined),
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn()
        }
        usecase = new RadioUseCases(mockRepository)

        // Se define un objeto para actualizar las canciones de una radio inexistente.
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
        // Se espera que llamar al método `updateSongs` lance una NotFoundException.
        await expect(usecase.updateSongs(updateSongs)).rejects.toThrow(NotFoundException);

    })

    // Prueba para verificar que las canciones se actualizan correctamente en una radio existente.
    it('updateSongs: songs updated', async () => {
        // Se crea un mock del repositorio con un método `findById` que devuelve información de una radio existente.
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

        // Se define un objeto para actualizar las canciones de una radio existente.
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
Este set de pruebas nos garantizará el comportamiento de nuestro caso de uso. Ahora, si analizamos el siguiente código:

```typescript
// Se crea un mock del repositorio con un método `findById` que devuelve undefined.
const mockRepository: RadioRepository = {
    findById: jest.fn().mockReturnValue(undefined),
    save: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn()
}

```
Hemos creado el mock de `RadioRepository` con el contrato específico para las operaciones de persistencia. Si en vez de crear `RadioRepository` hubiéramos hecho uso de las clases proporcionadas directamente por la librería de MongoDB como en este ejemplo:

```typescript
// model: Model<RadioDocument> componente complejo de crear un Mock por su gran cantidad de metodos que dependiendo de neustro caso de uso usaremos unos pocos.
constructor(@InjectModel(RadioDocument.name) private model: Model<RadioDocument>) {
    super()
}
```

El mock no sería sencillo, ya que estos componentes de tipo repositorio vienen con un montón de métodos que no nos aportan nada en el contexto de casos de uso o reglas de negocio que queramos probar. Para crear pruebas unitarias de forma limpia y sencilla, solo debemos probar las partes de forma aislada y, dependiendo del caso, definir el comportamiento específico del mock. 

Y ahora, gracias a la inyección de dependencias, podemos crear nuestro Caso de uso `RadioUseCases`:

```typescript
const usecase = new RadioUseCases(mockRepository)
```
Este enfoque nos permite no tener que usar las dependencias o componentes de testing que nos ofrece NestJs, ya que estos nos generarían un montón de boilerplate en testing unitario.


Si quieres ejecutar las pruebas unitarias, ejecuta lo siguiente:

```bash
npm run test
```

 ## Conclusión

Al dar un pequeño vistazo a un set de pruebas unitarias sobre una arquitectura limpia, examinamos las ventajas, simplicidad, elegancia y desacople del código en aspectos más de infraestructura como pueden ser HTTP, MongoDB, Nestjs o cualquier otro componente tecnológico. Este enfoque nos asegura crear un código más mantenible y escalable.


