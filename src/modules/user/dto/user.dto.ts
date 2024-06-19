import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  @IsIn(genders)
  @IsOptional()
  gender?: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password']),
) {}
