import { Controller } from '@nestjs/common';
import { ResidenceService } from './residence.service';

@Controller('residence')
export class ResidenceController {
  constructor(private readonly residenceService: ResidenceService) {}
}
