import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LodgeService } from './lodge.service';
import { CreateLodgeDto } from './dto/create-lodge.dto';
import { UpdateLodgeDto } from './dto/update-lodge.dto';

@Controller('lodge')
export class LodgeController {
  constructor(private readonly lodgeService: LodgeService) {}

  @Post()
  create(@Body() createLodgeDto: CreateLodgeDto) {
    return this.lodgeService.create(createLodgeDto);
  }

  @Get()
  findAll() {
    return this.lodgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lodgeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLodgeDto: UpdateLodgeDto) {
    return this.lodgeService.update(+id, updateLodgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lodgeService.remove(+id);
  }
}
