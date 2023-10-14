import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Radio } from '../../shared/database/entities/radio.entity';

@Injectable()
export class RadioService {
  constructor(
    @InjectRepository(Radio)
    private radioRepository: Repository<Radio>,
  ) {}

  async findAll(): Promise<Radio[]> {
    return await this.radioRepository.find();
  }

  async findOne(id: string): Promise<Radio | undefined> {
    return await this.radioRepository.findOneBy({ id});
  }

  async create(radio: Radio): Promise<Radio> {
    return await this.radioRepository.save(radio);
  }

  async update(radio: Radio): Promise<Radio> {
    return await this.radioRepository.save(radio);
  }

  async delete(id: string): Promise<void> {
    await this.radioRepository.delete(id);
  }
}