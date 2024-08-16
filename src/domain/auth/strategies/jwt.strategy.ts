import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/domain/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/domain/users/services/users.service';
import { TokenPayload } from '../interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload): Promise<User> {
    console.log(
      "configService.get('JWT_SECRET'),",
      this.configService.get('JWT_SECRET'),
    );
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
