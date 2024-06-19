import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLodgeDto } from './dto/create-lodge.dto';
import { UpdateLodgeDto } from './dto/update-lodge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lodge } from 'src/database/entities/lodge.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { paginate } from 'src/utils/paginate/paginate';
import { SearchLodgeDto } from './dto/search-lodge.dto';
import { Location } from 'src/database/entities/location.entity';
import { getCoordinates } from 'src/utils/getCoordinates';
import { getDistanceFromLatLonInKm } from 'src/utils/latLngDistance/latLngDistance';
import { Institution } from 'src/database/entities/institution.entity';

@Injectable()
export class LodgeService {
  constructor(
    @InjectRepository(Lodge)
    private lodgeRepository: Repository<Lodge>,
  ) {}

  create(lodgeDto: CreateLodgeDto & { userId: string }) {
    const lodge = lodgeDto;
    const location = lodgeDto.location;
    lodge.location = null;
    return this.lodgeRepository.manager.transaction(async (manager) => {
      const coords = await getCoordinates(location);
      const locInsert = await manager.insert(Location, {
        ...location,
        ...coords,
      });
      return manager.insert(Lodge, {
        ...lodge,
        institution: { id: lodgeDto.institutionId },
        user: { id: lodgeDto.userId },
        location: { id: locInsert.identifiers[0].id },
      });
    });
  }

  async search({ page }: SearchLodgeDto) {
    const take = 10;
    const skip = (page - 1) * take;

    const whereOptions: FindOptionsWhere<Lodge> = {};
    const [data, count] = await this.lodgeRepository.findAndCount({
      where: whereOptions,
      select: ['id', 'type', 'title', 'description', 'createdAt'],
      relations: { institution: true, location: true },
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
    return this.lodgeRepository.find({
      where: { user: { id: userId } },
      relations: { location: true, institution: true },
      order: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.lodgeRepository.findOne({ where: { id } });
  }

  async update(id: string, updateLodgeDto: UpdateLodgeDto, userId?: string) {
    const lodgeToUpdate = await this.lodgeRepository.findOne({
      where: { id },
      relations: { user: true, location: true },
    });
    if (!lodgeToUpdate) throw new NotFoundException();

    if (lodgeToUpdate.user.id !== userId) throw new UnauthorizedException();

    const { location, institutionId, ...lodge } = updateLodgeDto;

    return this.lodgeRepository.manager.transaction(async (manager) => {
      if (location?.id) {
        const coords = await getCoordinates(location);
        await manager.update(Location, location.id, { ...location, ...coords });
        if (
          location.latitude !== coords.latitude ||
          location.longitude !== coords.longitude
        ) {
          const institution = await manager.findOne(Institution, {
            where: { id: institutionId },
            relations: { location: true },
          });
          lodgeToUpdate.distanceFromInstitution = getDistanceFromLatLonInKm(
            coords.latitude,
            coords.longitude,
            institution.location.latitude,
            institution.location.longitude,
          );
        }
      }
      return manager.save(Lodge, {
        ...lodge,
        id,
        distanceFromInstitution: lodgeToUpdate.distanceFromInstitution,
        institution: { id: institutionId },
      });
    });
  }

  async remove(id: string, userId: string) {
    const lodgeToUpdate = await this.lodgeRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!lodgeToUpdate) throw new NotFoundException();

    if (lodgeToUpdate.user.id !== userId) throw new UnauthorizedException();

    return this.lodgeRepository.softDelete(id);
  }
}
