import { Module } from '@nestjs/common';
import { SocietyService } from './society.service';
import { SocietyController } from './society.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Society } from './entity/society.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Society])],
  controllers: [SocietyController],
  providers: [SocietyService],
})
export class SocietyModule {}
