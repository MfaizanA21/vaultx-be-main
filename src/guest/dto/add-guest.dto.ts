import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { AddGuestVehicleDto } from './add-guest-vehicle.dto';

export class AddGuestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  guestName: string;

  @ApiProperty({ example: '+923001234567' })
  @IsString()
  guestPhoneNumber: string;

  @ApiProperty({ example: '2025-05-17T10:30:00Z' })
  @IsDateString()
  eta: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  visitCompleted?: boolean;

  @ApiPropertyOptional({
    description: 'Optional vehicle details',
    type: AddGuestVehicleDto,
  })
  @ValidateNested()
  @Type(() => AddGuestVehicleDto)
  @IsOptional()
  vehicle?: AddGuestVehicleDto;
}
