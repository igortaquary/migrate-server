import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LodgeService } from './lodge.service';
import { CreateLodgeDto } from './dto/create-lodge.dto';
import { UpdateLodgeDto } from './dto/update-lodge.dto';
import { SearchLodgeDto } from './dto/search-lodge.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public, User } from '../auth/auth.guard';
import { JwtData } from '../auth/dto/jwt-data.dto';
import { PhotoService } from '../photo/photo.service';

@ApiTags('Lodge')
@Controller('lodge')
export class LodgeController {
  constructor(
    private readonly lodgeService: LodgeService,
    private readonly photoService: PhotoService,
  ) {}

  @Get()
  @Public()
  search(@Query() query: SearchLodgeDto) {
    return this.lodgeService.search(query);
  }

  @Get('profile')
  @ApiBearerAuth()
  listFromUser(@User() user: JwtData) {
    return this.lodgeService.listByUserId(user.id);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.lodgeService.findOne(id);
  }

  @Get(':id/contact')
  @ApiBearerAuth()
  getContactInfo(@Param('id') id: string) {
    return this.lodgeService.getContactInfo(id);
  }

  @Post()
  @ApiBearerAuth()
  async create(@User() user: JwtData, @Body() createLodgeDto: CreateLodgeDto) {
    const lodgeId = await this.lodgeService.create({
      ...createLodgeDto,
      userId: user.id,
    });
    //await this.photoService.saveLodgePhotos(lodgeId, createLodgeDto.photos);
    return { lodgeId };
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @User() user: JwtData,
    @Param('id') id: string,
    @Body() updateLodgeDto: UpdateLodgeDto,
  ) {
    return this.photoService.saveLodgePhotos(id, updateLodgeDto.photos);
    // return this.lodgeService.update(id, updateLodgeDto, user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@User() user: JwtData, @Param('id') id: string) {
    return this.lodgeService.remove(id, user.id);
  }
}
