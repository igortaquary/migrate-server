import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtData } from './dto/jwt-data.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload: JwtData = {
      sub: user.id,
      id: user.id,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(payload: SignUpDto) {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(payload.password, salt);

    const user: Partial<User> = {
      ...payload,
      password: hashPass,
      salt,
    };

    return this.userService.create(user);
  }
}
