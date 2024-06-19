import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @Expose()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  @Expose()
  state: string;

  @ApiProperty()
  @IsString()
  @Expose()
  city: string;

  @ApiProperty()
  @IsString()
  @Expose()
  district: string;

  @ApiProperty()
  @IsString()
  @Expose()
  country: string;

  latitude: string;
  longitude: string;
}
