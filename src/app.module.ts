import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter, JwtAuthService, PrismaModule } from './common';
import { ConfigModule } from './config';
import { AuthModule } from './domain/auth/auth.module';
import { WaitlistModule } from './domain/waitlist/waitlist.module';
import { ContactUsModule } from './domain/contactUs/contactUs.module';
import { UsersModule } from './domain/users/users.module';
import { QuestionnaireModule } from './domain/Questionnaire';
import { SubscriptionModule } from './domain/subscription/subscription.module';
import { NotificationModule } from './domain/notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    WaitlistModule,
    ContactUsModule,
    QuestionnaireModule,
    SubscriptionModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthService,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
