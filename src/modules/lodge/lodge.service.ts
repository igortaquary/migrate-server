import { Injectable } from '@nestjs/common';
import { CreateLodgeDto } from './dto/create-lodge.dto';
import { UpdateLodgeDto } from './dto/update-lodge.dto';

@Injectable()
export class LodgeService {
  create(createLodgeDto: CreateLodgeDto) {
    console.log(createLodgeDto);
    return 'This action adds a new lodge';
  }

  findAll() {
    return `This action returns all lodge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lodge`;
  }

  update(id: number, updateLodgeDto: UpdateLodgeDto) {
    console.log(updateLodgeDto);
    return `This action updates a #${id} lodge`;
  }

  remove(id: number) {
    return `This action removes a #${id} lodge`;
  }
}
