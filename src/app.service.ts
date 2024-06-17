import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDesc() {
    return 'Migrate';
  }
}
