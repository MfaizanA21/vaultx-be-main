import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AddGuestVehicleDto {
  @ApiProperty({ example: 'Toyota Corolla' })
  @IsString()
  vehicleName: string;

  @ApiProperty({ example: '2022' })
  @IsString()
  vehicleModel: string;

  @ApiProperty({ example: 'Sedan' })
  @IsString()
  vehicleType: string;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  vehicleLicensePlateNumber: string;

  @ApiPropertyOptional({ example: 'RFID123456789' })
  @IsOptional()
  @IsString()
  vehicleRFIDTagId?: string;

  @ApiProperty({ example: 'Black' })
  @IsString()
  vehicleColor: string;
}
