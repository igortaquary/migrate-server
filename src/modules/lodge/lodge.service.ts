import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateLodgeDto } from './dto/create-lodge.dto';
import { UpdateLodgeDto } from './dto/update-lodge.dto';
import { SearchLodgeDto } from './dto/search-lodge.dto';

import { paginate } from '../../utils/paginate/paginate';
import { getCoordinates } from '../../utils/getCoordinates';
import { getDistanceFromLatLonInKm } from '../../utils/latLngDistance/latLngDistance';

import { Location } from '../../database/entities/location.entity';
import { Lodge, LodgeStatus } from '../../database/entities/lodge.entity';
import { Institution } from '../../database/entities/institution.entity';

@Injectable()
export class LodgeService {
  constructor(
    @InjectRepository(Lodge)
    private lodgeRepository: Repository<Lodge>,
  ) {}

  create(lodgeDto: CreateLodgeDto & { userId: string }) {
    const lodge = lodgeDto;
    const location = lodgeDto.location;
    lodge.photos = undefined;
    lodge.location = undefined;
    return this.lodgeRepository.manager.transaction(async (manager) => {
      const coords = await getCoordinates(location);
      const locInsert = await manager.insert(Location, {
        ...location,
        ...coords,
      });
      if (lodge.institutionId && coords.latitude) {
        const institution = await manager.findOne(Institution, {
          where: { id: lodgeDto.institutionId },
          relations: { location: true },
        });
        lodge.distanceFromInstitution = getDistanceFromLatLonInKm(
          coords.latitude,
          coords.longitude,
          institution.location.latitude,
          institution.location.longitude,
        );
      }
      const { identifiers } = await manager.insert(Lodge, {
        ...lodge,
        institution: { id: lodgeDto.institutionId },
        user: { id: lodgeDto.userId },
        location: { id: locInsert.identifiers[0].id },
      });
      return identifiers[0].id;
    });
  }

  async search({
    page = 1,
    gender,
    space,
    institutionId,
    type,
    state,
  }: SearchLodgeDto) {
    const take = 10;
    const skip = (page - 1) * take;

    const whereOptions: FindOptionsWhere<Lodge> = {
      status: LodgeStatus.ACTIVE,
    };

    if (gender) whereOptions.gender = gender;
    if (space) whereOptions.space = space;
    if (type) whereOptions.type = type;
    if (institutionId) whereOptions.institution = { id: institutionId };
    if (state) whereOptions.location = { state };

    const [data, count] = await this.lodgeRepository.findAndCount({
      where: whereOptions,
      select: [
        'id',
        'type',
        'title',
        'description',
        'gender',
        'price',
        'createdAt',
      ],
      relations: { institution: true, location: true, photos: true },
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
      relations: {
        location: true,
        institution: true,
        photos: true,
      },
      order: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.lodgeRepository.findOne({
      where: { id },
      relations: {
        location: true,
        institution: { location: true },
        photos: true,
      },
    });
  }

  async getContactInfo(id: string) {
    const result = await this.lodgeRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (result && result.user) {
      if (result.contactInfo === 'email') {
        return { email: result.user.email };
      } else if (result.contactInfo === 'phone') {
        return { phone: result.user.phone };
      } else {
        return { phone: result.user.phone, email: result.user.email };
      }
    }
    throw new NotFoundException();
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
      // Se localização precisa ser atualizada:
      if (location?.id) {
        const coords = await getCoordinates(location);
        await manager.update(Location, location.id, { ...location, ...coords });
        if (
          coords.latitude &&
          (location.latitude !== coords.latitude ||
            location.longitude !== coords.longitude)
        ) {
          const institution = await manager.findOne(Institution, {
            where: { id: institutionId },
            relations: { location: true },
          });
          lodge.distanceFromInstitution = getDistanceFromLatLonInKm(
            coords.latitude,
            coords.longitude,
            institution.location.latitude,
            institution.location.longitude,
          );
        }
      }
      // fim
      return manager.save(Lodge, {
        ...lodge,
        id,
        institution: { id: institutionId },
        photos: undefined,
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
