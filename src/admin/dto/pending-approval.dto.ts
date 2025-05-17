import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResidenceDto {
  @ApiPropertyOptional()
  addressLine1?: string;

  @ApiPropertyOptional()
  block?: string;

  @ApiPropertyOptional()
  residence?: string;

  @ApiPropertyOptional()
  residenceType?: string;
}

export class PendingApprovalDto {
  @ApiProperty()
  residentId: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  cnic: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: ResidenceDto })
  residence: ResidenceDto;
}
