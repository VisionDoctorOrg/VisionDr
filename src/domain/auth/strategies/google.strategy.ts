import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, displayName, emails, photos, provider } = profile;

    const userData = {
      googleId: id,
      email: emails[0].value,
      fullName: `${name?.givenName || displayName.split(' ')[0]} ${name?.familyName || displayName.split(' ').slice(1).join(' ')}`,
      picture: photos[0]?.value || null,
      authProvider: provider,
    };

    const user = await this.authService.validateGoogleUser(userData);
    done(null, user);
  }
}
