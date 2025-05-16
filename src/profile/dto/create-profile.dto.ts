/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  firstname: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  lastname: string;

  @IsString()
  @IsPhoneNumber('PK', {
    message: 'Phone number must be a valid Pakistani number.',
  })
  phonenumber: string;

  @IsString()
  @Length(13, 13, { message: 'CNIC must be exactly 13 digits.' })
  @Matches(/^\d{13}$/, { message: 'CNIC must contain only digits.' })
  cnic: string;

  @IsEnum(ResidenceEnum, {
    message: 'Residence must be apartment, flat, or house.',
  })
  residence: ResidenceEnum;

  @IsEnum(ResidenceType, { message: 'Residence type must be rented or owned.' })
  residenceType: ResidenceType;

  @IsString()
  @IsNotEmpty({ message: 'Block is required.' })
  block: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required.' })
  address: string;
}
