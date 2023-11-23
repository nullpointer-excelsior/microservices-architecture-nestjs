import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SongModel } from '../model/song.model';
import { SongService } from '../service/song.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateSongRequest } from '../dto/create-song.request';

@Controller('songs')
@ApiTags('Songs')
export class SongController {

  constructor(private songService: SongService) { }

  @Get()
  @ApiOperation({ summary: 'Get all songs' })
  @ApiResponse({ status: 200, description: 'All songs', type: [SongModel] })
  async findAll(): Promise<SongModel[]> {
    return await this.songService.findAll();
  }

  @Get('search')
  @ApiQuery({ name: 'ids', description: 'Array of song IDs', type: [String], required: true, explode: true })
  @ApiResponse({ status: 200, description: 'Found songs by IDs', type: [SongModel], isArray: true })
  async findByIdIn(@Query('ids') ids: string[]): Promise<SongModel[]> {
    console.log('findByIdIn', ids)
    return this.songService.findByIdIn(ids);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a song by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the song' })
  @ApiResponse({ status: 200, description: 'The song', type: SongModel })
  @ApiResponse({ status: 404, description: 'Song not found' })
  async findById(@Param('id') id: string): Promise<SongModel | undefined> {
    return await this.songService.findById(id);
  }

  @Get('artist/:id')
  @ApiOperation({ summary: 'Get all songs by artist ID' })
  @ApiParam({ name: 'id', description: 'The ID of the artist' })
  @ApiResponse({ status: 200, description: 'All songs by artist', type: [SongModel] })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findByArtistId(@Param('id') artistId: string): Promise<SongModel[]> {
    return await this.songService.findByArtistId(artistId)
  }

  @Get('album/:id')
  @ApiOperation({ summary: 'Get all songs by album ID' })
  @ApiParam({ name: 'id', description: 'The ID of the album' })
  @ApiResponse({ status: 200, description: 'All songs by album', type: [SongModel] })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async findByAlbumId(@Param('id') albumId: string): Promise<SongModel[]> {
    return await this.songService.findByAlbumId(albumId)
  }

  @Get('genre/:id')
  @ApiOperation({ summary: 'Get all songs by genre ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre' })
  @ApiResponse({ status: 200, description: 'All songs by genre', type: [SongModel] })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  async findByGenre(@Param('id') genreId: string): Promise<SongModel[]> {
    return await this.songService.findByGenre(genreId)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new song' })
  @ApiBody({ type: CreateSongRequest })
  @ApiResponse({ status: 201, description: 'The newly created song', type: CreateSongRequest })
  async create(@Body() request: CreateSongRequest): Promise<SongModel> {
    return await this.songService.save(request);
  }

}