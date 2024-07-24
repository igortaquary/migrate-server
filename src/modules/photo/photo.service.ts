import { Injectable } from '@nestjs/common';
import { Photo } from '../../database/entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageProvider } from 'src/config/minio.config';
import { PhotoDto } from './dto/photo.dto';
import { dataURLtoFile, getFilename } from '../../utils/file';
import { randomUUID } from 'crypto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private storageProvider: StorageProvider,
  ) {}

  async saveLodgePhotos(lodgeId: string, photos: PhotoDto[]) {
    const photosToCreate = photos.filter((photo) => !photo.id);
    const photosToEdit = photos
      .filter((photo) => photo.id)
      .map((p) => ({ id: p.id, order: p.order }));

    const photoArray: Partial<Photo>[] = [...photosToEdit];

    for (const photoToCreate of photosToCreate) {
      const photo = this.photoRepository.create({
        id: randomUUID(),
        lodge: { id: lodgeId },
        order: photoToCreate.order,
      });
      const file = dataURLtoFile(photoToCreate.url, photo.id);
      const imgUrl = await this.storageProvider.addImage(
        file,
        getFilename(file),
      );
      photo.url = imgUrl;
      photoArray.push(photo);
    }

    return this.photoRepository.save(photoArray);
  }

  check() {
    return this.storageProvider.init();
  }

  savePhoto(data: PhotoDto) {
    const file = dataURLtoFile(data.url, 'teste-' + data.order);
    return this.storageProvider.addImage(file, getFilename(file));
  }
}
