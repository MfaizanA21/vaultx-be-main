import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { Residence } from 'src/residence/entity/residence.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Residence)
    private readonly residenceRepository: Repository<Residence>,
  ) {}

  async addVehicle(dto: AddVehicleDto, userId: string): Promise<void> {
    const residence = await this.residenceRepository.findOne({
      where: {
        user: {
          userid: userId,
        },
        isPrimary: true,
      },
      relations: ['user'],
    });

    if (!residence) {
      throw new NotFoundException('Primary residence not found for user.');
    }

    const vehicle = this.vehicleRepository.create({
      vehicleName: dto.vehicleName,
      vehicleModel: dto.vehicleModel,
      vehicleType: dto.vehicleType,
      vehicleLicensePlateNumber: dto.vehicleLicensePlateNumber,
      vehicleRFIDTagId: dto.RFIDTagID,
      vehicleColor: dto.vehicleColor,
      residentOwner: residence,
      isGuest: false,
    });

    try {
      await this.vehicleRepository.save(vehicle);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw new InternalServerErrorException('Failed to add vehicle.');
    }
  }

  async getAllVehiclesByUserId(userId: string): Promise<
    {
      vehicleName: string;
      vehicleType: string;
      vehicleRFIDTagId: string;
      vehicleColor: string;
      isGuest: boolean;
    }[]
  > {
    const residences = await this.residenceRepository.find({
      where: { user: { userid: userId } },
    });

    const residenceIds = residences.map((res) => res.id);

    if (residenceIds.length === 0) return [];

    const vehicles = await this.vehicleRepository.find({
      where: {
        residentOwner: {
          id: In(residenceIds),
        },
      },
      relations: ['residentOwner'],
    });

    return vehicles.map((v) => ({
vehicleName: v.vehicleName,
    vehicleModel: v.vehicleModel,  // Add this
    vehicleType: v.vehicleType,
    vehicleLicensePlateNumber: v.vehicleLicensePlateNumber,  // Add this
    vehicleRFIDTagId: v.vehicleRFIDTagId,
    vehicleColor: v.vehicleColor,
    isGuest: v.isGuest,
    vehicleId: v.vehicleId,
    }));
  }
}
