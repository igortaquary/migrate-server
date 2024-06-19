import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LodgeType, SpaceType } from 'src/database/entities/lodge.entity';
import { LocationDto } from './location.dto';
import { Expose, Type } from 'class-transformer';

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
}
