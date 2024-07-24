import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  AllExceptionsFilter,
  JwtAuthService,
  PrismaModule,
  UserInterceptor,
} from './common';
import { ConfigModule } from './config';
import { AuthModule } from './domain/auth/auth.module';
import { WaitlistModule } from './domain/waitlist/waitlist.module';
import { ContactUsModule } from './domain/contactUs/contactUs.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    WaitlistModule,
    ContactUsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
