import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BR_STATES } from 'src/database/entities/location.entity';
import { LodgeType, SpaceType } from 'src/database/entities/lodge.entity';

export class SearchLodgeDto {
  @ApiProperty({ type: 'number', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Expose()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ type: 'enum', enum: LodgeType, required: false })
  @IsOptional()
  @Expose()
  @IsEnum(LodgeType)
  @Type(() => Number)
  type: LodgeType;

  @ApiProperty({ type: 'enum', enum: SpaceType, required: false })
  @IsOptional()
  @Expose()
  @IsEnum(SpaceType)
  @Type(() => Number)
  space: SpaceType;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  @IsIn(['male', 'female', 'any'])
  gender: 'male' | 'female' | 'any';

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  @Expose()
  @IsIn(BR_STATES)
  state: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  institutionId: string;
}
