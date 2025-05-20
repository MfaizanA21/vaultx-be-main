import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Society } from './entity/society.entity';
import { CreateSocietyDto } from './dto/create-society.dto';
import { GetSocietyDto } from './dto/get-societies.dto';

@Injectable()
export class SocietyService {
  constructor(
    @InjectRepository(Society)
    private readonly societyRepository: Repository<Society>,
  ) {}
private latestSocietyId: string | null = null;
 async addSociety(dto: CreateSocietyDto): Promise<void> {
  const { name, address, city, state, postalCode } = dto;

  const newSociety = this.societyRepository.create({
    name,
    address,
    city,
    state,
    postalCode,
  });

  try {
    await this.societyRepository.save(newSociety);
    this.latestSocietyId = newSociety.societyId;  // Store the latest ID
  } catch (error) {
    console.error('Error saving society:', (error as Error).message);
    throw new InternalServerErrorException('Failed to create society.');
  }
}

  async getAllSocieties(): Promise<GetSocietyDto[]> {
    try {
      return await this.societyRepository.find();
    } catch (error) {
      console.error('Error fetching societies:', (error as Error).message);
      throw new InternalServerErrorException('Failed to fetch societies.');
    }
  }


  async getLatestSociety(): Promise<GetSocietyDto | null> {
  if (!this.latestSocietyId) {
    return null;
  }
  
  try {
    return await this.societyRepository.findOne({
      where: { societyId: this.latestSocietyId }
    });
  } catch (error) {
    console.error('Error fetching latest society:', (error as Error).message);
    throw new InternalServerErrorException('Failed to fetch latest society.');
  }
}

}
