import { Controller, Get, Param, Post } from '@nestjs/common';
import { AlbumModel } from '../model/album.model';
import { AlbumService } from '../service/album.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

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
  async findById(@Param('id') id: string): Promise<AlbumModel | undefined> {
    return await this.albumService.findById(id);
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Get all albums by artist ID' })
  @ApiParam({ name: 'id', description: 'The ID of the artist' })
  @ApiResponse({ status: 200, description: 'All albums by artist', type: [AlbumModel] })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findByArtistId(@Param('id') id: string): Promise<AlbumModel[]> {
    return await this.albumService.findByArtistId(id)
  }

}