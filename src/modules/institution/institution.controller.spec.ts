import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

describe('InstitutionController', () => {
  let controller: InstitutionController;
  let service: InstitutionService;

  const mockInstitutionService = {
    create: jest.fn().mockImplementation((dto: CreateInstitutionDto) => {
      return { id: '1', ...dto };
    }),
    findByState: jest.fn().mockImplementation((state: string) => {
      return [{ id: '1', name: 'Institution 1', state }];
    }),
    findAll: jest.fn().mockImplementation(() => {
      return [{ id: '1', name: 'Institution 1' }];
    }),
    findOne: jest.fn().mockImplementation((id: string) => {
      return { id, name: 'Institution 1' };
    }),
    update: jest
      .fn()
      .mockImplementation((id: string, dto: UpdateInstitutionDto) => {
        return { id, ...dto };
      }),
    remove: jest.fn().mockImplementation((id: string) => {
      return { id };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionController],
      providers: [
        {
          provide: InstitutionService,
          useValue: mockInstitutionService,
        },
      ],
    }).compile();

    controller = module.get<InstitutionController>(InstitutionController);
    service = module.get<InstitutionService>(InstitutionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new institution', async () => {
      const dto = { name: 'New Institution' } as CreateInstitutionDto;
      expect(await controller.create(dto)).toEqual({
        id: '1',
        ...dto,
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findByState', () => {
    it('should return institutions by state', async () => {
      const state = 'NY';
      expect(await controller.findByState({ state })).toEqual([
        { id: '1', name: 'Institution 1', state },
      ]);
      expect(service.findByState).toHaveBeenCalledWith(state);
    });
  });

  describe('findAll', () => {
    it('should return an array of institutions', async () => {
      expect(await controller.findAll()).toEqual([
        { id: '1', name: 'Institution 1' },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single institution by id', async () => {
      const id = '1';
      expect(await controller.findOne(id)).toEqual({
        id,
        name: 'Institution 1',
      });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an institution', async () => {
      const id = '1';
      const dto: UpdateInstitutionDto = { name: 'Updated Institution' };
      expect(controller.update(id, dto)).toEqual({
        id,
        ...dto,
      });
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove an institution', async () => {
      const id = '1';
      expect(controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
