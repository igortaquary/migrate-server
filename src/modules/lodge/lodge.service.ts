import { Injectable } from '@nestjs/common';
import { CreateLodgeDto } from './dto/create-lodge.dto';
import { UpdateLodgeDto } from './dto/update-lodge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lodge } from 'src/database/entities/lodge.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { paginate } from 'src/utils/paginate/paginate';
import { SearchLodgeDto } from './dto/search-lodge.dto';

@Injectable()
export class LodgeService {
  constructor(
    @InjectRepository(Lodge)
    private lodgeRepository: Repository<Lodge>,
  ) {}

  create(lodge: CreateLodgeDto & { userId: string }) {
    console.log(lodge);
    return this.lodgeRepository.insert({
      ...lodge,
      user: { id: lodge.userId },
      institution: { id: lodge.institutionId },
    });
  }

  async search({ page }: SearchLodgeDto) {
    const take = 10;
    const skip = (page - 1) * take;

    const whereOptions: FindOptionsWhere<Lodge> = {};
    const [data, count] = await this.lodgeRepository.findAndCount({
      where: whereOptions,
      select: ['id', 'type', 'title', 'description', 'createdAt'],
      take,
      skip,
    });
    return paginate({
      page,
      count,
      data,
      limit: take,
    });
  }

  listByUserId(userId: string) {
    return this.lodgeRepository.find({ where: { user: { id: userId } } });
  }

  findOne(id: string) {
    return this.lodgeRepository.findOne({ where: { id } });
  }

  update(id: number, updateLodgeDto: UpdateLodgeDto) {
    console.log(updateLodgeDto);
    return `This action updates a #${id} lodge`;
  }

  remove(id: number) {
    return `This action removes a #${id} lodge`;
  }
}
