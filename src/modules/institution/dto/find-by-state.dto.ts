import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn } from 'class-validator';
import { BR_STATES } from '../../../database/entities/location.entity';

export class FindByStateParamsDto {
  @ApiProperty()
  @IsIn(BR_STATES)
  @Expose()
  state: string;
}
