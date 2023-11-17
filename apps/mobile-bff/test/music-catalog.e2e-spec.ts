import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumAPI, ArtistAPI, GenreAPI, SongAPI } from '../../../libs/music-library-api/src';
import { ArtistModel } from '../../../libs/music-library-api/src/model/artist.model';
import { MobileBffModule } from '../src/mobile-bff.module';
import { graphqlRequest } from './utils';

describe('MobileBff (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MobileBffModule],
    })
      .overrideProvider(ArtistAPI)
      .useValue({
        findAll: (): ArtistModel[] => [
          {
            id: "42456925-999C-4DC1-9DF6-ECD441060891",
            name: "journey",
            photo: "photo.jpg",
            biography: "amazing band"
          },
          {
            id: "548913A3-56EC-4D0C-B34F-E6B87225B363",
            name: "bonjovi",
            photo: "photo.jpg",
            biography: "another amazing band"
          }
        ],
        findById: () => ({
          id: "42456925-999C-4DC1-9DF6-ECD441060891",
          name: "journey",
          photo: "photo.jpg",
          biography: "amazing band"
        })
      })
      .overrideProvider(AlbumAPI)
      .useValue({
        findByArtistId: () => [{
          id: "EF1B2BE9-C3CD-4213-8532-B1F6F14540D5",
          title: "frontiers",
          photo: "xxx.jpg"
        }]
      })
      .overrideProvider(SongAPI)
      .useValue({
        findByAlbumId: () => [
          {
            id: "1F52B96E-7B4A-4FA5-88BD-2D46186ED989",
            title: "separate ways",
            video: "video.avi"
          },
          {
            id: "E8DDD874-EE3C-4B6E-85A6-0CFEAA592C79",
            title: "chain reaction",
            video: "video.avi"
          }
        ],
        findByGenreId: () => [
          {
            id: "1F52B96E-7B4A-4FA5-88BD-2D46186ED989",
            title: "separate ways",
            video: "video.avi"
          },
          {
            id: "E8DDD874-EE3C-4B6E-85A6-0CFEAA592C79",
            title: "chain reaction",
            video: "video.avi"
          }
        ]
      })
      .overrideProvider(GenreAPI)
      .useValue({
        findAll: () => [
          {
            id: "AF3FDAF8-407A-41C6-92DC-36618C2D0FCC",
            name: "rock"
          },
          {
            id: "AF3FDAF8-407A-89C6-92DC-36618C2D0FCC",
            name: "metal"
          }
        ],
        findbyId:() => ({
          id: "AF3FDAF8-407A-41C6-92DC-36618C2D0FCC",
          name: "rock"
        })
      })

      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('GraphQL server', () => {

    describe('Artists', () => {

      it('query: artists', async () => {
        const query = graphqlRequest(app)
        const res = await query('{ artists{id name}}')
        const data = res.body.data

        expect(data.artists).toBeDefined()
        expect(data.artists).toHaveLength(2)
        const artists = data.artists.map(a => a.name)
        expect(artists).toContain('journey')
        expect(artists).toContain('bonjovi')
      });

      it('query: artistById', async () => {
        const query = graphqlRequest(app)
        const res = await query(`{ 
        artistById(id: "42456925-999C-4DC1-9DF6-ECD441060891") {
          name
          photo
        }
      }
      `)
        const data = res.body.data
        expect(data.artistById).toBeDefined()
        expect(data.artistById.name).toBe('journey')
      });

      it('resolve: album', async () => {
        const query = graphqlRequest(app)
        const res = await query(`{ 
        artistById(id: "42456925-999C-4DC1-9DF6-ECD441060891") {
          name
          photo
          albums {
            title
          }
        }
      }
      `)
        const data = res.body.data
        expect(data.artistById).toBeDefined()
        expect(data.artistById.name).toBe('journey')
        expect(data.artistById.albums).toHaveLength(1)
      });

    })

    describe('Album', () => {

      it('resolve: songs', async () => {
        const query = graphqlRequest(app)
        const res = await query(`{ 
        artistById(id: "42456925-999C-4DC1-9DF6-ECD441060891") {
          name
          photo
          albums {
            title
            songs {
              title
            }
          }
        }
      }
      `)
        const data = res.body.data
        expect(data.artistById).toBeDefined()
        expect(data.artistById.name).toBe('journey')
        expect(data.artistById.albums).toHaveLength(1)
        expect(data.artistById.albums[0].songs).toHaveLength(2)
      });
    })

    describe('Genre', () => {

      it('query: genres', async () => {
        const query = graphqlRequest(app)
        const res = await query(`{ 
        genres {
          name
        }
      }
      `)
        const data = res.body.data
        expect(data.genres).toBeDefined()
        expect(data.genres).toHaveLength(2)
        expect(data.genres.map(g => g.name)).toContain('rock')
        expect(data.genres.map(g => g.name)).toContain('metal')
      });

      it('resolve: songs', async () => {
        const query = graphqlRequest(app)
        const res = await query(`{ 
        genres {
          name
          songs {
            title
          }
        }
      }
      `)
        const data = res.body.data
        expect(data.genres).toBeDefined()
        expect(data.genres).toHaveLength(2)
        expect(data.genres.map(g => g.name)).toContain('rock')
        expect(data.genres.map(g => g.name)).toContain('metal')
        expect(data.genres[0].songs).toHaveLength(2)
        expect(data.genres[0].songs.map(s => s.title)).toContain('separate ways')
        expect(data.genres[0].songs.map(s => s.title)).toContain('chain reaction')
      });

      it('query: genreById', async () => {
        const query = graphqlRequest(app)
        const res = await query(`{ 
        genreById(id: "C52497F6-85FF-4F01-BC7E-8378E85AD325") {
          name
        }
      }
      `)
        const data = res.body.data
        expect(data.genreById).toBeDefined()
        expect(data.genreById.name).toBe('rock')
  
      });
    })

  })

});
