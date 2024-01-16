# Simplificando el Testing e2e con Object Mother

¿Alguna vez te has enfrentado a la tarea de crear objetos mock para tus pruebas unitarias o e2e y has sentido que estabas escribiendo demasiado código repetitivo? Aquí les traigo un pequeño tip. Existe un patrón de diseño que puede hacer que esta tarea sea mucho más fácil y eficiente: el patrón de diseño Object Mother.

## ¿Qué es Object Mother?

El Object Mother es un patrón de diseño de creación de objetos utilizado en el desarrollo de software. Su objetivo principal es simplificar la creación de objetos mock o de prueba al proporcionar métodos y funciones que devuelven instancias preconfiguradas de objetos.

### Ventajas Principales:

- **Reusabilidad**: Con Object Mother, puedes reutilizar las configuraciones de objetos en varias pruebas, evitando la duplicación de código y mejorando el mantenimiento.

- **Claridad en las Pruebas**: Al utilizar un método específico para crear objetos en lugar de escribir la configuración en cada prueba, se mejora la claridad y legibilidad del código de prueba.

- **Facilita la Mantenibilidad** : Si la estructura de tus objetos cambia, solo necesitas actualizar el código en un lugar: el método de creación en el Object Mother. Esto simplifica enormemente la tarea de mantener las pruebas.

Echando un vistazo a nuestra arquitectura de **Spotify-clone**, veremos cómo implementar object-mother para facilitar las pruebas e2e, las cuales son las más complejas y que más tiempo toma poder escribirlas.

## Utilizando ObjectMother

Como habíamos visto anteriormente, Object Mother nos ayuda a crear una plantilla personalizable de nuestros objetos complejos. Es una especie de factory o builder con parámetros preestablecidos, lo que nos permite crear dummy data con el menor esfuerzo.

Crearemos una función ObjectMother para poder crear los datos de prueba que insertaremos en una base de datos para crear pruebas e2e del servicio `music-library-ms`. Crearemos la función `createArtistEntity`, la cual obtendrá el componente de tipo repository de `typeorm` y devolverá otra función la cual tiene parámetros por defecto del objeto a crear.

```typescript
// apps/music-library-ms/test/utils.ts

// La función createArtistEntity acepta una instancia de la aplicación Nest.js (INestApplication).
export function createArtistEntity(app: INestApplication) {
  
  // Obtiene el repositorio de la entidad "Artist" utilizando el token del repositorio.
  const repository = app.get<Repository<Artist>>(getRepositoryToken(Artist));

  // La función createEntity es la que realmente se exporta y se utiliza para crear entidades de artistas.
  return function createEntity({ name = "Journey", biography = "Amazing band", photo = "artist.jpg" }: Partial<CreateArtistRequest>) {
    
    // Utiliza el repositorio para guardar una nueva entidad "Artist" con las propiedades proporcionadas o valores predeterminados.
    return repository.save({
      name,
      biography,
      photo,
    });

  }
}
```

Entonces, al crear un artista, esta función guardará uno preconfigurado, el cual podemos adaptar sobrescribiendo el parámetro deseado.

```typescript
// apps/music-library-ms/src/test/artist.e2e-spec.ts

it('/artists (GET): get all artists', async () => {

  const create = createArtistEntity(app)
  await create({}) // deafult = journey
  await create({ name: "BonJovi" })
  await create({ name: "Scorpions" })

  return request(app.getHttpServer())
    .get('/artists')
    .expect(200)
    .then(res => res.body)
    .then(body => expect(body).toHaveLength(3))

});

```

Bajo esta misma lógica, podemos crear objetos de tipo mock relacionados entre sí para crear estructuras de datos más complejas.

```typescript
// apps/music-library-ms/src/test/songs.e2e-spec.ts

it('/songs (GET): get all songs', async () => {

  const createArtist = createArtistEntity(app)
  const createAlbum = createAlbumEntity(app)
  const createSong = createSongEntity(app)
  const createGenre = createGenreEntity(app)
  const genre = await createGenre({ name: "rock" })
  const jouney = await createArtist({ name: "journey" })
  const frontiers = await createAlbum({ title: "fronties", artistId: jouney.id })
  await createSong({ title: "song1", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })
  await createSong({ title: "song2", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })
  await createSong({ title: "song3", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })

  const res = await request(app.getHttpServer())
    .get(`/songs`)
    .expect(HttpStatus.OK)

  expect(res.body).toHaveLength(3)
  const titles = res.body.map(song => song.title)
  expect(titles).toContain('song1')
  expect(titles).toContain('song2')
  expect(titles).toContain('song3')

})

```

En esta prueba e2e creamos un objeto artista con álbumes y canciones.

# Conclusión:

El patrón de diseño Object Mother puede ser una herramienta invaluable para simplificar y mejorar la eficiencia en la creación de objetos mock en tus pruebas unitarias. Al adoptar este enfoque, no solo reducirás la redundancia en tu código de prueba, sino que también facilitarás la mantenibilidad y comprensión de tus pruebas.