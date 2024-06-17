import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LodgeType, SpaceType } from 'src/database/entities/lodge.entity';

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

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  institutionId: string;
}
