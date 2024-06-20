import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { BR_STATES } from 'src/database/entities/location.entity';

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
  @IsIn(BR_STATES)
  state: string;

  @ApiProperty()
  @IsString()
  @Expose()
  city: string;

  @ApiProperty()
  @IsString()
  @Expose()
  district: string;

  @ApiProperty({ default: 'Brasil' })
  @IsString()
  @IsOptional()
  @Expose()
  country: string = 'Brasil';

  latitude: string;
  longitude: string;
}
