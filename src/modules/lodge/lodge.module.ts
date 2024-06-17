import { Module } from '@nestjs/common';
import { LodgeService } from './lodge.service';
import { LodgeController } from './lodge.controller';
import { Lodge } from 'src/database/entities/lodge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Lodge])],
  controllers: [LodgeController],
  providers: [LodgeService],
})
export class LodgeModule {}
