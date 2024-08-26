import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Photo } from '../../database/entities/photo.entity';
import { StorageProvider } from '../../config/minio.config';
import { PhotoDto } from './dto/photo.dto';
import { dataURLtoFile } from '../../utils/file';

jest.mock('../../utils/file');

describe('PhotoService', () => {
  let service: PhotoService;

  let storageProvider: StorageProvider;

  const photoRepositoryMock = {
    save: jest.fn().mockImplementation((photos) => {
      return photos;
    }),
    create: jest.fn().mockImplementation((photo) => photo),
    delete: jest.fn(),
  };
  const storageProviderMock = {
    init: jest.fn(),
    addImage: jest.fn().mockImplementation(() => 'http://image.url'),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoService,
        {
          provide: getRepositoryToken(Photo),
          useValue: photoRepositoryMock,
        },
        {
          provide: StorageProvider,
          useValue: storageProviderMock,
        },
      ],
    }).compile();

    service = module.get<PhotoService>(PhotoService);

    storageProvider = module.get<StorageProvider>(StorageProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveLodgePhotos', () => {
    it('should create photos', async () => {
      const photos: PhotoDto[] = [{ action: 'create', order: 1, url: '123' }];

      const expectedPhotos = photos.map((p) => ({
        order: p.order,
        url: 'http://image.url',
        lodge: { id: 'lodgeId' },
      }));

      expect(await service.saveLodgePhotos('lodgeId', photos)).toMatchObject(
        expectedPhotos,
      );
      expect(dataURLtoFile).toHaveBeenCalledTimes(1);
      expect(storageProvider.addImage).toHaveBeenCalledTimes(1);
    });

    it('should edit photos', async () => {
      const photos: PhotoDto[] = [{ id: '123', action: 'edit', order: 0 }];

      const expectedPhotos = photos.map((p) => ({
        id: p.id,
        order: p.order,
      }));

      expect(await service.saveLodgePhotos('lodgeId', photos)).toMatchObject(
        expectedPhotos,
      );
      expect(dataURLtoFile).toHaveBeenCalledTimes(0);
      expect(storageProvider.addImage).toHaveBeenCalledTimes(0);
    });

    it('should delete photos', async () => {
      const photos: PhotoDto[] = [{ id: '123', action: 'delete', order: 0 }];

      expect(await service.saveLodgePhotos('lodgeId', photos)).toMatchObject(
        [],
      );
      expect(dataURLtoFile).toHaveBeenCalledTimes(0);
      expect(storageProvider.addImage).toHaveBeenCalledTimes(0);
      expect(storageProvider.deleteImage).toHaveBeenCalledTimes(photos.length);
    });
  });

  describe('check', () => {
    it('should call storageProvider init', async () => {
      await service.check();
      expect(storageProvider.init).toHaveBeenCalledTimes(1);
    });
  });

  describe('savePhoto', () => {
    it('should call storageProvider init', async () => {
      const photoDtoMock: PhotoDto = {
        action: 'create',
        url: 'data:image/png;base64,iV+MsE2416simpU6s+eOLjFvRBolD2v2eOLfCrzXqMizl6fsKdzrlMWJoIGhJZ',
        order: 0,
      };
      await service.savePhoto(photoDtoMock);
      expect(storageProvider.addImage).toHaveBeenCalledTimes(1);
    });
  });
});
