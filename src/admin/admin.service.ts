import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Residence } from 'src/residence/entity/residence.entity';
import { Repository } from 'typeorm';
import { PendingApprovalDto } from './dto/pending-approval.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Residence)
    private residenceRepository: Repository<Residence>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['residences'],
    });
  }

  async approveUser(residentID: string): Promise<void> {
    const residence = await this.residenceRepository.findOne({
      where: { id: residentID },
      relations: ['user'],
    });

    if (!residence) {
      throw new NotFoundException('Residence not found for the given ID.');
    }

    residence.isApprovedBySociety = true;

    try {
      await this.residenceRepository.save(residence);
    } catch (error) {
      console.error(
        'Error approving user residence:',
        (error as Error).message,
      );
      throw new InternalServerErrorException(
        'Failed to approve user residence.',
      );
    }
  }

  async getPendingApprovals(): Promise<PendingApprovalDto[]> {
    try {
      const residences = await this.residenceRepository.find({
        where: { isApprovedBySociety: false },
        relations: ['user'],
      });

      if (!residences || residences.length === 0) {
        throw new NotFoundException('No pending approvals found.');
      }

      return residences.map((res) => ({
        residentId: res.id,
        firstname: res.user?.firstname ?? '',
        lastname: res.user?.lastname ?? '',
        cnic: res.user?.cnic ?? '',
        email: res.user?.email ?? '',
        phone: res.user?.phone ?? '',
        residence: {
          addressLine1: res.addressLine1 ?? '',
          block: res.block ?? '',
          residence: res.residence,
          residenceType: res.residenceType,
        },
      }));
    } catch (error) {
      console.error(
        'Error fetching pending approvals:',
        (error as Error).message,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch pending approvals.',
      );
    }
  }
}
