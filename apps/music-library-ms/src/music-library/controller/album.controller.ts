import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAlbumRequest } from '../dto/create-album.request';
import { AlbumModel } from '../model/album.model';
import { AlbumService } from '../service/album.service';

@Controller('albums')
@ApiTags('Albums')
export class AlbumController {

  constructor(private albumService: AlbumService) { }

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({ status: 200, description: 'All albums', type: [AlbumModel] })
  async findAll(): Promise<AlbumModel[]> {
    return await this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an album by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the album' })
  @ApiResponse({ status: 200, description: 'The album', type: AlbumModel })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async findById(@Param('id') id: string): Promise<AlbumModel> {
    return await this.albumService.findById(id);
  }

  @Get('artist/:id')
  @ApiOperation({ summary: 'Get all albums by artist ID' })
  @ApiParam({ name: 'id', description: 'The ID of the artist' })
  @ApiResponse({ status: 200, description: 'All albums by artist', type: [AlbumModel] })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findByArtistId(@Param('id') id: string): Promise<AlbumModel[]> {
    return await this.albumService.findByArtistId(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new album' })
  @ApiBody({ type: AlbumModel })
  @ApiResponse({ status: 201, description: 'The newly created album', type: CreateAlbumRequest })
  async create(@Body() album: CreateAlbumRequest): Promise<AlbumModel> {
    return await this.albumService.save(album);
  }

}