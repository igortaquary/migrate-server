import { IsInt } from 'class-validator';

export class SearchLodgeDto {
  @IsInt()
  page: number = 1;
}
