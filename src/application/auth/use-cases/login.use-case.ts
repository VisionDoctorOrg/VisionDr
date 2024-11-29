import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { User } from 'src/domain/users/entities/user.entity';
import { Status } from '@prisma/client';
import { SubscriptionService } from 'src/domain/subscription/services';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(data: User): Promise<User> {
    const identifier: string = data.email ? data.email : data.phoneNumber;

    const { user, accessToken } = await this.authService.login(identifier);
    if (user.activated && user.activated === Status.Inactive) {
      throw new HttpException('Account not activated', HttpStatus.BAD_REQUEST);
    } else if (user.activated && user.activated === Status.Deactivated) {
      throw new HttpException('Account  Deactivated', HttpStatus.BAD_REQUEST);
    }
    const loginResponse = AuthMapper.toLoginDto(user, accessToken);

    return loginResponse;
  }

  async activate(data: User): Promise<void> {
    const user = await this.authService.findByEmail(data.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.activated = Status.Active;
    user.subscriptionActive = Status.Active;
    await this.authService.updateUser(user);
  }

  async subscribe(data: User): Promise<void> {
    const user = await this.authService.findByEmail(data.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log('user:', user);
    if (!user.subscriptions) {
      console.log('Not found creating subscription:');
      // Automatically create a free subscription plan for the new user
      await this.subscriptionService.initializeSubscription(user.id, {
        amount: 0,
        plan: 'free-plan-id',
      });
    }
  }
}
