import { Test, TestingModule } from '@nestjs/testing';
import { LodgeController } from './lodge.controller';
import { LodgeService } from './lodge.service';
import { PhotoService } from '../photo/photo.service';
import { CreateLodgeDto } from './dto/create-lodge.dto';

describe('LodgeController', () => {
  let controller: LodgeController;
  let service: LodgeService;
  let photoService: PhotoService;

  const mockLodgeService = {
    search: jest.fn().mockImplementation(() => {
      return [{ id: '456', title: 'Lodge 1' }];
    }),
    listByUserId: jest.fn().mockImplementation(() => {
      return [{ id: '456', title: 'Lodge 1' }];
    }),
    findOne: jest.fn().mockImplementation(() => {
      return { id: '456', title: 'Lodge 1' };
    }),
    getContactInfo: jest.fn().mockImplementation(() => {
      return { phone: '123456789', email: 'email@email.com' };
    }),
    create: jest.fn().mockImplementation(() => {
      return '100';
    }),
    update: jest.fn().mockImplementation(() => {
      return {
        id: '100',
      };
    }),
    remove: jest.fn().mockImplementation(() => {
      return '456';
    }),
  };

  const mockPhotoService = {
    saveLodgePhotos: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LodgeController],
      providers: [
        { provide: LodgeService, useValue: mockLodgeService },
        { provide: PhotoService, useValue: mockPhotoService },
      ],
    }).compile();

    controller = module.get<LodgeController>(LodgeController);
    service = module.get<LodgeService>(LodgeService);
    photoService = module.get<PhotoService>(PhotoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should search without params', async () => {
      expect(await controller.search({ page: 1 })).toEqual([
        { id: '456', title: 'Lodge 1' },
      ]);
      expect(service.search).toHaveBeenCalled();
    });
  });

  describe('listFromUser', () => {
    const jwtData = {
      sub: '123',
      id: '123',
      email: 'email',
      name: 'name',
    };
    it('should return user lodges', async () => {
      expect(await controller.listFromUser(jwtData)).toEqual([
        { id: '456', title: 'Lodge 1' },
      ]);
      expect(service.listByUserId).toHaveBeenCalledWith('123');
    });
  });

  describe('findOne', () => {
    it('should return lodge', async () => {
      expect(await controller.findOne('456')).toEqual({
        id: '456',
        title: 'Lodge 1',
      });
      expect(service.findOne).toHaveBeenCalledWith('456');
    });
  });

  describe('getContactInfo', () => {
    it('should return lodge contact info', async () => {
      expect(await controller.getContactInfo('456')).toEqual({
        phone: '123456789',
        email: 'email@email.com',
      });
      expect(service.getContactInfo).toHaveBeenCalledWith('456');
    });
  });

  const jwtData = {
    sub: '123',
    id: '123',
    email: 'email',
    name: 'name',
  };

  describe('create', () => {
    it('should create lodge', async () => {
      const mockCreateLodgeDto = { title: 'Lodge' } as CreateLodgeDto;
      expect(await controller.create(jwtData, mockCreateLodgeDto)).toEqual({
        lodgeId: '100',
      });
      expect(service.create).toHaveBeenCalledWith({
        ...mockCreateLodgeDto,
        userId: jwtData.id,
      });

      expect(photoService.saveLodgePhotos).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update lodge', async () => {
      const mockUpdateLodgeDto = { title: 'Lodge' } as CreateLodgeDto;
      expect(
        await controller.update(jwtData, 'lodgeid123', mockUpdateLodgeDto),
      ).toEqual({
        id: '100',
      });
      expect(service.update).toHaveBeenCalledWith(
        'lodgeid123',
        mockUpdateLodgeDto,
        jwtData.id,
      );

      expect(photoService.saveLodgePhotos).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should return lodge contact info', async () => {
      expect(await controller.remove(jwtData, '456')).toBeDefined();
      expect(service.remove).toHaveBeenCalledWith('456', jwtData.id);
    });
  });
});
