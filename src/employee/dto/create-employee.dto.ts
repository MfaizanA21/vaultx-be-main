import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  // 👤 User Fields

  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Khan' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '+923001234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: '4210112345671' })
  @IsString()
  @IsNotEmpty()
  cnic: string;

  // 🛠️ Employee Fields

  @ApiProperty({
    description: 'Internal role of the employee',
    example: 'Security Guard',
  })
  @IsString()
  @IsNotEmpty()
  internalRole: string;

  @ApiPropertyOptional({ example: 'Security' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Night' })
  @IsString()
  @IsOptional()
  shift?: string;

  @ApiPropertyOptional({ example: '2023-05-15' })
  @IsDateString()
  @IsOptional()
  joiningDate?: string;
}
