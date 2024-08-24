import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Institution } from '../../database/entities/institution.entity';
import { Repository } from 'typeorm';
import { Location } from '../../database/entities/location.entity';
import { getCoordinates } from '../../utils/getCoordinates';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Institution)
    private institutionRepository: Repository<Institution>,
  ) {}

  async create(createInstitutionDto: CreateInstitutionDto) {
    const lodge = createInstitutionDto;
    const location = createInstitutionDto.location;
    lodge.location = null;

    return this.institutionRepository.manager.transaction(async (manager) => {
      const coords = await getCoordinates(location);
      const locInsert = await manager.insert(Location, {
        ...location,
        ...coords,
      });
      return manager.insert(Institution, {
        ...lodge,
        location: { id: locInsert.identifiers[0].id },
      });
    });
  }

  findByState(state: string) {
    return this.institutionRepository.find({
      where: { location: { state } },
    });
  }

  findAll() {
    return this.institutionRepository.find();
  }

  findOne(id: string) {
    return this.institutionRepository.find({ where: { id } });
  }

  update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
    console.log(updateInstitutionDto);
    throw new NotImplementedException();
  }

  remove(id: string) {
    throw new NotImplementedException(id);
  }
}
