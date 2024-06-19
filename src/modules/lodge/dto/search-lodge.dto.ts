import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SearchLodgeDto {
  @ApiProperty({ type: 'number', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Expose()
  @Type(() => Number)
  page: number = 1;
}
