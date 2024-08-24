import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionService } from './institution.service';
import { Institution } from '../../database/entities/institution.entity';
import { Location } from '../../database/entities/location.entity';
import { getCoordinates } from '../../utils/getCoordinates';
import { NotImplementedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationDto } from '../lodge/dto/location.dto';

jest.mock('../../utils/getCoordinates');

describe('InstitutionService', () => {
  let service: InstitutionService;

  const mockInstitutionRepository = {
    manager: {
      transaction: jest.fn(),
    },
    find: jest.fn(),
  };

  const mockLocationRepository = {
    insert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionService,
        {
          provide: getRepositoryToken(Institution),
          useValue: mockInstitutionRepository,
        },
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<InstitutionService>(InstitutionService);
  });

  describe('create', () => {
    it('should create an institution and its location in a transaction', async () => {
      const createInstitutionDto = {
        name: 'Test Institution',
        location: { city: 'Test City', state: 'Test State' } as LocationDto,
      };

      const mockCoords = { latitude: 1.234, longitude: 5.678 };
      const mockLocInsertResult = { identifiers: [{ id: 1 }] };
      const mockInstitutionInsertResult = { identifiers: [{ id: 2 }] };

      (getCoordinates as jest.Mock).mockResolvedValue(mockCoords);

      mockInstitutionRepository.manager.transaction.mockImplementation(
        async (cb: any) => {
          return cb({
            insert: jest
              .fn()
              .mockResolvedValueOnce(mockLocInsertResult)
              .mockResolvedValueOnce(mockInstitutionInsertResult),
          });
        },
      );

      const result = await service.create(createInstitutionDto);

      expect(getCoordinates).toHaveBeenCalled();
      expect(mockInstitutionRepository.manager.transaction).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toMatchObject(mockInstitutionInsertResult);
    });
  });

  describe('findByState', () => {
    it('should return institutions by state', async () => {
      const state = 'Test State';
      const mockInstitutions = [{ id: '1', name: 'Institution 1' }];
      mockInstitutionRepository.find.mockResolvedValue(mockInstitutions);

      const result = await service.findByState(state);

      expect(mockInstitutionRepository.find).toHaveBeenCalledWith({
        where: { location: { state } },
      });
      expect(result).toEqual(mockInstitutions);
    });
  });

  describe('findAll', () => {
    it('should return all institutions', async () => {
      const mockInstitutions = [{ id: '1', name: 'Institution 1' }];
      mockInstitutionRepository.find.mockResolvedValue(mockInstitutions);

      const result = await service.findAll();

      expect(mockInstitutionRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockInstitutions);
    });
  });

  describe('findOne', () => {
    it('should return a single institution by id', async () => {
      const id = '1';
      const mockInstitution = { id, name: 'Institution 1' };
      mockInstitutionRepository.find.mockResolvedValue([mockInstitution]);

      const result = await service.findOne(id);

      expect(mockInstitutionRepository.find).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual([mockInstitution]);
    });
  });

  describe('update', () => {
    it('should throw NotImplementedException when update is called', () => {
      expect(() => service.update('1', {})).toThrow(NotImplementedException);
    });
  });

  describe('remove', () => {
    it('should throw NotImplementedException when remove is called', () => {
      expect(() => service.remove('1')).toThrow(NotImplementedException);
    });
  });
});
