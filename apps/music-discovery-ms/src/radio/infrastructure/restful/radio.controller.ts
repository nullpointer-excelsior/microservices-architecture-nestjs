import { Body, Controller, Param, ParseUUIDPipe, Post, Put, Get } from '@nestjs/common';
import { CreateRadioDTO } from '../../application/dto/create-radio.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Radio } from '../../domain/model/radio.model';
import { RadioUseCases } from '../../application/radio.use-cases';
import { UpdateSongsDTO } from '../../application/dto/update-songs.dto';

@Controller('radios')
export class RadioController {

    constructor(private radio: RadioUseCases) { }

    @Post()
    @ApiOperation({ summary: 'Create a new radio' })
    @ApiBody({ type: CreateRadioDTO })
    @ApiResponse({ status: 201, description: 'The new radio was created', type: Radio })
    create(@Body() createRadio: CreateRadioDTO) {
        return this.radio.create(createRadio)
    }

    @Put(':id/songs')
    @ApiOperation({ summary: "Add song to radio" })
    @ApiResponse({ status: 201, description: "The song was added" })
    updateSongs(@Param('id', ParseUUIDPipe) id: string, @Body() updateSongs: UpdateSongsDTO) {
        this.radio.updateSongs({ radioId: id, ...updateSongs })
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get by ID' })
    @ApiResponse({ status: 200, description: 'Get a Radio by id', type: Radio })
    async findById(@Param('id') id: string): Promise<Radio> {
        return await this.radio.findById(id)
    }

    @Get()
    @ApiOperation({ summary: 'Get all radios' })
    @ApiResponse({ status: 200, description: 'All radios', type: [Radio] })
    async findAll(): Promise<Radio[]> {
        return await this.radio.findAll()
    }
}
