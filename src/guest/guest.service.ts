/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import * as QRCode from 'qrcode';

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

  async addGuest(
    dto: AddGuestDto,
    userId: string,
  ): Promise<{ qrCodeImage: string }> {
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
      const savedGuest = await this.guestRepository.save(guest);

      // 🔐 Generate QR code with guestId + eta
      const qrPayload = JSON.stringify({
        guestId: savedGuest.guestId,
        eta: savedGuest.eta,
      });

      const qrCodeImage = await QRCode.toDataURL(qrPayload);

      return { qrCodeImage };
    } catch (error) {
      console.error('Error saving guest or generating QR:', error);
      throw new InternalServerErrorException(
        'Failed to register guest or generate QR code.',
      );
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

  async verifyGuest(
    guestId: string,
  ): Promise<{ valid: boolean; reason?: string }> {
    const guest = await this.guestRepository.findOne({
      where: { guestId },
    });

    if (!guest) {
      return { valid: false, reason: 'Guest not found.' };
    }

    if (guest.visitCompleted) {
      return { valid: false, reason: 'Visit already completed.' };
    }

    const now = new Date();
    const eta = new Date(guest.eta);

    const timeDiff = Math.abs(now.getTime() - eta.getTime());
    const oneHour = 1000 * 60 * 60;
    if (timeDiff > oneHour) {
      return { valid: false, reason: 'Guest not within allowed ETA window.' };
    }

    return { valid: true };
  }
}
