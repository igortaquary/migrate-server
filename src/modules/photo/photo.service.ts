import { Injectable } from '@nestjs/common';
import { Photo } from '../../database/entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageProvider } from '../../config/minio.config';
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
    /* Possíveis casos: 
      1. Foto nova, nunca salva anteriormente
      2. Editar ordem da foto
      3. Apagar foto
      4. Não fazer nada
    */
    const photosToCreate = photos.filter((photo) => photo.action === 'create');
    const photosToEdit = photos
      .filter((photo) => photo.action === 'edit')
      .map((p) => ({ id: p.id, order: p.order }));

    const photosToDelete = photos.filter((photo) => photo.action === 'delete');

    for (const photoToDelete of photosToDelete) {
      try {
        await this.storageProvider.deleteImage(photoToDelete.url);
        await this.photoRepository.delete(photoToDelete.id);
      } catch (error) {
        console.error(error);
      }
    }

    for (const photoToEdit of photosToEdit) {
      await this.photoRepository.update(photoToEdit.id, {
        order: photoToEdit.order,
      });
    }

    for (const photoToCreate of photosToCreate) {
      const photo = this.photoRepository.create({
        id: randomUUID(),
        lodgeId,
        order: photoToCreate.order,
      });
      const file = dataURLtoFile(photoToCreate.url, photo.id);
      const imgUrl = await this.storageProvider.addImage(
        file,
        getFilename(file),
      );
      photo.url = imgUrl;
      await this.photoRepository.insert(photo);
    }
  }

  check() {
    return this.storageProvider.init();
  }

  savePhoto(data: PhotoDto) {
    const file = dataURLtoFile(data.url, 'teste-' + data.order);
    return this.storageProvider.addImage(file, getFilename(file));
  }
}
