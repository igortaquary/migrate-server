import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<string> {
    const insertResult = await this.usersRepository.insert(user);
    return insertResult.identifiers[0].id;
  }

  findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'gender'],
    });
  }

  // Used by auth service
  findOneByEmail(email: string): Promise<Partial<User>> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return id;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
