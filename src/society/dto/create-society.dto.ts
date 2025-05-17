import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSocietyDto {
  @ApiProperty({
    description: 'Name of the society',
    example: 'Green Meadows Residents Association',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Address of the society',
    example: 'Chak Shahzad, Islamabad',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    description: 'City of the society',
    example: 'Islamabad',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'State or region of the society',
    example: 'Punjab',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    description: 'Postal code of the society',
    example: '44000',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;
}
