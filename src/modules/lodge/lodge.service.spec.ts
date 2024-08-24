import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LodgeService } from './lodge.service';
import {
  Lodge,
  LodgeType,
  SpaceType,
} from '../../database/entities/lodge.entity';
import { CreateLodgeDto } from './dto/create-lodge.dto';
import { UpdateLodgeDto } from './dto/update-lodge.dto';
import { getCoordinates } from '../../utils/getCoordinates';
import { getDistanceFromLatLonInKm } from '../../utils/latLngDistance/latLngDistance';
import { LocationDto } from './dto/location.dto';
import { SearchLodgeDto } from './dto/search-lodge.dto';

jest.mock('../../utils/getCoordinates');
jest.mock('../../utils/latLngDistance/latLngDistance');

const mockLodgeRepository = {
  create: jest.fn().mockImplementation(() => {
    return '1';
  }),
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
  findAndCount: jest.fn(),
  manager: {
    transaction: jest.fn(),
  },
};

describe('LodgeService', () => {
  let service: LodgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LodgeService,
        {
          provide: getRepositoryToken(Lodge),
          useValue: mockLodgeRepository,
        },
      ],
    }).compile();

    service = module.get<LodgeService>(LodgeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new lodge', async () => {
      const createLodgeDto = {
        title: 'acomodacao',
        description: 'descricao',
        institutionId: 'institutionId ',
        location: {},
      } as CreateLodgeDto;

      const mockCoords = { latitude: 1.234, longitude: 5.678 };
      (getCoordinates as jest.Mock).mockResolvedValue(mockCoords);

      const mockLocInsertResult = { identifiers: [{ id: '1' }] };
      const mockLodgeInsertResult = { identifiers: [{ id: '2' }] };
      mockLodgeRepository.manager.transaction.mockImplementation(
        async (cb: any) => {
          return cb({
            insert: jest
              .fn()
              .mockResolvedValueOnce(mockLocInsertResult)
              .mockResolvedValueOnce(mockLodgeInsertResult),
            findOne: jest.fn().mockResolvedValue({ location: {} }),
          });
        },
      );

      const result = await service.create({
        ...createLodgeDto,
        userId: 'userid',
      });
      expect(getCoordinates).toHaveBeenCalledTimes(1);
      expect(getDistanceFromLatLonInKm).toHaveBeenCalledTimes(1);
      expect(result).toEqual('2');
    });
  });

  describe('search', () => {
    it('should search without params', async () => {
      mockLodgeRepository.findAndCount.mockResolvedValue([[], 0]);
      expect(await service.search({})).toBeDefined();
    });

    it('should search with all params', async () => {
      mockLodgeRepository.findAndCount.mockResolvedValue([[], 0]);
      const searchParams: SearchLodgeDto = {
        gender: 'any',
        institutionId: '123',
        page: 2,
        space: SpaceType.HOUSE,
        state: 'DF',
        type: LodgeType.ENTIRE,
      };
      expect(await service.search(searchParams)).toBeDefined();
    });
  });

  describe('listByUserId', () => {
    it('should search without params', async () => {
      mockLodgeRepository.find.mockResolvedValue({ id: 'userId' });
      expect(await service.listByUserId('userId')).toEqual({ id: 'userId' });
    });
  });

  describe('findOne', () => {
    it('should return a lodge if found', async () => {
      const lodge = { id: '1' };
      mockLodgeRepository.findOne.mockResolvedValue(lodge);

      const result = await service.findOne('1');
      expect(result).toEqual(lodge);
      expect(mockLodgeRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: {
          location: true,
          institution: { location: true },
          photos: true,
        },
      });
    });
  });

  describe('getContactInfo', () => {
    it('should return all contact info', async () => {
      mockLodgeRepository.findOne.mockResolvedValue({
        contactInfo: 'all',
        user: { phone: 'phone', email: 'email' },
      });
      expect(await service.getContactInfo('userId')).toEqual({
        phone: 'phone',
        email: 'email',
      });
    });

    it('should return only phone', async () => {
      mockLodgeRepository.findOne.mockResolvedValue({
        contactInfo: 'phone',
        user: { phone: '12345678', email: 'email' },
      });
      expect(await service.getContactInfo('userId')).toEqual({
        phone: '12345678',
      });
    });

    it('should return only email', async () => {
      mockLodgeRepository.findOne.mockResolvedValue({
        contactInfo: 'email',
        user: { phone: '12345678', email: 'email' },
      });
      expect(await service.getContactInfo('userId')).toEqual({
        email: 'email',
      });
    });

    it('should throw not found error if lodge not found', () => {
      mockLodgeRepository.findOne.mockResolvedValue(null);
      expect(service.getContactInfo('userId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a lodge without location', async () => {
      const updateLodgeDto: UpdateLodgeDto = { title: 'Updated Title' };
      const lodge = { id: '1', user: { id: 'user1' }, location: {} };

      mockLodgeRepository.findOne.mockResolvedValue(lodge);

      const mockLocInsertResult = { identifiers: [{ id: '1' }] };
      const mockLodgeInsertResult = { identifiers: [{ id: '2' }] };

      mockLodgeRepository.manager.transaction.mockImplementation(
        async (cb: any) => {
          return cb({
            save: jest.fn().mockResolvedValue({
              ...lodge,
              ...updateLodgeDto,
            }),
            insert: jest
              .fn()
              .mockResolvedValueOnce(mockLocInsertResult)
              .mockResolvedValueOnce(mockLodgeInsertResult),
            findOne: jest.fn().mockResolvedValue({ location: {} }),
          });
        },
      );

      const result = await service.update('1', updateLodgeDto, 'user1');
      expect(result.title).toEqual('Updated Title');
      expect(mockLodgeRepository.findOne).toHaveBeenCalled();
    });

    it('should update a lodge with location', async () => {
      const updateLodgeDto: UpdateLodgeDto = {
        title: 'Updated Title',
        location: { id: 'locationID' } as LocationDto,
      };
      const lodge = { id: '1', user: { id: 'user1' }, location: {} };

      mockLodgeRepository.findOne.mockResolvedValue(lodge);

      const mockCoords = { latitude: 1.234, longitude: 5.678 };
      (getCoordinates as jest.Mock).mockResolvedValue(mockCoords);

      const mockLocInsertResult = { identifiers: [{ id: '1' }] };

      mockLodgeRepository.manager.transaction.mockImplementation(
        async (cb: any) => {
          return cb({
            save: jest.fn().mockResolvedValue({
              ...lodge,
              ...updateLodgeDto,
            }),
            update: jest.fn().mockResolvedValueOnce(mockLocInsertResult),
            findOne: jest.fn().mockResolvedValue({ location: {} }),
          });
        },
      );

      const result = await service.update('1', updateLodgeDto, 'user1');
      expect(result.title).toEqual('Updated Title');
      expect(mockLodgeRepository.findOne).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const lodge = { id: '1', user: { id: 'user2' } };
      mockLodgeRepository.findOne.mockResolvedValue(lodge);

      await expect(
        service.update('1', {} as UpdateLodgeDto, 'user1'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if lodge not found', async () => {
      mockLodgeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('1', {} as UpdateLodgeDto, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a lodge', async () => {
      const lodge = { id: '1', user: { id: 'user1' } };
      mockLodgeRepository.findOne.mockResolvedValue(lodge);

      await service.remove('1', 'user1');
      expect(mockLodgeRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if lodge is not found', async () => {
      mockLodgeRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const lodge = { id: '1', user: { id: 'user2' } };
      mockLodgeRepository.findOne.mockResolvedValue(lodge);

      await expect(service.remove('1', 'user1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
