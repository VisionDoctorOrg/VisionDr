import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';
import { TokenPayload } from '../interface'; // Ensure this interface is correctly defined

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          // Try to extract the JWT token from various sources in the request

          // 1. From cookies
          if (request?.cookies?.Authentication) {
            return request.cookies.Authentication;
          }
          // 2. From a custom request property
          if (request?.Authentication) {
            return request.Authentication;
          }
          // 3. From a custom header
          if (request?.headers?.authentication) {
            return request.headers.authentication;
          }
          // 4. From the standard Authorization header with Bearer scheme
          if (request?.headers?.authorization) {
            const authHeader = request.headers.authorization;
            console.log('Authorization header:', authHeader);
            if (authHeader.startsWith('Bearer ')) {
              return authHeader.split(' ')[1];
            }
          }

          // If no token is found, return null to indicate failure
          return null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
