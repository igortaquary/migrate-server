import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { LodgeModule } from './modules/lodge/lodge.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppconfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';

import { User } from './database/entities/user.entity';
import { Institution } from './database/entities/institution.entity';
import { Lodge } from './database/entities/lodge.entity';
import { Photo } from './database/entities/photo.entity';

@Module({
  imports: [
    AppconfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_SCHEMA'),
        entities: [User, Institution, Lodge, Photo],
        synchronize: true,
        logging: 'all',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    LodgeModule,
    InstitutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}