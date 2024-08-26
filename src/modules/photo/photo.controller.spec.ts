import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PhotoDto } from './dto/photo.dto';

describe('PhotoController', () => {
  let controller: PhotoController;
  let service: PhotoService;

  const mockPhotoService = {
    check: jest.fn().mockImplementation(() => 'ok'),
    savePhoto: jest.fn().mockImplementation((photo: PhotoDto) => {
      return { id: '1', ...photo };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
      providers: [
        {
          provide: PhotoService,
          useValue: mockPhotoService,
        },
      ],
    }).compile();

    controller = module.get<PhotoController>(PhotoController);
    service = module.get<PhotoService>(PhotoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should call check service', async () => {
      expect(await controller.check()).toEqual('ok');
      expect(service.check).toHaveBeenCalledTimes(1);
    });
  });

  describe('addImage', () => {
    it('should call savePhoto service', async () => {
      const photoDtoMock: PhotoDto = {
        action: 'create',
        order: 1,
        url: 'base64,123',
      };
      expect(await controller.addImage(photoDtoMock)).toBeDefined();
      expect(service.savePhoto).toHaveBeenCalledTimes(1);
    });
  });
});
