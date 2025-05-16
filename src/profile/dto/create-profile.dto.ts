import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';

export enum ResidenceEnum {
  APARTMENT = 'apartment',
  FLAT = 'flat',
  HOUSE = 'house',
}

export enum ResidenceType {
  RENTED = 'rented',
  OWNED = 'owned',
}

export class CreateProfileDTO {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Khan' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: '+923331112222' })
  @IsPhoneNumber('PK')
  phonenumber: string;

  @ApiProperty({ example: '4210112345671' })
  @IsString()
  @Length(13, 13)
  @Matches(/^\d{13}$/)
  cnic: string;

  @ApiProperty({ enum: ResidenceEnum, example: ResidenceEnum.APARTMENT })
  @IsEnum(ResidenceEnum)
  residence: ResidenceEnum;

  @ApiProperty({ enum: ResidenceType, example: ResidenceType.RENTED })
  @IsEnum(ResidenceType)
  residenceType: ResidenceType;

  @ApiProperty({ example: 'B' })
  @IsString()
  block: string;

  @ApiProperty({ example: 'Flat 12, Gulshan View Apartments, Karachi' })
  @IsString()
  address: string;
}
