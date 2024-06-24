import { Module } from '@nestjs/common';
import { LodgeService } from './lodge.service';
import { LodgeController } from './lodge.controller';
import { Lodge } from 'src/database/entities/lodge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from '../photo/photo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lodge]), PhotoModule],
  controllers: [LodgeController],
  providers: [LodgeService],
})
export class LodgeModule {}
