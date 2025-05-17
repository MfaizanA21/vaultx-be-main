import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { ResidenceModule } from './residence/residence.module';
import { ProfileModule } from './profile/profile.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { GuestModule } from './guest/guest.module';
import { AdminModule } from './admin/admin.module';
import { SocietyModule } from './society/society.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig()),
    AuthModule,
    ResidenceModule,
    ProfileModule,
    VehicleModule,
    GuestModule,
    AdminModule,
    SocietyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
