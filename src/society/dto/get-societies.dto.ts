import { ApiProperty } from '@nestjs/swagger';

export class GetSocietyDto {
  @ApiProperty({ example: 'soc_abcd1234efgh5678' })
  societyId: string;

  @ApiProperty({ example: 'Green Meadows Residents Association' })
  name: string;

  @ApiProperty({ example: 'Chak Shahzad, Islamabad' })
  address: string;

  @ApiProperty({ example: 'Islamabad', required: false })
  city?: string;

  @ApiProperty({ example: 'Punjab', required: false })
  state?: string;

  @ApiProperty({ example: '44000', required: false })
  postalCode?: string;
}
