import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Residence } from 'src/residence/entity/residence.entity';
import { Repository } from 'typeorm';
import { CreateProfileDTO } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Residence)
    private readonly residenceRepository: Repository<Residence>,
  ) {}

  async getUserProfile(userId: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
      relations: ['residences'],
    });

    if (!user) return null;

    const { firstname, lastname, phone, cnic } = user;

    return {
      firstname,
      lastname,
      phone,
      cnic,
    };
  }

  async createUserProfile(
    dto: CreateProfileDTO,
    userid: string,
  ): Promise<void> {
    const {
      firstname,
      lastname,
      phonenumber,
      cnic,
      address,
      block,
      residence,
      residenceType,
    } = dto;

    // Find the existing user by userid
    const user = await this.userRepository.findOne({
      where: { userid },
      relations: ['residences'],
    });

    if (!user) {
      throw new ConflictException('User not found.');
    }

    // Check for existing user by CNIC or phone (excluding current user)
    const existingUser = await this.userRepository.findOne({
      where: [
        { cnic, userid: userid },
        { phone: phonenumber, userid: userid },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Another user with this CNIC or phone number already exists.',
      );
    }

    // Update user profile fields
    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phonenumber;
    user.cnic = cnic;

    // Create the residence entity and associate with user
    const residenceEntity = this.residenceRepository.create({
      addressLine1: address,
      block,
      residence,
      residenceType,
      isPrimary: true,
      user,
    });

    // Add the new residence to user's residences
    user.residences = [...(user.residences || []), residenceEntity];

    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new InternalServerErrorException('Failed to update user profile.');
    }
  }
}
