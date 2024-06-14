import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtData } from '../auth/dto/jwt-data.dto';
import { User } from '../auth/auth.guard';

@ApiTags('User')
@ApiBearerAuth()
@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findProfile(@User() user: JwtData) {
    return this.userService.findOne(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch()
  update(@User() user: JwtData, @Body() updateUserDto: UpdateUserDto) {
    console.log(user);
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete()
  remove(@User() user: JwtData) {
    return this.userService.remove(user.id);
  }
}
