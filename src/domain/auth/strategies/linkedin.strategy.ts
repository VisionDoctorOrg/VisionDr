import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-linkedin-oauth2';
import { VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { AuthProvider } from '@prisma/client';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    console.log(profile);
    const userData = {
      linkedinId: id,
      email: emails[0].value,
      fullName: `${name?.firstName} ${name?.lastName}`,
      picture: photos[0].value,
      authProvider: AuthProvider.LINKEDIN,
    };

    const user = await this.authService.validateLinkedInUser(userData);
    done(null, user);
  }
}
