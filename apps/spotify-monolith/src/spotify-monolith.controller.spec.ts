import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyMonolithController } from './spotify-monolith.controller';
import { SpotifyMonolithService } from './spotify-monolith.service';

describe('SpotifyMonolithController', () => {
  let spotifyMonolithController: SpotifyMonolithController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SpotifyMonolithController],
      providers: [SpotifyMonolithService],
    }).compile();

    spotifyMonolithController = app.get<SpotifyMonolithController>(SpotifyMonolithController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(spotifyMonolithController.getHello()).toBe('Hello World!');
    });
  });
});
