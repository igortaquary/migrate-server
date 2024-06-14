import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

const genders = ['male', 'female', 'other'];

export class CreateUserDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty({ type: 'string' })
  @IsIn(genders)
  @IsOptional()
  gender?: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password']),
) {}
