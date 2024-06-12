import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(user: Partial<User>) {
    return this.usersRepository.insert(user);
  }

  findOne(uuid: string) {
    return this.usersRepository.findOne({ where: { id: uuid } });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  update(uuid: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${uuid} user ${updateUserDto}`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
