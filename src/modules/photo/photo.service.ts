import { Injectable } from '@nestjs/common';
import { Photo } from '../../database/entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageProvider } from 'src/config/minio.config';
import { PhotoDto } from './dto/photo.dto';
import { dataURLtoFile } from 'src/utils/file';

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
      const file = dataURLtoFile(photoToCreate.data, photoToCreate.id);
      const imgUrl = await this.storageProvider.addImage(file, 'teste.jpeg');
      const photo = this.photoRepository.create({
        lodge: { id: lodgeId },
        order: photoToCreate.order,
        url: imgUrl,
      });
      photoArray.push(photo);
    }

    return this.photoRepository.save(photoArray);
  }
}
