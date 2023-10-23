import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GenreModel } from '../model/genre.model';
import { GenreService } from '../service/genre.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateGenreRequest } from '../dto/create-genre.request';

@Controller('genres')
@ApiTags('Genres')
export class GenreController {

  constructor(private genreService: GenreService) { }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'All genres', type: [GenreModel] })
  async findAll(): Promise<GenreModel[]> {
    return await this.genreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre' })
  @ApiResponse({ status: 200, description: 'The genre', type: GenreModel })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  async findById(@Param('id') id: string): Promise<GenreModel> {
    return await this.genreService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a genre' })
  @ApiBody({ description: 'The genre to create', type: CreateGenreRequest })
  @ApiResponse({ status: 201, description: 'The newly created genre', type: CreateGenreRequest })
  create(@Body() genre: CreateGenreRequest) {
    return this.genreService.save(genre)
  }

  @Put()
  @ApiOperation({ summary: 'Update a genre' })
  @ApiBody({ description: 'The genre to update', type: GenreModel})
  @ApiResponse({ status: 201, description: 'The genre updated', type: GenreModel})
  update(@Body() genre: GenreModel) {
    return this.genreService.update(genre)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre' })
  @ApiResponse({ status: 200, description: 'The genre deleted' })
  delete(@Param('id') id: string) {
    return this.genreService.delete(id)
  }

}