import { Injectable } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Institution } from 'src/database/entities/institution.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Institution)
    private institutionRepository: Repository<Institution>,
  ) {}

  create(createInstitutionDto: CreateInstitutionDto) {
    console.log(createInstitutionDto);
    return this.institutionRepository.insert(createInstitutionDto);
  }

  findAll() {
    return `This action returns all institution`;
  }

  findOne(id: number) {
    return `This action returns a #${id} institution`;
  }

  update(id: number, updateInstitutionDto: UpdateInstitutionDto) {
    console.log(updateInstitutionDto);
    return `This action updates a #${id} institution`;
  }

  remove(id: number) {
    return `This action removes a #${id} institution`;
  }
}
