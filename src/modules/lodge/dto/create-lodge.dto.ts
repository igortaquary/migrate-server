import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  DirectionMode,
  LodgeType,
  SpaceType,
} from 'src/database/entities/lodge.entity';
import { LocationDto } from './location.dto';
import { Expose, Type } from 'class-transformer';
import { PhotoDto } from '../../photo/dto/photo.dto';

export class CreateLodgeDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

  @ApiProperty({ type: 'enum', enum: LodgeType })
  @Expose()
  @IsEnum(LodgeType)
  type: LodgeType;

  @ApiProperty({ type: 'enum', enum: SpaceType })
  @Expose()
  @IsEnum(SpaceType)
  space: SpaceType;

  @ApiProperty({ type: 'enum', enum: DirectionMode })
  @Expose()
  @IsEnum(DirectionMode)
  @ValidateIf((obj) => obj.institutionId)
  directionMode: DirectionMode;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  @IsIn(['phone', 'email', 'all'])
  contactInfo: 'phone' | 'email' | 'all';

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  @IsIn(['male', 'female', 'any'])
  gender: 'male' | 'female' | 'any';

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsOptional()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ type: 'string' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  institutionId: string;

  @ApiProperty({ type: [PhotoDto] })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoDto)
  @IsOptional()
  photos?: PhotoDto[];

  distanceFromInstitution: number;
}
