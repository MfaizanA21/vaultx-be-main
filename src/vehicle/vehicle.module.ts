import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { Residence } from 'src/residence/entity/residence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Residence])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
