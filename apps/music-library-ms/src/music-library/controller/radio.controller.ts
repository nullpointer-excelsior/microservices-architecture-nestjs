import { Body, Controller, Post, Get , Param, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { RadioService } from "../service/radio.service";
import { CreateRadioRequest } from "../dto/create-radio.request";
import { RadioModel } from "../model/radio.model";

@Controller('radios')
@ApiTags('Radios')
export class RadioController {

  constructor(private radio: RadioService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new radio' })
  @ApiBody({ type: CreateRadioRequest})
  @ApiResponse({ status: 201, description: 'The new readio was created', type: RadioModel })
  async create(@Body() request: CreateRadioRequest) {
    return await this.radio.save(request)
  }

  @Put()
  @ApiOperation({ summary: 'Update a radio' })
  @ApiBody({ description: 'The radio to update', type: RadioModel})
  @ApiResponse({ status: 201, description: 'The radio updated', type: RadioModel})
  update(@Body() radio: RadioModel) {
    return this.radio.update(radio)
  }

  @Put(':radioId/:songId')
  @ApiOperation({ summary: 'Add song to radio' })
  @ApiResponse({ status: 201, description: 'The radio updated' })
  async addSong(@Param('radioId') radioId: string, @Param('songId') songId: string) {
    await this.radio.addSong(radioId, songId)
  }

  @Get('genre/:id')
  @ApiOperation({ summary: 'Get radios by genre ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre' })
  @ApiResponse({ status: 200, description: 'All radios by genre ID', type: [RadioModel] })
  async findByGenre(@Param('id') id: string): Promise<RadioModel[]> {
    return await this.radio.findByGenreId(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all radios' })
  @ApiResponse({ status: 200, description: 'All radios', type: [RadioModel] })
  async findAll(): Promise<RadioModel[]> {
    return await this.radio.findAll()
  }

}