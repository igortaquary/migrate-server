import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { StorageProvider } from 'src/config/minio.config';
import { Photo } from 'src/database/entities/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoController } from './photo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [PhotoService, StorageProvider],
  exports: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
