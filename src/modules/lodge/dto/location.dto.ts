import { IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  zipCode: string;

  @IsString()
  address: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  country: string;
}
