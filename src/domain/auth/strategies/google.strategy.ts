import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
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

    // Log profile information for debugging
    console.log('Google profile:', profile);

    const user = {
      googleId: id,
      email: emails[0].value,
      firstName: name?.givenName || displayName.split(' ')[0],
      lastName: name?.familyName || displayName.split(' ').slice(1).join(' '),
      picture: photos[0]?.value || null,
      provider,
      displayName,
      accessToken,
      refreshToken,
    };

    // Log constructed user object for debugging
    console.log('Constructed user:', user);

    done(null, user);
  }
}
