import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';
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
    try {
      return this.usersRepository.insert(user);
    } catch (err) {
      throw new ConflictException();
    }
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
