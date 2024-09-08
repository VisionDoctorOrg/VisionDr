import { Injectable } from '@nestjs/common';
import { ContactUsDto } from 'src/application/contactUs';
import { CreateSubscriptionDto } from 'src/application/subscription';
import { PrismaService } from 'src/common';
import { ContactUs } from 'src/domain/contactUs/entities';
import { Subscription } from 'src/domain/subscription/entities';
import { SubscriptionRepository } from 'src/domain/subscription/interfaces';

@Injectable()
export class subscriptionRepository implements SubscriptionRepository {
  constructor(private readonly repository: PrismaService) {}

  public async create(
    CreateSubscriptionDto: CreateSubscriptionDto,
  ): Promise<any> {
    // return await this.repository.subscription.create({
    //   data: {
    //     name: contact.fullName,
    //     message: contact.message,
    //     phone: contact.phone,
    //     email: contact.email,
    //     type: contact.type,
    //   },
    // });
  }
}
