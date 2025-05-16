import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { User } from 'src/auth/entities/auth.entity';
import { Residence } from 'src/residence/entity/residence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Residence])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
