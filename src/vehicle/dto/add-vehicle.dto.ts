import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddVehicleDto {
  @ApiProperty({
    description: 'Name of the vehicle',
    example: 'Toyota Corolla',
  })
  @IsString()
  vehicleName: string;

  @ApiProperty({ description: 'Model of the vehicle', example: '2022' })
  @IsString()
  vehicleModel: string;

  @ApiProperty({
    description: 'License plate number of the vehicle',
    example: 'ABC-1234',
  })
  @IsString()
  vehicleLicensePlateNumber: string;

  @ApiProperty({ description: 'Type of the vehicle', example: 'Sedan' })
  @IsString()
  vehicleType: string;

  @ApiProperty({
    description: 'RFID Tag ID associated with the vehicle',
    example: 'RFID123456789',
  })
  @IsString()
  RFIDTagID: string;

  @ApiProperty({
    description: 'Color of the vehicle',
    example: 'Red',
  })
  @IsString()
  vehicleColor: string;
}
