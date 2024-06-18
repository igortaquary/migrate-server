import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { LodgeType, SpaceType } from 'src/database/entities/lodge.entity';
import { LocationDto } from './location.dto';
import { Type } from 'class-transformer';

export class CreateLodgeDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'enum', enum: LodgeType })
  @IsEnum(LodgeType)
  type: LodgeType;

  @ApiProperty({ type: 'enum', enum: SpaceType })
  @IsEnum(SpaceType)
  space: SpaceType;

  @Type(() => LocationDto)
  @IsNotEmpty()
  @ValidateNested()
  location: LocationDto;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  institutionId: string;
}
