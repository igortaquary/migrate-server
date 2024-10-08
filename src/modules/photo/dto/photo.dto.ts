import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class PhotoDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  @ValidateIf((obj) => !obj.id)
  url?: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  order: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsIn(['create', 'edit', 'delete'])
  action: 'create' | 'edit' | 'delete';
}
