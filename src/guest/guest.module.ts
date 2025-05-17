import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entity/guest.entity';
import { Vehicle } from 'src/vehicle/entity/vehicle.entity';
import { Residence } from 'src/residence/entity/residence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Vehicle, Residence])],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
