import { Get, Controller, Post, Body } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Public } from '../auth/auth.guard';
import { PhotoDto } from './dto/photo.dto';

@Controller('photo')
export class PhotoController {
  constructor(private service: PhotoService) {}

  @Get('')
  @Public()
  check() {
    return this.service.check();
  }

  @Post('')
  @Public()
  addImage(@Body() body: PhotoDto) {
    return this.service.savePhoto(body);
  }
}
