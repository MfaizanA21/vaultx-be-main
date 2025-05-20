import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SocietyService } from './society.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { CreateSocietyDto } from './dto/create-society.dto';
import { GetSocietyDto } from './dto/get-societies.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('society')
export class SocietyController {
  constructor(private readonly societyService: SocietyService) {}

  @Post('add')
  async addSociety(@Body() dto: CreateSocietyDto): Promise<void> {
    return this.societyService.addSociety(dto);
  }

  @Get('all')
  async getAllSocieties(): Promise<GetSocietyDto[]> {
    return this.societyService.getAllSocieties();
  }

  @Get('latest')
async getLatestSociety(): Promise<GetSocietyDto | null> {
  return this.societyService.getLatestSociety();
}

}
