import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Residence } from 'src/residence/entity/residence.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Residence)
    private readonly residenceRepository: Repository<Residence>,
  ) {}

  async getUserProfile(userId: string): Promise<{
    firstname: string;
    lastname: string;
    phone: string;
    cnic: string;
    residence?: {
      addressLine1?: string;
      block?: string;
      residence?: string;
      residenceType?: string;
    };
  } | null> {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
      relations: ['residences'],
    });

    if (!user) return null;

    const { firstname, lastname, phone, cnic } = user;

    const primaryResidence = user.residences.find((res) => res.isPrimary);

    return {
      firstname: firstname ?? '',
      lastname: lastname ?? '',
      phone: phone ?? '',
      cnic: cnic ?? '',
      residence: primaryResidence
        ? {
            addressLine1: primaryResidence.addressLine1,
            block: primaryResidence.block,
            residence: primaryResidence.residence,
            residenceType: primaryResidence.residenceType,
          }
        : undefined,
    };
  }

  async getAllUsersProfile(): Promise<{
    firstname: string;
    lastname: string;
    phone: string;
    cnic: string;
    residence?: {
      addressLine1?: string;
      block?: string;
      residence?: string;
      residenceType?: string;
    };
  }[]> {
    const users = await this.userRepository.find({
      relations: ['residences'],
    });

    return users.map((user) => {
      const primaryResidence = user.residences?.find((r) => r.isPrimary);

      return {
        firstname: user.firstname ?? '',
        lastname: user.lastname ?? '',
        phone: user.phone ?? '',
        cnic: user.cnic ?? '',
        residence: primaryResidence
          ? {
              addressLine1: primaryResidence.addressLine1,
              block: primaryResidence.block,
              residence: primaryResidence.residence,
              residenceType: primaryResidence.residenceType,
            }
          : undefined,
      };
    });
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

  async updateUserPassword(
    dto: UpdatePasswordDto,
    userId: string,
  ): Promise<void> {
    const { currentPassword, newPassword } = dto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });

    if (!user) {
      throw new ConflictException('User not found.');
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ConflictException('Old password is incorrect.');
    }

    // Hash and save new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating user password:', error);
      throw new InternalServerErrorException('Failed to update user password.');
    }
  }

  async updateProfile(dto: UpdateProfileDto, userId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const residenceRepo = manager.getRepository(Residence);

      const user = await userRepo.findOne({ where: { userid: userId } });

      if (!user) {
        throw new ConflictException('User not found.');
      }

      const {
        firstname,
        lastname,
        phonenumber,
        cnic,
        residence,
        residenceType,
        block,
        address,
      } = dto;

      // Optional conflict check
      if (cnic || phonenumber) {
        const whereConditions = [
          cnic ? { cnic, userid: Not(userId) } : undefined,
          phonenumber ? { phone: phonenumber, userid: Not(userId) } : undefined,
        ].filter(Boolean) as any[];

        const existingUser = await userRepo.findOne({ where: whereConditions });

        if (existingUser) {
          throw new ConflictException(
            'Another user with this CNIC or phone number already exists.',
          );
        }
      }

      // Apply user updates
      if (firstname !== undefined) user.firstname = firstname;
      if (lastname !== undefined) user.lastname = lastname;
      if (phonenumber !== undefined) user.phone = phonenumber;
      if (cnic !== undefined) user.cnic = cnic;

      await userRepo.save(user);

      // Update residence
      const residenceEntity = await residenceRepo.findOne({
        where: { user: { userid: userId }, isPrimary: true },
        relations: ['user'],
      });

      if (!residenceEntity) {
        throw new ConflictException('Primary residence not found for user.');
      }

      if (residence !== undefined) residenceEntity.residence = residence;
      if (residenceType !== undefined)
        residenceEntity.residenceType = residenceType;
      if (block !== undefined) residenceEntity.block = block;
      if (address !== undefined) residenceEntity.addressLine1 = address;

      await residenceRepo.save(residenceEntity);
    });
  }
}
