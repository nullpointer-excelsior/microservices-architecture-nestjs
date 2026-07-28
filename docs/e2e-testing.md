# ✅ Simplifying E2E Testing with Object Mother

Have you ever faced the task of creating mock objects for your unit or e2e tests and felt like you were writing too much repetitive code? Here is a small tip. There is a design pattern that can make this task much easier and more efficient: the Object Mother design pattern.

## ❓ What is Object Mother?

Object Mother is an object creation design pattern used in software development. Its main goal is to simplify the creation of mock or test objects by providing methods and functions that return preconfigured object instances.

### ⚡ Main Advantages:

- **Reusability**: With Object Mother, you can reuse object configurations across multiple tests, avoiding code duplication and improving maintainability.

- **Clarity in Tests**: By using a specific method to create objects instead of writing the configuration in each test, the clarity and readability of the test code is improved.

- **Facilitates Maintainability**: If the structure of your objects changes, you only need to update the code in one place: the creation method in the Object Mother. This greatly simplifies the task of maintaining tests.

Taking a look at our **Spotify-clone** architecture, we will see how to implement object-mother to facilitate e2e testing, which are the most complex and time-consuming to write.

## 🛠️ Using ObjectMother

As we saw earlier, Object Mother helps us create a customizable template for our complex objects. It is a kind of factory or builder with preset parameters, which allows us to create dummy data with minimal effort.

We will create an ObjectMother function to create the test data that we will insert into a database to create e2e tests for the `music-library-ms` service. We will create the `createArtistEntity` function, which will obtain the `typeorm` repository-type component and return another function that has default parameters for the object to create.

```typescript
// apps/music-library-ms/test/utils.ts

// The createArtistEntity function accepts a Nest.js application instance (INestApplication).
export function createArtistEntity(app: INestApplication) {
  
  // Gets the repository for the "Artist" entity using the repository token.
  const repository = app.get<Repository<Artist>>(getRepositoryToken(Artist));

  // The createEntity function is what is actually exported and used to create artist entities.
  return function createEntity({ name = "Journey", biography = "Amazing band", photo = "artist.jpg" }: Partial<CreateArtistRequest>) {
    
    // Uses the repository to save a new "Artist" entity with the provided properties or default values.
    return repository.save({
      name,
      biography,
      photo,
    });

  }
}
```

So when creating an artist, this function will save a preconfigured one, which we can adapt by overriding the desired parameter.

```typescript
// apps/music-library-ms/src/test/artist.e2e-spec.ts

it('/artists (GET): get all artists', async () => {

  const create = createArtistEntity(app)
  await create({}) // default = journey
  await create({ name: "BonJovi" })
  await create({ name: "Scorpions" })

  return request(app.getHttpServer())
    .get('/artists')
    .expect(200)
    .then(res => res.body)
    .then(body => expect(body).toHaveLength(3))

});

```

Following the same logic, we can create related mock objects to build more complex data structures.

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

In this e2e test, we create an artist object with albums and songs.

# 🏁 Conclusion

The Object Mother design pattern can be an invaluable tool for simplifying and improving efficiency in creating mock objects for your unit tests. By adopting this approach, you will not only reduce redundancy in your test code but also facilitate the maintainability and comprehension of your tests.
