import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Vehicle } from 'src/vehicle/entity/vehicle.entity';
import { In, Repository } from 'typeorm';
import { Guest } from './entity/guest.entity';
import { Residence } from 'src/residence/entity/residence.entity';
import { AddGuestDto } from './dto/add-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,

    @InjectRepository(Residence)
    private readonly residenceRepository: Repository<Residence>,
  ) {}

  async addGuest(dto: AddGuestDto, userId: string): Promise<void> {
    const {
      guestName,
      guestPhoneNumber,
      eta,
      visitCompleted = false,
      vehicle,
    } = dto;

    const residence = await this.residenceRepository.findOne({
      where: {
        user: { userid: userId },
        isPrimary: true,
      },
      relations: ['user'],
    });

    if (!residence) {
      throw new NotFoundException('Primary residence not found for the user.');
    }

    let guestVehicle: Vehicle | undefined;

    if (vehicle) {
      guestVehicle = this.vehicleRepository.create({
        vehicleName: vehicle.vehicleName,
        vehicleModel: vehicle.vehicleModel,
        vehicleType: vehicle.vehicleType,
        vehicleLicensePlateNumber: vehicle.vehicleLicensePlateNumber,
        vehicleRFIDTagId: vehicle.vehicleRFIDTagId || undefined,
        vehicleColor: vehicle.vehicleColor,
        isGuest: true,
      });

      await this.vehicleRepository.save(guestVehicle);
    }

    const guest = this.guestRepository.create({
      guestName,
      guestPhoneNumber,
      eta: new Date(eta),
      visitCompleted,
      residence,
      guestVehicle: guestVehicle ?? undefined,
    });

    try {
      await this.guestRepository.save(guest);
    } catch (error) {
      console.error('Error saving guest:', error);
      throw new InternalServerErrorException('Failed to register guest.');
    }
  }

  async getGuestsWithVehicleInfo(userId: string): Promise<
    {
      guestId: string;
      guestName: string;
      eta: Date;
      vehicleId?: string;
      vehicleModel?: string;
      vehicleLicensePlateNumber?: string;
      vehicleColor?: string;
      isGuest?: boolean;
    }[]
  > {
    const residences = await this.residenceRepository.find({
      where: { user: { userid: userId } },
    });

    const residenceIds = residences.map((res) => res.id);
    if (!residenceIds.length) return [];

    const guests = await this.guestRepository.find({
      where: { residence: { id: In(residenceIds) } },
      relations: ['guestVehicle', 'residence'],
    });

    return guests.map((g) => ({
      guestId: g.guestId,
      guestName: g.guestName,
      eta: g.eta,
      vehicleId: g.guestVehicle?.vehicleId,
      vehicleModel: g.guestVehicle?.vehicleModel,
      vehicleLicensePlateNumber: g.guestVehicle?.vehicleLicensePlateNumber,
      vehicleColor: g.guestVehicle?.vehicleColor,
      isGuest: g.guestVehicle?.isGuest,
    }));
  }
}
