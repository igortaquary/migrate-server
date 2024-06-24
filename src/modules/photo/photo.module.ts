import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { StorageProvider } from 'src/config/minio.config';
import { Photo } from 'src/database/entities/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [PhotoService, StorageProvider],
  exports: [PhotoService],
})
export class PhotoModule {}
