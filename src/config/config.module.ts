import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './application.config';

const modules = [ConfigModule.forRoot({ load: [AppConfig] })];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class AppconfigModule {}
