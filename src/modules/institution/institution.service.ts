import { Injectable } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  create(createInstitutionDto: CreateInstitutionDto) {
    console.log(createInstitutionDto);
    return 'This action adds a new institution';
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
