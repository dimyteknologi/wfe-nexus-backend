import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt-constant';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret || 'fallback_secret_should_not_happen',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      role: payload.role,
      cityId: payload.cityId,
      permissions: payload.permissions
    };
  }
}
