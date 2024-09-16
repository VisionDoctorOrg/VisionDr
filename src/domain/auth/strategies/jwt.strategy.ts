import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';
import { TokenPayload } from '../interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          if (request?.cookies?.Authentication) {
            return request.cookies.Authentication;
          }

          if (request?.Authentication) {
            return request.Authentication;
          }

          if (request?.headers?.authentication) {
            return request.headers.authentication;
          }

          if (request?.headers?.authorization) {
            const authHeader = request.headers.authorization;

            if (authHeader.startsWith('Bearer ')) {
              return authHeader.split(' ')[1];
            }
          }

          return null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token, please login');
    }

    const user = await this.usersService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('No user found for the given token.');
    }

    return user;
  }
}
