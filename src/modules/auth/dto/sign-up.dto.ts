import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

const genders = ['male', 'female', 'other'];

export class SignUpDto {
  @ApiProperty({ type: 'string' })
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
